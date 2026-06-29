import { Component, createRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { formHTML } from '../sources/Form';
import { DEFAULT_USER_AGENT, DEFAULT_URL, utf8ToBase64 } from '../helpers';

export default class HTMLView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            webHeight: 0,
            marginTop: 0
        }
        this.webRef = createRef(null);
    }

    getContent() {
        let loadContent = null;
        const content = typeof this.props.content != "undefined" ? this.props.content : "";
        const color = typeof this.props.color != "undefined" ? this.props.color : "#333";
        const fontsize = typeof this.props.fontsize != "undefined" ? this.props.fontsize : 14;
        const mathjax = typeof this.props.mathjax != "undefined" ? this.props.mathjax : 0;
        const fontMathJax = typeof this.props.fontMathJax != "undefined" ? this.props.fontMathJax : 15;
        const htmltag = typeof this.props.htmltag != "undefined" ? this.props.htmltag : "";
        if (typeof this.props.useRemote != "undefined" && this.props.useRemote == true) {
            let base_content = utf8ToBase64(content);
            loadContent = { uri: DEFAULT_URL + '?content=' + base_content + '&mathjax=' + mathjax + '&fontsize=' + fontsize + '&htmltag=' + encodeURIComponent(htmltag) + '&fontMathJax=' + fontMathJax + '&color=' + encodeURIComponent(color) };
        } else {
            loadContent = { html: formHTML(content, mathjax, fontsize, fontMathJax, color, htmltag) };
        }
        return loadContent;
    }

    getInjectedJavaScript() {
        const htmltag = typeof this.props.htmltag != "undefined" ? this.props.htmltag : "";
        const injectedJavaScript = typeof this.props.injectedJavaScript == "string" ? this.props.injectedJavaScript : "";

        return `
            (function() {
                var htmltag = ${JSON.stringify(htmltag)};
                var lastHeight = -1;
                var pendingFrame = null;

                function setAutoHeight(element) {
                    if (!element) return;
                    if (element.style.height !== "auto") {
                        element.style.height = "auto";
                    }
                    if (element.style.minHeight !== "0px" && element.style.minHeight !== "0") {
                        element.style.minHeight = "0";
                    }
                }

                function getContentHeight() {
                    var container = document.querySelector(".htmlview-container");
                    var body = document.body;
                    var documentElement = document.documentElement;

                    setAutoHeight(documentElement);
                    setAutoHeight(body);
                    setAutoHeight(container);

                    var rect = container ? container.getBoundingClientRect() : null;

                    return Math.ceil(Math.max(
                        container ? container.scrollHeight : 0,
                        container ? container.offsetHeight : 0,
                        rect ? rect.bottom : 0,
                        body ? body.scrollHeight : 0,
                        body ? body.offsetHeight : 0
                    ));
                }

                function postHeight() {
                    pendingFrame = null;
                    var scrollHeight = getContentHeight();
                    if (scrollHeight === lastHeight) return;

                    lastHeight = scrollHeight;
                    var event = { eventType: "onload", data: { scrollHeight: scrollHeight, htmltag: htmltag } };
                    var target = window.ReactNativeWebView || window.parent || window;

                    if (target && target.postMessage) {
                        target.postMessage(JSON.stringify(event), "*");
                    }
                }

                function schedulePostHeight() {
                    if (pendingFrame !== null) return;
                    pendingFrame = setTimeout(postHeight, 16);
                }

                var target = document.querySelector(".htmlview-container") || document.body || document.documentElement;
                if (target && window.MutationObserver) {
                    new MutationObserver(schedulePostHeight).observe(target, {
                        attributes: true,
                        childList: true,
                        characterData: true,
                        subtree: true
                    });
                }
                if (target && window.ResizeObserver) {
                    new ResizeObserver(schedulePostHeight).observe(target);
                }

                document.addEventListener("DOMContentLoaded", schedulePostHeight);
                window.addEventListener("load", schedulePostHeight);
                document.addEventListener("load", function(event) {
                    if (event.target && event.target.tagName === "IMG") {
                        schedulePostHeight();
                    }
                }, true);

                schedulePostHeight();
                setTimeout(schedulePostHeight, 100);
                setTimeout(schedulePostHeight, 500);
                setTimeout(schedulePostHeight, 1000);
            })();
            ${injectedJavaScript}
            true;
        `;
    }

    onMessage = (event) => {
        let infos = event.nativeEvent.data;
        if (typeof event.nativeEvent.data != "object") {
            try {
                infos = JSON.parse(event.nativeEvent.data);
            } catch (error) {
                return;
            }
        }
        if (typeof infos.eventType != "undefined" && infos.eventType == "onload" && typeof infos.data != "undefined") {
            const htmltag = typeof this.props.htmltag != "undefined" ? this.props.htmltag : "";
            const marginTop = typeof this.props.marginTop != "undefined" ? this.props.marginTop : 0;
            let minSize = typeof this.props.minSize != "undefined" ? this.props.minSize : 21;
            if (typeof infos.data.scrollHeight != "undefined" && htmltag == infos.data.htmltag) {
                const scrollHeight = Math.ceil(Number(infos.data.scrollHeight));
                if (!Number.isFinite(scrollHeight)) return;
                minSize = minSize < scrollHeight ? scrollHeight : minSize;
                if (this.state.webHeight != minSize || this.state.marginTop != marginTop) {
                    this.setState({ webHeight: minSize, marginTop: marginTop });
                }
            }
        }
    };

    render() {
        const content = this.getContent();
        return (
            <View style={{ height: this.state.webHeight, marginTop: this.state.marginTop }}>
                <WebView
                    ref={this.webRef}
                    scalesPageToFit={true}
                    overScrollMode={"never"}
                    nestedScrollEnabled={true}
                    automaticallyAdjustContentInsets={true}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
                    originWhitelist={['*']}
                    mixedContentMode="compatibility"
                    {...this.props}
                    source={content}
                    injectedJavaScript={this.getInjectedJavaScript()}
                    userAgent={
                        typeof this.props.forceAndroidAutoplay != "undefined" ? Platform.select({ android: DEFAULT_USER_AGENT, ios: '' }) : ''
                    }
                    onShouldStartLoadWithRequest={event => { return true; }}
                    onMessage={this.onMessage}
                />
            </View>
        );
    }
};
