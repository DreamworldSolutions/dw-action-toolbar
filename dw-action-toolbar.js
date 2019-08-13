import { html, css } from 'lit-element';
import { flexLayout, alignment } from '@dw/flex-layout';
import { DwSelect } from '@dw/dw-select/dw-select'
import isEmpty from 'lodash-es/isEmpty';
import clone from 'lodash-es/clone';
import './dw-action-toolbar-menu';

export class DwActionToolbar extends DwSelect {
  static get styles() {
    return [
      super.styles,
      flexLayout,
      alignment,
      css`
        :host {
          --dw-select-item-check-icon-display: none;
        }
        
        .main-container #dropdownContainer .trigger-icon > svg {
          height: var(--action-toolbar-trigger-icon-svg-width, 24px);
          width: var(--action-toolbar-trigger-icon-svg-height, 24px);
          fill: var(--action-toolbar-trigger-icon-svg-fill-color);
          padding: var(--action-toolbar-trigger-icon-svg-padding, 0);
          margin: var(--action-toolbar-trigger-icon-svg-margin, 0);
        }
    `];
  }

  static get properties() {
    return {
      /**
       * Input property.
       * Represent master action of toolbar.
       * e.g. [{name: 'ADD', label: 'Add', icon: 'content.add'}, {name: 'EDIT', label: 'Edit', icon: 'editor.edit'}]
       */
      actions: Array,
      /**
       * Input property.
       * Disabled actions from master actions.
       * Disabled action show tooltip.
       * e.g. {'DELETE': 'User has no write permission'}
       */
      disabledActions: Object,
      /**
       * Input property.
       * Hide actions from master actions.
       * e.g. ['ADD', 'DELETE']
       */
      hiddenActions: Array,
      /**
       * Input property.
       * Passed close icon name.
       * Show icon in dialog header based on value.
       */
      closeIcon: String
    };
  }

  get actions() {
    return this._actions;
  }

  set actions(val) {
    this._actions = val;
    this._computeItems();
  }

  get hiddenActions() {
    return this._hiddenActions;
  }

  set hiddenActions(val) {
    this._hiddenActions = val;
    this._computeItems();
  }

  constructor() {
    super();
    this.singleSelect = true;
    this.itemValue="name"
    this.itemLabel="label"
    this.hAlign = "right";
    this.triggerIcon = 'navigation.more_vert';
  }

  /**
   * @returns {*} Dialog template.
   * @override
   * @protected
   */
  _renderSelectDialog() {
    return html`
      <dw-action-toolbar-menu
        .items=${this.items}
        .disabledItems=${this.disabledActions}
        .itemLabel=${this.itemLabel}
        .itemValue=${this.itemValue}
        .positionTarget=${this._positionTarget}
        .noHeader=${this.noHeader}
        .mobileMode=${this.mobileMode}
        .filterPlaceholder=${this.filterPlaceholder}
        .opened=${this.opened}
        .hAlign=${this.hAlign}
        .vAlign=${this.vAlign}
        .hOffset=${this.hOffset}
        .vOffset=${this.vOffset}
        .singleSelect=${this.singleSelect}
        .value=${this.value}
        .groupBy=${this.groupBy}
        .allowFilter=${this.allowFilter}
        .groupByOrder=${this.groupByOrder}
        .groupText=${this.groupText}
        .dialogTitle=${this.dialogTitle}
        .hideSelectAllBtn="${this.hideSelectAllBtn}"
        .alwaysFullScreenInMobile=${this.alwaysFullScreenInMobile}
        .hideResetBtn="${this.hideResetBtn}"
        .stickySelectionButtons="${this.stickySelectionButtons}"
        .selectionButtonsAlign="${this.selectionButtonsAlign}"
        .closeIcon=${this.closeIcon}
        @value-changed=${this._valueChanged}
        @opened-changed=${this._openedChanged}
      ></dw-action-toolbar-menu>
    `;
  }
  
  /**
   * @param {*} e event data
   * Trigger action event.
   * @override
   */
  _valueChanged(e){
    super._valueChanged(e);
    this._triggerActionEvent(e);
  }

  /**
   * @param {*} e event data.
   * Clear selected item on dialog closed.
   * @override
   */
  _openedChanged(e) {
    super._openedChanged(e);
    if(!this.opened) {
      this.selected = null;
    }
  }

  /**
   * @param {*} e event data
   * @event action Trigger `acion` event with action name.
   * @protected
   */
  _triggerActionEvent(e) {
    let actionEvent = new CustomEvent('action', {
      detail: {
        name: e.detail && e.detail.value
      }
    });
    this.dispatchEvent(actionEvent);
  }

  /**
   * Manage `items` property based on `actions`, `hiddenActions`.
   * @protected
   */
  _computeItems() {
    if(isEmpty(this.actions)) {
      this.items = [];
      return;
    }

    let aActions = clone(this.actions);
    this.items = this._removeHiddenActions(aActions);
  }

  /**
   * Remove hidden action from `actions` property and return new action array.
   * @returns {Array} New action withoud hidden actions.
   * @protected
   */
  _removeHiddenActions(aActions){
    if(isEmpty(this.hiddenActions)) {
      return aActions;
    }

    let result = [];
    aActions.forEach((action) => {
      if(this.hiddenActions.indexOf(action.name) === -1) {
        result.push(action);
      }
    });
    return result;
  }
}

customElements.define('dw-action-toolbar', DwActionToolbar);