import { html, css } from 'lit-element';
import { DwSelectDialog } from '@dreamworld/dw-select/dw-select-dialog';
import { getIcon } from 'icons';

export class DwActionToolbarMenu extends DwSelectDialog {
  static get styles() {
    return [
      super.styles,
      css`
        .header .dialog-header .title {
          color: var(--action-toolbar-menu-header-title-color);
          text-transform: var(--action-toolbar-menu-header-title-text-transform, uppercase);
          font-weight: var(--action-toolbar-menu-header-title-font-weight, 400);
          font-size: var(--action-toolbar-menu-header-title-font-size, 16px);
          line-height: var(--action-toolbar-menu-header-title-line-height, 28px);
          padding: var(--action-toolbar-menu-header-title-padding, 0px);
          margin: var(--action-toolbar-menu-header-title-margin, 0px);
        }

        .header .dialog-header {
          padding: var(--action-toolbar-menu-header-padding, 0px 20px);
          margin: var(--action-toolbar-menu-header-margin, 0px);
        }

        .header .border {
          display: var(--action-toolbar-menu-header-seprater-display, block);
        }

        .header .dialog-header .back-icon {
          height: var(--action-toolbar-menu-header-back-icon-width, 28px);
          width: var(--action-toolbar-menu-header-back-icon-height, 28px);
          padding: var(--action-toolbar-menu-header-back-icon-padding, 0);
          margin: var(--action-toolbar-menu-header-back-icon-margin, 0px -4px 0px 0px);
        }

        .header .dialog-header .back-icon > svg {
          height: var(--action-toolbar-menu-header-back-icon-svg-width, 24px);
          width: var(--action-toolbar-menu-header-back-icon-svg-height, 24px);
          fill: var(--action-toolbar-menu-header-back-icon-svg-fill-color);
          padding: var(--action-toolbar-menu-header-back-icon-svg-padding, 0);
          margin: var(--action-toolbar-menu-header-back-icon-svg-margin, 0);
        }
      `];
  }

  constructor() {
    super();
    this.closeIcon = 'navigation.close';
  }

  static get properties() {
    return {

      /**
       * Input property. Close icon name.
       */
      closeIcon: String
    }
  }

  _renderDialogHeader() {
    return html`
      <div class="dialog-header">
        <div class="title headline6">${this.dialogTitle}</div>
        <div class="back-icon " @click=${this._backClicked} tabindex="0" @keydown=${this._onBackBtnKeyDown}>${this._getCloseIcon()}</div>
        ${!this.singleSelect ? html`
          ${this._value.length ? html`<div class="count subtitle2">${this._value.length}</div>` : html``}
        ` : ''}
      </div>
      <div class="border"></div>
    `
  }

  /**
   * @returns close icon template.
   */
  _getCloseIcon() {
    return getIcon(this.closeIcon);
  }

  /**
   * Override method of `dw-select-dialog`.
   */
  _itemClicked(e, model) {
    super._itemClicked(e, model);
    this._triggerAction();
  }

  /**
   * Triggers `action` event.
   */
  _triggerAction() {
    let actionEvent = new CustomEvent('action', {
      detail: {
        value: this.value,
      }
    });
    this.dispatchEvent(actionEvent);
  }
}
customElements.define('dw-action-toolbar-menu', DwActionToolbarMenu);