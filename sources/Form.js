export function formHTML(content = "", mathjax = 1, fontsize = 13, fontMathJax = 15, htmltag = "") {
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
                        font-family: system-ui, sans-serif;
                        font-size: ${fontsize}px;
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
                    .MathJax {
                        font-size: ${fontMathJax}px !important;
                    }

                    mjx-math {
                        padding: 0px 0;
                    }
                </style>
            </head>
            <body>
                <div class="htmlview-container">${content}</div>
                <script>
                    MathJax = {
                        loader: {
                            load: [
                                "input/asciimath",
                                "output/chtml"
                            ]
                        }
                    }
                </script>
                <script>
                    function sendMessageToParent(event) {
                        (window.ReactNativeWebView || window.parent || window).postMessage(JSON.stringify(event), '*');
                    }
                </script>
                <script>
                    let mathVal = ${mathjax} == 1 ? true : false;
                    if (mathVal == true) {
                        let tag = document.createElement('script');
                        tag.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/startup.js';
                        tag.defer = true;
                        tag.onload = () => {
                            window.onload = (event) => {
                                sendMessageToParent({ eventType: "onload", data: { scrollHeight: document.documentElement.scrollHeight, htmltag: '${htmltag}' } });
                            };
                        };
                        tag.onerror = () => { };
                        let firstScriptTag = document.getElementsByTagName('script')[1];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    }
                </script>
            </body>
        </html>`;
}