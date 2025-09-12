import { Component, createRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { formHTML } from '../sources/Form';
import { DEFAULT_USER_AGENT, DEFAULT_URL, utf8ToBase64 } from '../helpers';

export default class HTMLView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            webHeight: 0
        }
        this.webRef = createRef(null);
    }

    getContent() {
        let loadContent = null;
        const content = typeof this.props.content != "undefined" ? this.props.content : "";
        const fontsize = typeof this.props.fontsize != "undefined" ? this.props.fontsize : 14;
        const mathjax = typeof this.props.mathjax != "undefined" ? this.props.mathjax : 0;
        const fontMathJax = typeof this.props.fontMathJax != "undefined" ? this.props.fontMathJax : 15;
        const htmltag = typeof this.props.htmltag != "undefined" ? this.props.htmltag : "";
        if (typeof this.props.useRemote != "undefined" && this.props.useRemote == true) {
            let base_content = utf8ToBase64(content);
            loadContent = { uri: DEFAULT_URL + '?content=' + base_content + '&mathjax=' + mathjax + '&fontsize=' + fontsize + '&htmltag=' + htmltag + '&fontMathJax=' + fontMathJax };
        } else {
            loadContent = { html: formHTML(content, mathjax, fontsize, fontMathJax, htmltag) };
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
            if (typeof infos.data.scrollHeight != "undefined" && htmltag == infos.data.htmltag) {
                this.setState({ webHeight: infos.data.scrollHeight });
            }
        }
    };

    render() {
        const content = this.getContent();
        return (
            <View style={{ height: this.state.webHeight }}>
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