import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';
import PLodingStyle from './style.scss';
const isNumber = function (value: unknown) {
  return typeof value === 'number' && isFinite(value);
};
@customElement('yc-loading')
export default class YcLoading extends LitElement {
  static override get styles() {
    return PLodingStyle;
  }
  @property({type: String})
  size!: string;
  @property({type: String})
  color!: string;

  override render() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const styleObj: Record<string, any> = {};
    if (this.color != undefined) {
      styleObj['color'] = this.color;
    }
    if (this.size != undefined) {
      styleObj['font-size'] = this.size + (isNumber(this.size) ? 'px' : '');
    }
    return html`<svg
        class="loading"
        style="${styleMap(styleObj)}"
        id="loading"
        viewBox="22 22 44 44"
      >
        <circle
          class="circle"
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke-width="3.6"
        ></circle>
      </svg>
      <slot></slot> `;
  }
  get loadingEl() {
    return this.shadowRoot?.getElementById('loading');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'yc-loading': YcLoading;
  }
}
