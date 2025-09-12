export const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
export const DEFAULT_URL = 'https://chainplatform.github.io/react-native-html-view/htmlview.html';
export function utf8ToBase64(str) {
    // return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    //     function toSolidBytes(match, p1) {
    //         return String.fromCharCode('0x' + p1);
    //     }));
    return encodeURIComponent(str);
}
export function base64ToUtf8(base64) {
    // return decodeURIComponent(atob(base64).split('').map(function (c) {
    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));
    return decodeURIComponent(base64);
}