import {  html, LitElement } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getValidityResult, ValidateItemResult } from '../helper/formValidate';
import { throttle, debounce } from '../utils/eventHelper';
import NP from 'number-precision';
import YcButton from '../button/index';
import YcTips from '../tips/index';
import inputStyleObj from './style.scss';
type inputtype = 'text' | 'password' | 'email' | 'url' | 'number' | 'tel' | 'search';
type CustomValidateMethode = {
    method: (input: unknown) => ValidateItemResult
}
class MinInputClass extends LitElement {
    public get input(): HTMLInputElement | unknown {
        return this;
    }
    @property({ type: String, reflect: true })
    name!: string;
    @property({ type: String, reflect: false }) value = '';
    @property({ type: Boolean, reflect: true }) invalid = false;
    @property({ type: Boolean, reflect: true }) novalidate = false;
    @property({ type: Boolean, reflect: true }) required = false;
    @property({ type: String, reflect: true })
    errorMessage!: string;
    @property({ type: String, reflect: true })
    pattern!: string;
    @property({ type: Number, reflect: true })
    minLength!: number;
    @property({ type: Number, reflect: true })
    maxLength!: number;
    @property({ type: Number, reflect: true })
    min!: number;
    @property({ type: Number, reflect: true })
    max!: number;
    @property({ type: Number, reflect: true }) step?: number = 1;
    @property({ type: Object, attribute: false }) customValidateMethod?: CustomValidateMethode ;
    get validity(): boolean {
        return getValidityResult(this).valid;
    }
    get validityResult() {
        return getValidityResult(this);
    }
    get validationMessage(): string {
        const result = getValidityResult(this);
        if (!result.valid) {
            const errorMessage = this.errorMessage;
            if (errorMessage === null || errorMessage === undefined) {
                const array = result.message;
                const message = array[0].message;
                return message;
            } else {
                return errorMessage;
            }
        } else {
            return '';
        }
    }

}

@customElement('yc-input')
class YcInput extends MinInputClass {
    @property({ type: String, reflect: true }) label?: string;
    @property({ type: String, reflect: true })
    tips!: string;
    @property({ type: String, reflect: false }) errortips?: string;
    @property({ type: Boolean, reflect: true }) disabled?: boolean = false;
    @property({ type: Boolean, reflect: true }) readOnly?: boolean = false;
    @property({ type: String, reflect: true }) type: inputtype = 'text';
    @property({ type: String, reflect: true })
    placeholder!: string;
    @property({ type: String, reflect: false }) leftIcon?: string;
    @property({ type: String, reflect: false }) rightIcon?: string;
    @property({ type: Boolean, reflect: true }) block?: boolean = false;
    @property({ type: Boolean, reflect: true }) clear?: boolean = false;
    @property({ type: Number, reflect: true }) debounce?: number = undefined;
    @property({ type: Number, reflect: true }) throttle?: number = undefined;
    @property({ type: Boolean, reflect: true }) showStep?: boolean = false;
    static override get styles() { return inputStyleObj }
    public checkValidity() {
        if (this.novalidate || this.disabled || this.form && this.form.novalidate) {
            return true;
        }
        if (this.validity) {
            this.ycTips.show = 'false';
            this.invalid = false;
            this.ycTips.tips = '';
            return true;
        } else {
            this.ycTips.show = 'true';
            this.invalid = true;
            this.input?.setCustomValidity('');
            this.ycTips.tips = this.validationMessage;
            return false;
        }
    }


    override get input(): HTMLInputElement {
        return this.renderRoot.querySelector('#input') as HTMLInputElement;
    }

