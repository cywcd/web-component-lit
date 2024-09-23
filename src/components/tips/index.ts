import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import style1 from './style.scss';
type showType = 'true' | 'false' | '';
type typeType = 'success' | 'warning' | 'error';
type dirType =
  | 'top'
  | 'topleft'
  | 'topright'
  | 'left'
  | 'lefttop'
  | 'leftbottom'
  | 'bottom'
  | 'bottomleft'
  | 'bottomright'
  | 'right'
  | 'righttop'
  | 'rightbottom'
  | 'auto';
@customElement('yc-tips')
export default class YcTips extends LitElement {
  static override get styles() {
    return [style1];
  }
  @property({type: String, reflect: true}) show: showType = '';
  @property({type: String, reflect: true}) tips = '';
  @property({type: String, reflect: true}) color = '';
  @property({type: String, reflect: true}) type: typeType = 'success';
  @property({type: String, reflect: true}) override dir: dirType = 'auto';

  private _isAutoDir = false;
  private _autoHander: EventListenerOrEventListenerObject | undefined;
  override firstUpdated(_changeMap: Map<string | number | symbol, unknown>) {
    if (this.dir === 'auto') {
      this._isAutoDir = true;
      const hander = () => {
        if (this._isAutoDir) {
          this._caculateAutoDir();
        }
      };
      this.addEventListener('mouseenter', hander);
      this._autoHander = hander;
    }
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      'mouseoenter',
      this._autoHander as EventListenerOrEventListenerObject
    );
  }
  private _caculateAutoDir() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    if (this.dir === 'auto' || this._isAutoDir) {
      this._isAutoDir = true;
      const rect = this.getBoundingClientRect();
      const x = rect.left;
      const top = rect.top;
      const y = w - rect.right;
      const leftDistance = w * 0.62;
      const topDistance = h * 0.62;
      if (top >= topDistance) {
        this.dir = 'top';
      } else {
        this.dir = 'bottom';
      }
      if (x > leftDistance) {
        this.dir += 'right';
      } else if (y > leftDistance) {
        this.dir += 'left';
      }
    }
  }
  override render() {
    return html`<slot></slot>`;
  }

  override update(changeMap: Map<string | number | symbol, unknown>) {
    super.update(changeMap);
    if (changeMap.has('color')) {
      if (this.color) {
        this.style.setProperty('--color', this.color);
      } else {
        this.style.removeProperty('--color');
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'yc-tips': YcTips;
  }
}
