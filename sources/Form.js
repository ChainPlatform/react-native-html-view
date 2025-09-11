export function formHTML(content = "", mathjax = 1) {
    return `<!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="initial-scale=1, maximum-scale=1">
                <title>HTML View</title>
                <meta charset="utf-8">
                <meta name="author" content="santran686@gmail.com">
                <meta name="author" content="chainplatform.net">
                <style>
                    html {
                        overflow-y: hidden;
                        overflow-x: hidden;
                        height: 100%;
                    }
                    body {
                        background-color: transparent;
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                    }
                    .htmlview-container {
                        position: relative;
                        max-width: 100%;
                        width: 100%;
                        height: 100%;
                    }
                    * {
                        touch-action: pan-x pan-y;
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                    *:focus {
                        outline: none;
                    }
                </style>
                <script>
                    function sendMessageToParent(event) {
                        (window.ReactNativeWebView || window.parent || window).postMessage(JSON.stringify(event), '*');
                    }
                    sendMessageToParent({ eventType: "onload", data: { scrollHeight: document.documentElement.scrollHeight } });
                    let mathVal = ${mathjax} == 1 ? true : false;
                    if (mathVal == true) {
                        let tag = document.createElement('script');
                        tag.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js';
                        tag.onload = () => {
                            sendMessageToParent({ eventType: "onload", data: { scrollHeight: document.documentElement.scrollHeight } });
                            window.addEventListener("message", function (events) {
                                let infos = events.data;
                                if (typeof events.data != "object") {
                                    infos = JSON.parse(events.data);
                                }
                            })
                        };
                        tag.onerror = () => { };
                        let firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    }
                </script>
            </head>
            <body>
                <div class="htmlview-container">${content}</div>
            </body>
        </html>`;
}