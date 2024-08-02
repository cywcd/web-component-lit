import {html, LitElement, PropertyValueMap} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import styleOne from './style.scss';
import {join, PREFIX, handle} from '../utils/namespace';

const defaultIconsUrl = `
@font-face {
  font-family: ${join('icon')}; /* Project id 4640497 */
  src: url('//at.alicdn.com/t/c/font_4640497_oh5e10g7swf.woff2?t=1722501892253') format('woff2'),
    url('//at.alicdn.com/t/c/font_4640497_oh5e10g7swf.woff?t=1722501892253') format('woff'),
    url('//at.alicdn.com/t/c/font_4640497_oh5e10g7swf.ttf?t=1722501892253') format('truetype');
}

@font-face {
  font-family: ${join('icon-lovely')}; /* Project id 2914379 */
  src: url('//at.alicdn.com/t/c/font_2914379_abca1akhv1o.woff2?t=1661930836565') format('woff2'),
    url('//at.alicdn.com/t/c/font_2914379_abca1akhv1o.woff?t=1661930836565') format('woff'),
    url('//at.alicdn.com/t/c/font_2914379_abca1akhv1o.ttf?t=1661930836565') format('truetype');
}

@font-face {
  font-family:${join('icon-popular')}; /* Project id 2914381 */
  src: url('//at.alicdn.com/t/c/font_2914381_3wmammyd5bl.woff2?t=1661930832349') format('woff2'),
    url('//at.alicdn.com/t/c/font_2914381_3wmammyd5bl.woff?t=1661930832349') format('woff'),
    url('//at.alicdn.com/t/c/font_2914381_3wmammyd5bl.ttf?t=1661930832349') format('truetype');
}
`;

@customElement('yc-icon')
export default class YcIcon extends LitElement {
  @property({type: String, reflect: false}) extClass?: string;
  @property({type: String, reflect: true}) extStyle?: string;
  @property({type: String, reflect: false}) name: string | undefined;
  @property({type: String, reflect: false}) color?: string;
  @property({type: Number, reflect: false}) size?: string | number;
  @property({type: Boolean, reflect: false}) spin?: boolean;
  @property({type: String, reflect: false}) rotate?: string | number;
  @property({type: String, reflect: false}) icon_prefix?: string;
  @property({type: String, reflect: false}) hyphen?: string = '-';
  @property({type: String, reflect: false}) iconStyle?: string;
  static override styles = styleOne;
  constructor() {
    super();
  }

  setIconStyle(prefix: string, fontFace: string) {
    if (!document.getElementById(prefix)) {
      const head = document.head || document.getElementsByTagName('head')[0];
      const style = document.createElement('style');
      style.id = prefix;
      style.innerText = fontFace;
      head.appendChild(style);
    }
  }

  // 生成图标类名
  get iconClass() {
    let className: string | string[] = '';
    const {
      icon_prefix = '',
      hyphen = '-',
      name = '',
      spin,
      extClass = '',
    } = this;
    const iconClass = join('icon');
    const iconBase = join('icon-base');
    className = [iconClass, iconBase];
    const fontFamily = icon_prefix ? icon_prefix : iconClass;
    const prefixClass = icon_prefix ? `${icon_prefix}${hyphen}` : '';
    const nameClass = name ? `${fontFamily}${hyphen}${name}` : '';
    const spinClass = spin ? `${iconBase}-spin` : '';
    if (prefixClass) {
      className.push(prefixClass);
    }
    if (nameClass) {
      className.push(nameClass);
    }
    if (spinClass) {
      className.push(spinClass);
    }
    if (extClass) {
      className.push(extClass);
    }
    return className;
  }

  get classListStr() {
    const classesStr = this.iconClass.join(' ').trim();
    return classesStr;
  }

  // 生成内联样式
  get iconStyles() {
    const {
      color = '',
      size = '18',
      rotate = '',
      extStyle = '',
      iconStyle = '',
      icon_prefix = '',
    } = this;
    const style = [];
    style.push(`display:inline-flex`);
    if (extStyle) {
      if (typeof extStyle === 'string') {
        style.push(extStyle);
      } else {
        Object.keys(extStyle).forEach((key) => {
          style.push(`${key}:${extStyle[key]}`);
        });
      }
    }
    if (rotate) {
      const REGEXP = /^-?[0-9]+(.[0-9]+)?$/;
      let rotateStyle = '';
      if (REGEXP.test(`${rotate}`)) {
        rotateStyle = rotate + 'deg';
      }
      style.push(`transform:rotate(${rotateStyle})`);
    }
    if (size) {
      style.push(`font-size:${size}px`);
    }
    if (iconStyle && ['lovely', 'popular'].indexOf(iconStyle) !== -1) {
      style.push(
        `--icon-family:${handle('icon', [iconStyle])},${join('icon')}`
      );
    }
    if (color) {
      style.push(`color:${color}`);
    }
    if (icon_prefix) {
      style.push(`--protected-icon-family: ${icon_prefix}`);
    }
    return style.join(';');
  }

  override connectedCallback() {
    super.connectedCallback();
    // this.iconClass.forEach((item) => {
    //   this.classList.add(item);
    // })
    this.style.cssText = this.iconStyles;
  }

  override updated(changedProperties: PropertyValueMap<any>) {
    super.updated(changedProperties);
    // this.iconClass.forEach((item) => {
    //   this.classList.add(item);
    // })
    this.style.cssText = this.iconStyles;
  }

  override firstUpdated() {
    const prefix = this.prefix || PREFIX;
    this.setIconStyle(prefix, defaultIconsUrl);
  }

  override render() {
    return html`<i class="${this.classListStr}"></i>`
  }
}
