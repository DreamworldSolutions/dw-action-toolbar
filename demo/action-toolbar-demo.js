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
    this.actions = [{name: 'OPEN', title: 'Open'}, {name: 'ADD', title: 'Add'}, {name: 'EDIT', title: 'Edit'}, {name: 'DELETE', title: 'Delete'}, {name: 'DOWNLOAD', title: 'Download'}];
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
        .mobileMode=${this.mobileMode}
        dialogActionName="action"
        dialogActionValue="filter"
      >
      </dw-action-toolbar>
    `;
  }

  _action(e) {
    console.log("action changed :", e);
  }
}

customElements.define('action-toolbar-demo', ActionToolbarDemo);