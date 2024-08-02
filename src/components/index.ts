import './icon';
import './loading';
import './button';
import './dialog';
import './input';
import './tips';
import YcDialog from './dialog';

declare global {
  interface Window {
    yssWebC: {
        $ycDialog: typeof YcDialog;
    }
  }
}

window.yssWebC = window.yssWebC || {};
window.yssWebC.$ycDialog = YcDialog;

export {};
