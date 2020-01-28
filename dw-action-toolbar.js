import { html, css } from 'lit-element';
import { flexLayout, alignment } from '@dreamworld/flex-layout';
import { DwSelect } from '@dreamworld/dw-select/dw-select'
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
       * Represent total available actions in the toolbar.
       * e.g. 
       * ```
       * [{name: 'ADD', label: 'Add', icon: 'content.add'}, 
       *    {name: 'EDIT', label: 'Edit', icon: 'editor.edit', tooltip: 'Edit your Record'}]
       * ``
       * 
       * Where, `tooltip` is optional. If specified, title tooltip is shown for for this action.
       * Actions specified here can be further customized through other configuration properties like `primaryActions`,
       * `disabledActions`, `hiddenActions` etc.
       */
      actions: Array,
      

      /**
       * Input property.
       * Primary actions are rendered as icon-buttons. While other actions are shown in the drop-down menu.
       * Name of the actions which are to be shown as primary. e.g. `['EDIT']`
       * Default value: `[]`.
       * Note:: These actions must be declared in the `actions` property, otherwise it will be simply ignored.
       */
      primaryActions: Array,

      /**
       * Input property.
       * Specifies actiosn which are disabled. 
       * e.g. {'DELETE': 'User has no write permission'}
       * key = action name, value = Tooltip message to be shown for that action.
       * Note:: These actions must be declared in the `actions` property.
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
       * Size of the icon button (in pixels) used for primary actions.
       * Default value `48`.
       */
      primaryActionButtonSize: Number,

      /**
       * Input Property.
       * Size of the icon (in pixels) used for primary actions.
       * vert-more button, which opens secondary actions drop-down, also honors this property.
       * Default value `24`.
       */
      primaryActionIconSize: Number,

      /**
       * Input property.
       * Size of the icon (in pixels) used for the list item (in drop-down).
       * Default value `24`.
       */
      listItemIconSize: Number,

      /**
       * Input property.
       * Name of the icon for the close button shown in dialog.
       */
      closeIcon: String,

      /**
       * Possible values: "left" or "right".
       * Has no effect when `noCloseIcon=true`.
       * Default value: `right`.
       */
      closeIconPosition: String,

      /**
       * Input property.
       * Set it to `true` when close-icon is not needed in drop-down.
       */
      noCloseIcon: Boolean,

      /**
       * Input property.
       * Name of the icon used for the trigger button which opens drop-down.
       * Default value: `vert-more`.
       */
      triggerIcon: String,

      /**
       * Input + Output property. True if the dropdown is open, false otherwise.
       */
      opened: { type: Boolean, reflect: true },


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
    this.triggerIcon = 'more_vert';
    this.primaryActions = [];
    this.primaryActionButtonSize = 48;
    this.primaryActionIconSize = 24;
    this.listItemIconSize = 24;
    this.closeIconPosition = 'right';
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

  _onSelectOpenedChanged(e) {
    //TODO: this.opened = something;
    this._openedChanged();
  }

  /**
   * Event listener. Invoked when drop-down is opened/closed.
   * Current value of drop-down can be retrieved from the property `opened`.
   * It clears selected item on dialog closed.
   * It's a protected method, so can be used by the child-class to do any custom work on it.
   */
  _openedChanged() {
    if(!this.opened) {
      this.value = [];
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