import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import 'lit/polyfill-support.js';

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var WebComponents: any;
}

function applyPolyfills() {
  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = 'node_modules/@webcomponents/webcomponentsjs/';
}

export {applyPolyfills};
