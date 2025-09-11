import { Component, createRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { formHTML } from '../sources/Form';
import { DEFAULT_USER_AGENT, DEFAULT_URL } from '../helpers';

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
        const tag = typeof this.props.tag != "undefined" ? this.props.tag : "";
        if (typeof this.props.useRemote != "undefined" && this.props.useRemote == true) {
            loadContent = { uri: DEFAULT_URL + '?content=' + content + '&mathjax=' + mathjax + '&fontsize=' + fontsize + '&tag=' + tag };
        } else {
            loadContent = { html: formHTML(content, mathjax, fontsize, tag) };
        }
        return loadContent;
    }

    injectedJavaScript = `
        setTimeout(function() { 
            let event = { eventType: "onload", data: { scrollHeight: document.documentElement.scrollHeight } };
            console.log("document.documentElement.scrollHeight ", document.documentElement.scrollHeight);
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
        const tag = typeof this.props.tag != "undefined" ? this.props.tag : "";
        if (typeof infos.eventType != "undefined" && infos.eventType == "onload") {
            if (typeof infos.data.scrollHeight != "undefined" && tag == infos.data.tag) {
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