import './icon';
import './loading';
import './button';
import './dialog';
import './input';
import './tips';
import YcDialog from './dialog';

declare global {
  interface Window {
    ycWebC: {
      $ycDialog: typeof YcDialog;
    };
  }
}

window.ycWebC = window.ycWebC || {};
window.ycWebC.$ycDialog = YcDialog;

export {};
