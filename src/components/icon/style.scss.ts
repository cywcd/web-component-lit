import {css} from 'lit';
export default css`
  @font-face {
    font-family: 'yc-icon';
    src: url('//at.alicdn.com/t/c/font_4640497_oh5e10g7swf.woff2?t=1722501892253')
        format('woff2'),
      url('//at.alicdn.com/t/c/font_4640497_oh5e10g7swf.woff?t=1722501892253')
        format('woff'),
      url('//at.alicdn.com/t/c/font_4640497_oh5e10g7swf.ttf?t=1722501892253')
        format('truetype');
  }
  @font-face {
    font-family: 'yc-icon-lovely';
    src: url('//at.alicdn.com/t/c/font_2914379_abca1akhv1o.woff2?t=1661930836565')
        format('woff2'),
      url('//at.alicdn.com/t/c/font_2914379_abca1akhv1o.woff?t=1661930836565')
        format('woff'),
      url('//at.alicdn.com/t/c/font_2914379_abca1akhv1o.ttf?t=1661930836565')
        format('truetype');
  }
  @font-face {
    font-family: 'yc-icon-popular';
    src: url('//at.alicdn.com/t/c/font_2914381_3wmammyd5bl.woff2?t=1661930832349')
        format('woff2'),
      url('//at.alicdn.com/t/c/font_2914381_3wmammyd5bl.woff?t=1661930832349')
        format('woff'),
      url('//at.alicdn.com/t/c/font_2914381_3wmammyd5bl.ttf?t=1661930832349')
        format('truetype');
  }
  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    to {
      transform: rotate(1turn);
    }
  }
  .yc-icon-base {
    color: var(--protected-icon-color, var(--icon-color, inherit));
    font-size: var(--protected-icon-font-size, var(--icon-font-size, inherit));
  }
  .yc-icon-base-spin {
    animation: spin 1s linear infinite;
  }
  .yc-icon {
    display: var(--protected-icon-display, var(--icon-display, inline-flex));
    position: relative;
    font-family: var(--protected-icon-family, var(--icon-family, 'yc-icon'));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-style: normal;
    line-height: var(
      --protected-icon-line-height,
      var(--icon-line-height, normal)
    );
  }
  .yc-icon-add:before {
    content: '\\e694';
  }
  .yc-icon-cloud_download:before {
    content: '\\e687';
  }
  .yc-icon-check_circle:before {
    content: '\\e682';
  }
  .yc-icon-close:before {
    content: '\\e680';
  }
  .yc-icon-minus_circle:before {
    content: '\\e681';
  }
  .yc-icon-ellipsis:before {
    content: '\\e670';
  }
  .yc-icon-error_circle:before {
    content: '\\e669';
  }
  .yc-icon-question_circle:before {
    content: '\\e655';
  }
  .yc-icon-time:before {
    content: '\\e660';
  }
  .yc-icon-warning:before {
    content: '\\e665';
  }
  .yc-icon-prompt_circle:before {
    content: '\\e653';
  }
  .yc-icon-search:before {
    content: '\\e668';
  }
  .yc-icon-setting:before {
    content: '\\e64b';
  }
  .yc-icon-size:before {
    content: '\\e659';
  }
  .yc-icon-outdent:before {
    content: '\\e6b1';
  }
  .yc-icon-unorderedlist:before {
    content: '\\e6bd';
  }
  .yc-icon-add_circle_o:before {
    content: '\\e686';
  }
  .yc-icon-cancel_circle_o:before {
    content: '\\e67f';
  }
  .yc-icon-check_circle_o:before {
    content: '\\e677';
  }
  .yc-icon-error_circle_o:before {
    content: '\\e672';
  }
  .yc-icon-warning_o:before {
    content: '\\e66e';
  }
  .yc-icon-prompt_circle_o:before {
    content: '\\e65d';
  }
  .yc-icon-question_circle_o:before {
    content: '\\e64d';
  }
`;
