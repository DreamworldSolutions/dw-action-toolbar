import { LitElement } from '@dreamworld/pwa-helpers/lit-element.js';
import { html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import * as layoutLiterals from '@dreamworld/flex-layout';
import '@dreamworld/dw-select/dw-select';
import '@dreamworld/dw-icon-button/dw-icon-button.js';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import clone from 'lodash-es/clone';
import filter from 'lodash-es/filter';
import { styleMap } from 'lit-html/directives/style-map.js';

export class DwActionToolbar extends LitElement {
  static get styles() {
    return css`
      :host {
        ${layoutLiterals.flexLayoutMixin.displayFlex};
        ${layoutLiterals.flexLayoutMixin.horizontal};
        ${layoutLiterals.alignmentMixin.centerAligned};
      }

      .primary-action-btn{
        margin: 0px 8px;
      }
      `
  }

  static get properties() {
    return {
      /**
       * Input property.
       * Represent total available actions / sub actions in the toolbar.
       * e.g. 
       * ```
       * [{name: 'ADD', label: 'Add', icon: 'content.add'}, {name: 'ADD', label: 'Add', icon: 'content.add', type: "collapsible", subActions: [{name: 'TOP', label: 'Move to top', icon: 'arrow_up'}]}, 
       *    {name: 'EDIT', label: 'Edit', icon: 'editor.edit', tooltip: 'Edit your Record'}]
       * ``
       * 
       * Where, `tooltip` is optional. If specified, title tooltip is shown for for this action.
       * Actions specified here can be further customized through other configuration properties like `primaryActions`,
       * `disabledActions`, `hiddenActions` etc.
       */
      actions: {type: Array},
      

      /**
       * Input property.
       * Primary actions are rendered as icon-buttons. While other actions are shown in the drop-down menu.
       * Name of the actions which are to be shown as primary. e.g. `['EDIT']`
       * Default value: `[]`.
       * Note:: These actions must be declared in the `actions` property, otherwise it will be simply ignored.
       */
      primaryActions: {type: Array},

      /**
       * Computed primary actions.
       */
      _primaryActions: { type: Array },

      /**
       * Computed Secondary actions.
       */
      _secondaryActions: { type: Array },

      /**
       * Input property.
       * Specifies actiosn which are disabled. 
       * e.g. {'DELETE': 'User has no write permission'}
       * key = action name, value = Tooltip message to be shown for that action.
       * Note:: These actions must be declared in the `actions` property.
       */
      disabledActions: { type: Object },

      /**
       * Input property.
       * Hide actions from master actions.
       * e.g. ['ADD', 'DELETE']
       */
      hiddenActions: { type: Array },

      /**
       * Input property.
       * Size of the icon button (in pixels) used for primary actions.
       * Default value `48`.
       */
      primaryActionButtonSize: { type: Number },

      /**
       * Input Property.
       * Size of the icon (in pixels) used for primary actions.
       * vert-more button, which opens secondary actions drop-down, also honors this property.
       * Default value `24`.
       */
      primaryActionIconSize: { type: Number },

      /**
       * Input property.
       * Size of the icon (in pixels) used for the list item (in drop-down).
       * Default value `24`.
       */
      listItemIconSize: { type: Number },

      /**
       * Input property.
       * Name of the icon for the close button shown in dialog.
       */
      closeIcon: { type: String },

      /**
       * Possible values: "left" or "right".
       * Has no effect when `noCloseIcon=true`.
       * Default value: `right`.
       */
      closeIconPosition: { type: String },

      /**
       * Input property.
       * Set it to `true` when close-icon is not needed in drop-down.
       */
      noCloseIcon: { type: Boolean },

      /**
       * Input property.
       * Name of the icon used for the trigger button which opens drop-down.
       * Default value: `vert-more`.
       */
      triggerIcon: { type: String },

      /**
       * Input + Output property. True if the dropdown is open, false otherwise.
       */
      opened: { type: Boolean, reflect: true },

      /**
       * Input property. Display multiselect in mobile mode (full screen) and no keyboard support
       * Default value: false
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },

      /**
       * Input property. When true, header will be hidden. header contains Back button, Dialog title, Selecte Items count.
       * Default value: false
       */
      noHeader: { type: Boolean, reflect: true, attribute: 'no-header' },

      /**
       * Input property. The title for dialog
       */
      dialogTitle: { type: String },

      /**
       * Input property.
       * When true, Show dialog in full screen even if items are very less in mobile mode
       * Default value: `false`
       */
      alwaysFullScreenInMobile: { type: Boolean },

      /**
       * Input property.
       * When `true`, Remove defualt trigger element
       * Provide your custom trigger element as a slot.
       */
      customTrigger: { type: Boolean, reflect: true, attribute: 'custom-trigger' },
      
      /**
       * Input property. The orientation against which to align the menu dropdown horizontally relative to the dropdown trigger.
       * Possible values: "left", "right"
       * Default value: "left"
       */
      dialogHAlign: String,

      /**
       * Input property. The orientation against which to align the menu dropdown vertically relative to the dropdown trigger.
       * Possible values: "top", "bottom"
       * Default value: "top"
       */
      dialogVAlign: String,

      /**
       * Input property. The horizontal offset in pixels. Negtaive numbers allowed.
       * Default value: 0
       */
      dialogHOffset: Number,

      /**
       * Input property. The vertical offset in pixels. Negtaive numbers allowed.
       * Default value: 0
       */
      dialogVOffset: Number,

      /**
       * It can be of either String or Array type.
       */
      _value: { type: Array },
    };
  }

  get actions() {
    return this._actions;
  }

  set actions(val) {
    let oldValue = this._actions;
    if(isEqual(oldValue, val)) {
      return;
    }

    this._actions = val;
    this.requestUpdate('actions', oldValue);
    this._computeItems();
  }

  get hiddenActions() {
    return this._hiddenActions;
  }

  set hiddenActions(val) {
    let oldValue = this._hiddenActions;
    if(isEqual(oldValue, val)) {
      return;
    }

    this._hiddenActions = val;
    this.requestUpdate('hiddenActions', oldValue);
    this._computeItems();
  }

  get primaryActions() {
    return this.__primaryActions;
  }

  set primaryActions(val) {
    let oldValue = this.__primaryActions;
    if(isEqual(oldValue, val)) {
      return;
    }

    this.__primaryActions = val;
    this.requestUpdate('primaryActions', oldValue);
    this._computeItems();
  }

  constructor() {
    super();
    this.singleSelect = true;
    this.triggerIcon = 'more_vert';
    this.primaryActions = [];
    this._primaryActions = [];
    this._secondaryActions = [];
    this.primaryActionButtonSize = 48;
    this.primaryActionIconSize = 24;
    this.listItemIconSize = 24;
    this.closeIcon = 'close';
    this.closeIconPosition = 'right';
    this.dialogHAlign = 'left';
    this.dialogVAlign = 'top';
  }

  render() {
    return html`
      ${this._primaryActions && this._primaryActions.length ? html`
          ${repeat(this._primaryActions, (action) => action.name, (action, index) => html`
          <dw-icon-button 
            class="primary-action-btn"
            style="${styleMap(this._setPrimaryActionIconColor(action))}"
            .iconSize="${this.primaryActionIconSize}" 
            .buttonSize="${this.primaryActionButtonSize}"
            title="${action.tooltip ? action.tooltip : ''}"
            name="${action.name}"
            icon="${action.icon}" 
            @click=${this._onPrimaryActionClick}>
          </dw-icon-button>
          `)}
        ` : ''}
        ${this._secondaryActions && this._secondaryActions.length ? html`
          <dw-select 
            ?custom-trigger="${this.customTrigger}"
            .opened="${this.opened}"
            .singleSelect="${true}"
            .triggerIcon="${this.triggerIcon}"
            .triggerButtonSize="${this.primaryActionButtonSize}"
            .triggerIconSize="${this.primaryActionIconSize}"
            .backIcon="${this.closeIcon}"
            .backIconPosition="${this.closeIconPosition}"
            .noCloseIcon="${this.noCloseIcon}"
            .items="${this._secondaryActions}"
            .disabledItems="${this.disabledActions}"
            .value="${this._value}"
            .itemLabel="${"label"}"
            .itemValue="${"name"}"
            .mobileMode="${this.mobileMode}"
            .noHeader="${this.noHeader}"
            .dialogTitle="${this.dialogTitle}"
            .vAlign="${this.dialogVOffset}"
            .hAlign="${this.dialogHOffset}"
            .vOffset="${this.dialogVOffset}"
            .hOffset="${this.dialogHOffset}"
            .alwaysFullScreenInMobile="${this.alwaysFullScreenInMobile}"
            @value-changed="${this._triggerActionEvent}"
            @opened-changed="${this._onSelectOpenedChanged}">
            <slot></slot>
          </dw-select>
        ` : ''
      }
    `
  }

  /**
   * Sets icon color of primary action.
   * @param {Object} item Action 
   */
  _setPrimaryActionIconColor(item) {
    if (item.iconColor) {
      if (item.iconColor.startsWith('-')) {
        return { '--dw-icon-color': `var(${item.iconColor})` };
      } else {
        return { '--dw-icon-color': `${item.iconColor}` };
      }
    }
    return {};
  }

  /**
   * Invoked on select-dialog opened change.
   * @param {Object} e Event detail
   */
  _onSelectOpenedChanged(e) {
    this.opened = e.detail.opened;
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
      this._value = [];
    }
  }

  /**
   * Invoked on primary action click.
   * @param {Object} e Event
   */
  async _onPrimaryActionClick(e) {
    let target = e.target;
    let action = target.getAttribute('name');
    target.__waitForEntryAnimation && await target.__waitForEntryAnimation;
    this._triggerActionEvent({detail: {value: action}});
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
    const allVisibleActions = this._removeHiddenActions(aActions);
    this._primaryActions = filter(allVisibleActions, (o) => {
      return this.primaryActions.includes(o.name)
    });
    this._secondaryActions = filter(allVisibleActions, (o) => {
      return !this.primaryActions.includes(o.name)
    });
  }

  /**
   * Remove hidden action from `actions/sub-actions` property and return new action array.
   * @returns {Array} New action withoud hidden actions.
   * @protected
   */
  _removeHiddenActions(aActions) {
    let actions = [...aActions];
    if(isEmpty(this.hiddenActions)) {
      return actions;
    }

    let result = [];
    actions.forEach((action) => {
      if(this.hiddenActions.indexOf(action.name) === -1) {
        if (action.type === 'expandable' && action.subActions && action.subActions.length) {
          const subActions = [];
          action.subActions.forEach((action) => {
            if (this.hiddenActions.indexOf(action.name) === -1) {
              subActions.push(action);
            }
          });
          action= {...action, subActions};
        }
        result.push(action);
      }
        
    });
    return result;
  }

  /**
   * Open action toolbar.
   */
  open() {
    let elSelect = this.shadowRoot.querySelector('dw-select');
    elSelect && elSelect.open();
  }

  /**
   * Close action toolbar.
   */
  close() {
    let elSelect = this.shadowRoot.querySelector('dw-select');
    elSelect && elSelect.close();
  }
}

customElements.define('dw-action-toolbar', DwActionToolbar);