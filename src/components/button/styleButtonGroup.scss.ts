import {css} from 'lit';
export default css`
  :host {
    display: inline-flex;
  }
  ::slotted(yc-button:not(:first-of-type):not(:last-of-type)) {
    border-radius: 0;
  }
  ::slotted(yc-button) {
    margin: 0 !important;
  }
  ::slotted(yc-button:not(:first-of-type)) {
    margin-left: -1px !important;
  }
  ::slotted(yc-button[type]:not([type='dashed']):not(:first-of-type)) {
    margin-left: 1px !important;
  }
  ::slotted(yc-button:first-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  ::slotted(yc-button:last-of-type) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
