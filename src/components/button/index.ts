import {LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {} from '../icon/index';
import '../loading/index';
import styleButton from './style.scss';
import styleButtoGroup from './styleButtonGroup.scss';
import {ifDefined} from 'lit/directives/if-defined.js';
type targetType = '_blank' | '_parent' | '_self' | '_top';
type shapeType = 'circle' | '';
export type buttonTypeValue = 'primary' | 'danger' | 'flat' | 'dashed';

@customElement('yc-button')
export default class YcButton extends LitElement {
  static override get styles() {
    return styleButton;
  }

  /**
   * 是否禁用
   */
  @property({type: Boolean, reflect: true})
  disabled = false;
  @property({type: Boolean, reflect: true})
  block = false;
  @property({type: Boolean, reflect: true})
  toggle = false;
  @property({type: String, reflect: true})
  type: buttonTypeValue = 'primary';
  @property({type: String, reflect: true})
  shape: shapeType = '';
  @property({type: String, reflect: true})
  name!: string;
  @property({type: String, reflect: true})
  value!: string;
  @property({type: Boolean, reflect: true})
  checked = false;
  @property({type: Boolean, reflect: true}) loading = false;
  @property({type: String, reflect: true})
  href!: string;
  @property({type: String, reflect: false}) target: targetType = '_blank';
  @property({type: String, reflect: true})
  rel!: string;
  @property({type: String, reflect: true})
  download!: string; //下载图片名称
  @property({type: String, reflect: true})
  icon!: string;

  override firstUpdated() {
    this.addEventListener('click', (ev: MouseEvent) => {
      if (this.disabled) {
        ev.preventDefault();
      }
      const {left, top} = this.getBoundingClientRect();
      this.style.setProperty('--x', ev.clientX - left + 'px');
      this.style.setProperty('--y', ev.clientY - top + 'px');
      if (this.toggle) {
        this.checked = !this.checked;
      }
    });
    const handleKeyPress = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case 'Enter':
          ev.stopPropagation();
          break;
        default:
          break;
      }
    };
    this.btn?.addEventListener(
      'keydown' as keyof ElementEventMap,
      handleKeyPress as EventListener
    );
  }
  override render() {
    let renderIcon: TemplateResult | null = null;
    if (this.icon && this.icon != null) {
      renderIcon = html`<yc-icon .name="${this.icon}"> </yc-icon>`;
    }
    return html`${this.href
        ? html`<a
            id="btn"
            class="btn"
            disabled=${ifDefined(this.disabled)}
            download=${ifDefined(this.download)}
            href="${ifDefined(this.href)}"
            target=${ifDefined(this.target)}
          ></a>`
        : html`<button
            id="btn"
            class="btn"
            ?disabled=${this.disabled}
          ></button>`}
      ${this.loading ? html`<yc-loading id="loadingIcon"> </yc-loading>` : ''}
      ${renderIcon} <slot></slot>`;
  }
  get iconEl() {
    return this.renderRoot.querySelector('#icon');
  }
  get btn() {
    return this.renderRoot.querySelector('#btn');
  }
}

@customElement('yc-button-group')
export class YcButtonGroup extends LitElement {
  static override get styles() {
    return styleButtoGroup;
  }

  get elements(): NodeListOf<YcButton> {
    return this.querySelectorAll('yc-button');
  }
  override firstUpdated() {
    const slot = this.renderRoot.querySelector('#slot');
    const child = this.elements;
    slot?.addEventListener('slotchange', () => {
      const handler = (ev: Event) => {
        const button: YcButton = ev.target as YcButton;
        this.value = button.value;
        const e = new CustomEvent('change', {
          detail: {
            value: button.value,
          },
        });
        this.dispatchEvent(e);
      };
      child.forEach((el: YcButton) => {
        el.addEventListener('click', handler);
      });
    });
  }
  @property({type: String})
  value!: string;
  @property({type: String, reflect: true})
  name!: string;
  override render() {
    return html` <slot id="slot"></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'yc-button': YcButton;
    'yc-button-group': YcButtonGroup;
  }
}
