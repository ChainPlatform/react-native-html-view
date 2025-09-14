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
            loadContent = { uri: DEFAULT_URL + '?content=' + base_content + '&mathjax=' + mathjax + '&fontsize=' + fontsize + '&htmltag=' + htmltag + '&fontMathJax=' + fontMathJax + '&color=' + color };
        } else {
            loadContent = { html: formHTML(content, mathjax, fontsize, fontMathJax, color, htmltag) };
        }
        return loadContent;
    }

    injectedJavaScript = `
        setTimeout(function() { 
            let event = { eventType: "onload", data: { scrollHeight: document.documentElement.scrollHeight, htmltag: '${typeof this.props.htmltag != "undefined" ? this.props.htmltag : ""}' } };
            document.body.style.height = document.documentElement.scrollHeight + 'px';
            (window.ReactNativeWebView || window.parent || window).postMessage(JSON.stringify(event), '*');
        }, 500);
        true;
    `;

    onMessage = (event) => {
        let infos = event.nativeEvent.data;
        if (typeof event.nativeEvent.data != "object") {
            infos = JSON.parse(event.nativeEvent.data);
        }
        if (typeof infos.eventType != "undefined" && infos.eventType == "onload") {
            const htmltag = typeof this.props.htmltag != "undefined" ? this.props.htmltag : "";
            const marginTop = typeof this.props.marginTop != "undefined" ? this.props.marginTop : 0;
            let minSize = typeof this.props.minSize != "undefined" ? this.props.minSize : 21;
            if (typeof infos.data.scrollHeight != "undefined" && htmltag == infos.data.htmltag) {
                minSize = minSize < infos.data.scrollHeight ? infos.data.scrollHeight : minSize;
                this.setState({ webHeight: minSize, marginTop: marginTop });
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
                    // injectedJavaScript={this.injectedJavaScript}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
                    originWhitelist={['*']}
                    mixedContentMode="compatibility"
                    {...this.props}
                    source={content}
                    userAgent={
                        typeof this.props.forceAndroidAutoplay != "undefined" ? Platform.select({ android: DEFAULT_USER_AGENT, ios: '' }) : ''
                    }
                    onShouldStartLoadrWithRequest={event => { return true; }}
                    onMessage={this.onMessage}
                />
            </View>
        );
    }
};