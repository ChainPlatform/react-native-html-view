export function formHTML(content = "", mathjax = 1, fontsize = 13, fontMathJax = 15, color = "", htmltag = "") {
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
                        height: auto;
                        min-height: 0;
                    }
                    body {
                        font-family: system-ui, sans-serif;
                        font-size: ${fontsize}px;
                        color: ${color};
                        background-color: transparent;
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: auto;
                        min-height: 0;
                    }
                    .htmlview-container {
                        position: relative;
                        max-width: 100%;
                        width: 100%;
                        height: auto;
                        min-height: 0;
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
                    (function(htmltag) {
                        let lastHeight = -1;
                        let pendingFrame = null;

                        function getContentHeight() {
                            const container = document.querySelector(".htmlview-container");
                            const body = document.body;
                            const rect = container ? container.getBoundingClientRect() : null;

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
                            const scrollHeight = getContentHeight();
                            if (scrollHeight === lastHeight) return;

                            lastHeight = scrollHeight;
                            sendMessageToParent({
                                eventType: "onload",
                                data: {
                                    scrollHeight: scrollHeight,
                                    htmltag: htmltag
                                }
                            });
                        }

                        function schedulePostHeight() {
                            if (pendingFrame !== null) return;
                            pendingFrame = setTimeout(postHeight, 16);
                        }

                        const target = document.querySelector(".htmlview-container") || document.body || document.documentElement;
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

                        window.__htmlviewScheduleHeight = schedulePostHeight;
                        schedulePostHeight();
                        setTimeout(schedulePostHeight, 100);
                        setTimeout(schedulePostHeight, 500);
                        setTimeout(schedulePostHeight, 1000);
                    })(${JSON.stringify(htmltag)});
                </script>
                <script>
                    let mathVal = ${mathjax} == 1 ? true : false;
                    if (mathVal == true) {
                        MathJax.startup = {
                            pageReady: () => {
                                return MathJax.startup.defaultPageReady().then(() => {
                                    document.querySelectorAll('.MathJax').forEach(el => {
                                        el.style.fontSize = '${fontMathJax}px';
                                    });
                                    if (window.__htmlviewScheduleHeight) {
                                        window.__htmlviewScheduleHeight();
                                    }
                                });
                            }
                        };
                        let tag = document.createElement('script');
                        tag.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/startup.js';
                        tag.defer = true;
                        tag.onload = () => {
                            if (window.__htmlviewScheduleHeight) {
                                window.__htmlviewScheduleHeight();
                            }
                        };
                        tag.onerror = () => { };
                        let firstScriptTag = document.getElementsByTagName('script')[1];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    }
                </script>
            </body>
        </html>`;
}