    override focus() {
        this.input!.focus();
    }
    reset() {
        this.value = '';
        this.input!.value = '';
        this.invalid = false;
        this.ycTips.tips = '';
        this.ycTips.show = 'false';
    }
    get form(): HTMLFormElement | null {
        return this.closest('form,p-form');
    }
    private typePassword() {
        const btn: YcButton = this.renderRoot.querySelector('#eye-icon') as YcButton;
        if (this.type === 'password') {
            this.type = 'text';
            btn.icon = 'eye';
        } else {
            this.type = 'password';
            btn.icon = 'eye-close';
        }
    }
    clearValue() {
        this.reset();
    }
    searchValue() {
        this.dispatchEvent(new CustomEvent('submit', {
            detail: {
                value: this.value
            }
        }));
    }
    dispatchChange() {
        this.checkValidity();
        new CustomEvent('change', {
            bubbles:true,
            detail: { value: this.input.value }
        });
    }
    dispatchFocus() {
        const changeEvent = new CustomEvent('focus', {
            detail: { value: this.input.value }
        });
        this.dispatchEvent(changeEvent);
        this.checkValidity();
    }
    private __debounceHander!: () => void;
    private __throttHander!: () => void;
    _dispatchInput() {
        const inputEvent = new CustomEvent('input', {
            bubbles:true,
            cancelable: true,
            detail: { value: this.input.value }
        });
        this.dispatchEvent(inputEvent);
    }
    private static NUMBERINPUTARRAY: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
    // private _processInputInvlaide(event: Event) {
    //     this.input.setCustomValidity('');
    // }
    private _processInput(event: InputEvent) {
        this.input.setCustomValidity('');
        if (this.type === 'number') {
            if (event.data && YcInput.NUMBERINPUTARRAY.indexOf(event.data) === -1) {
                const indexOf = this.input.value.lastIndexOf(event.data);
                if (indexOf >= -1) {
                    this.input.value = this.input.value.substring(0, indexOf);
                }
                event.preventDefault();
            }
            if (this.input.value !== '-') {
                const v = Number(this.input.value);
                if (isNaN(v)) {
                    this.input.value = '';
                }
            }
        }
        if (this.maxLength !== undefined && this.input.value.length > this.maxLength) {
            this.input.value = this.input.value.substr(0, this.maxLength);
        }
        this.value = this.input.value;
        this.checkValidity();
        // const inputEl = this;
        event.stopPropagation();
        if (this.debounce && this.debounce > 0) {
            if (this.__debounceHander === undefined) {
                this.__debounceHander = debounce(() => {
                    this._dispatchInput();
                }, this.debounce);
            }
            this.__debounceHander();
        } else if (this.throttle && this.throttle > 0) {
            if (this.__throttHander === undefined) {
                this.__throttHander = throttle(() => {
                    this._dispatchInput();
                }, this.throttle);
            }
        } else {
            this._dispatchInput();
        }
    }
    override update(changedProperties: Map<string | number | symbol, unknown>) {
        // const inputEl = this;
        super.update(changedProperties);
        if (changedProperties.has('throttle') && this.throttle !== undefined) {
            this.__throttHander = throttle(() => {
                this._dispatchInput();
            }, this.throttle);
        } else if (changedProperties.has('debounce') && this.debounce !== undefined) {
            if (this.__debounceHander === undefined) {
                this.__debounceHander = debounce(() => {
                    this._dispatchInput();
                }, this.debounce);
            }
        }
    }
    override updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (changedProperties.has('type')) {
            this.ycTips.show = 'false';
            this.ycTips.tips = '';
            this.invalid = false;

            if (this.value !== '' && this.type === 'number') {
                const n = Number(this.value);
                if (isNaN(n)) {
                    this.value = '';
                }
            }
        }
    }
    get ycTips(): YcTips {
        return this.renderRoot.querySelector('#tips') as YcTips;
    }
    
    private firstTypePassword = false;
    override firstUpdated() {
        if (this.type === 'password') {
            this.firstTypePassword = true;
        }
    }
    private _stepAdd() {
        if (this.step === undefined) {
            this.step = 1;
        }
        let n = Number(this.value);
        if (this.max === undefined || (n + Number(this.step) < this.max)) {
            n = NP.plus(n, this.step);
            this.value = n.toString();
            this.dispatchChange();
        }
    }
    private _stepDel() {
        if (this.step === undefined) {
            this.step = 1;
        }
        let n = Number(this.value);
        if (this.min === undefined || (n - Number(this.step) >= this.min)) {
            n = NP.minus(n, this.step);
            this.value = n.toString();
            this.dispatchChange();
        }
    }
    private _innerType() {
        return this.type;
    }
    override render() {
        return html`<yc-tips .tips=${this.tips} id="tips">
            ${this.leftIcon ? html`<yc-icon name='${this.leftIcon}' class='leftIcon'></yc-icon>` : ''}
            <input id="input" part="input" name="${ifDefined(this.name)}"
                placeholder="${ifDefined(this.label ? this.label : this.placeholder)}" .value="${this.value}"
                @input="${this._processInput}" @change="${this.dispatchChange}" ?readOnly=${this.readOnly}
                .type="${this._innerType()}" ?disabled=${this.disabled} step="${ifDefined(this.step)}"
                min="${ifDefined(this.min)}" max="${ifDefined(this.max)}" minLength="${ifDefined(this.minLength)}"
                maxLength="${ifDefined(this.maxLength)}" @focus=${this.dispatchFocus} />
            ${this.label ? html`<label class='input-label'>${this.label}</label>` : ''}
            ${this.firstTypePassword ? html`<p-button class='eye-icon' id='eye-icon' part="show-password-icon" @click='${this.typePassword}'
                icon="eye-close" type="flat" shape="circle"></p-button>` : ''}
            ${this.clear ? html`<p-button icon='close-circle' class='clearIcon' part="clear-icon" type='flat' @click=${this.clearValue}></p-button>` : ''}
            ${this.type === 'search' ? html`<p-button icon='search' class='eye-icon' part="search-icon" @click=${this.searchValue} type="flat"></p-button>` : ''}
            ${this.type === 'number' && this.showStep ? html`<div class="btn-right btn-number">
                <p-button id="btn-add" icon="up" part="number-up" @click="${this._stepAdd}" type="flat" shape="circle"></p-button>
                <p-button id="btn-sub" @click="${this._stepDel}" part="number-down" icon="down" shape="circle" type="flat"></p-button>
            </div>` : ''}
            ${this.rightIcon ? html`<yc-icon name='${this.rightIcon}' class='rightIcon'></yc-icon>` : ''}
            <slot></slot>
        </yc-tips>`;
    }
}
export { YcInput };

declare global {
    interface HTMLElementTagNameMap {
        'yc-input': YcInput;
    }
}