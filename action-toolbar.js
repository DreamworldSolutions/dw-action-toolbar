import { html, css } from 'lit-element';
import { flexLayout, alignment } from '@dw/flex-layout';
import { DwSelect } from '@dw/dw-select/dw-select'
import isEmpty from 'lodash-es/isEmpty';
import forEach from 'lodash-es/forEach';
import cloneDeep from 'lodash-es/cloneDeep';
import './action-toolbar-menu';

export class ActionToolbar extends DwSelect {
  static get styles() {
    return [
      super.styles,
      flexLayout,
      alignment,
      css`
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
      closeIcon: String,
      /**
       * Input property.
       * Always show to user to this actions from master action.
       * e.g. ['ADD', 'EDIT']
       */
      primaryActions:  Array,
      /**
       * Input property.
       * Action show on element hover from master action.
       * e.g. ['DOWNLOAD', 'DELETE']
       */
      semiPrimaryActions: Array,
    };
  }

  get actions() {
    return this._actions;
  }

  set actions(val) {
    this._actions = val;
    this._manageItems();
  }

  get disabledActions() {
    return this._disabledActions;
  }

  set disabledActions(val) {
    this._disabledActions = val;
    this._manageItems();
  }

  get hiddenActions() {
    return this._hiddenActions;
  }

  set hiddenActions(val) {
    this._hiddenActions = val;
    this._manageItems();
  }

  constructor() {
    super();
    this.singleSelect = true;
    this.itemValue="name"
    this.itemLabel="title"
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
      <action-toolbar-menu
        .items=${this.items}
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
      ></action-toolbar-menu>
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
   * Manage `items` property based on `actions`, `hiddenActions` and `disabledActions`.
   * @protected
   */
  _manageItems() {
    if(isEmpty(this.actions)) {
      this.items = [];
      return;
    }

    let aActions = this._actionsDisabled(this._removeHiddenActions());
    this.items = aActions;
  }

  /**
   * Remove hidden action from `actions` property and return new action array.
   * @returns {Array} New action withoud hidden actions.
   * @protected
   */
  _removeHiddenActions(){
    let aActions = cloneDeep(this.actions);
    forEach(this.hiddenActions || [], (hiddenAction)=> {
      forEach(this.actions, (action, key)=> {
        if(action.name == hiddenAction) {
          aActions.splice(key, 1);
          return false;
        }
      });
    });
    return aActions;
  }

  /**
   * Set disabled and tooltip for disable actions.
   * @param {Array} aActions actions model
   * @returns {Array} new actions with disabled and tooltip.
   */
  _actionsDisabled(aActions) {
    forEach(this.disabledActions, (tooltip, disableAction)=> {
      forEach(aActions, (action) => {
        if(disableAction == action.name) {
          action.disabled = true;
          action.disabledTooltip = tooltip;
        }
      });
    });
    return aActions;
  }
}

customElements.define('action-toolbar', ActionToolbar);