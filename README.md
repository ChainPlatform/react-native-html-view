# React Native HTML View
The library allows you to display html contents with react-native-webview without ejecting support both react-native and react-native-web.

<p align="center">
  <a href="https://github.com/ChainPlatform/react-native-html-view/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/html">
    <img src="https://img.shields.io/npm/v/@chainplatform/html?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/html">
    <img src="https://img.shields.io/npm/dt/@chainplatform/html.svg"></img>
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/html">
    <img src="https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20web-blue"></img>
  </a>
  <a href="https://github.com/ChainPlatform/react-native-html-view/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=doansan">
    <img src="https://img.shields.io/twitter/follow/doansan.svg?label=Follow%20@doansan" alt="Follow @doansan" />
  </a>
</p>

## Prequisites
- This library relies on [React Native Webview](https://www.npmjs.com/package/react-native-webview). Please follow [this guide](https://github.com/react-native-community/react-native-webview/blob/HEAD/docs/Getting-Started.md) to install in your project first.


## Installation

- Ensure you've completed the setps in [prequisites.](#prequisites)

- Install package via npm or yarn:

`npm install --save @chainplatform/html` OR `yarn add @chainplatform/html`

- If your project use react-native-web to build website:

`npm install --save @chainplatform/react-native-web-webview` OR `yarn add @chainplatform/react-native-web-webview`

Then setup by guide at: https://github.com/ChainPlatform/react-native-web-webview#readme

## Usage

- Import in your project

```javascript
import HTMLView from '@chainplatform/html';
```

```js
    <HTMLView content={this.content} />
```

## Component props

- `content` (String) - html content
- Support full Webview props

## Contributing
Pull requests are highly appreciated! For major changes, please open an issue first to discuss what you would like to change.

### Related Projects
- Other packages for react native and react native web: [ChainPlatform](https://github.com/ChainPlatform)

