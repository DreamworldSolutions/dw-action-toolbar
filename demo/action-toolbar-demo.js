import { LitElement, html, css } from 'lit-element';
import { flexLayout, alignment } from '@dreamworld/flex-layout';
import '../dw-action-toolbar';
class ActionToolbarDemo extends LitElement {
  static get styles() {
    return [
      flexLayout,
      alignment,
      css`
        :host {
          display: block;
          height: 36px;
          width: 36px;
          margin-left: 350px;
          --dw-select-bg-color: #FFF;
        }
      `
    ];
  } 

  static get properties() {
    return {
    };
  }

  constructor() {
    super();
    this.dialogTitle = 'Board actions';
    this.actions = [{name: 'OPEN', label: 'Open'}, {name: 'ADD', label: 'Add'}, {name: 'EDIT', label: 'Edit'}, {name: 'DELETE', label: 'Delete'}, {name: 'DOWNLOAD', label: 'Download'}];
    this.disabledActions = {'EDIT': 'User has no write permission'}
    this.hiddenActions = ['DELETE'];
    this.mobileMode = true;
  }
  
  render() {
    return html`
      <dw-action-toolbar @action=${this._action}
        .dialogTitle=${this.dialogTitle}
        .actions=${this.actions}
        .disabledActions=${this.disabledActions}
        .hiddenActions=${this.hiddenActions}
        .mobileMode=${false}
      >
      </dw-action-toolbar>
    `;
  }

  _action(e) {
    console.log("action changed :", e);
  }
}

customElements.define('action-toolbar-demo', ActionToolbarDemo);