import { html, css } from 'lit-element';
import { flexLayout } from '@dw/flex-layout';
import { DwSelectDialog } from '@dw/dw-select/dw-select-dialog';
import { Typography } from '@dw/material-styles/typography'
import { includes } from 'lodash-es';

class ActionToolbarMenu extends DwSelectDialog {
  static get styles() {
    return [super.styles,
      flexLayout,
      Typography,
    css`
      .item {
        box-sizing: border-box;
        cursor: pointer;
        padding: 0px 16px;
        background-color: var(--dw-action-toolbar-bg-color);
        min-height: var(--dw-action-toolbar-item-height, 48px);
        color: var(--dw-action-toolbar-item-color);
      }
      .item:hover {
        background-color: var(--dw-action-toolbar-item-hover-color);
      }
      .item.disabled {
        color: var(--dw-action-toolbar-disabled-color);
        pointer-events: none;
      }
    `];
  }

  static get properties() {
    return {
      /**
       * language of app
       */
      language: {
        type: String
      },

      /**
       * Lang resource for action and disable tooltip
       */
      langResources: {
        type: Object
      },
    }
  }
  constructor() {
    super();
    this.singleSelect = true;
    this.noHeader = true;
    this.hAlign = 'right';
    this.vAlign = 'top';
  }

  _renderItem(model) {
    let disabled = includes(this.disabledActions, model.item);
    return html`
      <div class="actions" title="${this._getActionTitle(model.item, this.disabledActions)}">
        <div class="item subtitle1 ${model.kbHighlighted && !disabled ? 'kb-highlighted' : ''} ${disabled ? 'disabled': ''} layout horizontal center" @click=${() => this._itemClicked(model)}>
            ${this._getActionText(model.item)}
        </div>
      </div>
    `;
  }

  /** Lang resources*/
  t(title) {
    if (!title) {
      return;
    }
    return this.langResources[this.language || 'en'][title];
  }
  /**
   * 
   * @param {String} action 
   */
  _getActionText(action){
    return this.t(action + 'Title') || action;
  }

  /**
   * Invoke when secondary action clicked
   * @param {Object} model 
   */
  _itemClicked(model) {
    if(includes(this.disabledActions, model.item)){
      return;
    }
    this._toggleItem(model.item);
    this.value = ""
  }

  /**
   * Invoke when enter key pressed
   */
  _onEnterKeyDown() {
    let item = this._items[this._kbHighlightedIndex];
    if(item && !includes(this.disabledActions, item)) {
      this._toggleItem(item);
      this.value = ""
    }
  }

  /**
   * @Overrides dw-select-dialog
   */
  _onUpArrowKeyDown() {
    for(let i = (this._kbHighlightedIndex - 1); i >= 0; i--) {
      if(!this._filteredApplied || this._filteredIndexMap[i]){
        if(includes(this.disabledActions, this._items[i])){
          continue;
        }
        this._kbHighlightedIndex = i;
        break;
      }
    }
  }

  /**
   * @Overrides dw-select-dialog
   */
  _onDownArrowKeyDown() {
    for(let i = (this._kbHighlightedIndex + 1); i < this._items.length; i++) {
      if(!this._filteredApplied || this._filteredIndexMap[i]){
        if(includes(this.disabledActions, this._items[i])){
          continue;
        }
        this._kbHighlightedIndex = i;
        break;
      }
    }
  }

 /**
  * retrieves title of action to be shown.
  * it is also used for enabled action tooltip.
  *
  * @param {String} action -Actions 
  * @param {Array} disabledActions -Array of disable action
  */
  _getActionTitle(action, disabledActions) {
    if (includes(disabledActions,action)) {
      return this.t(action + 'DisabledTooltip') || action;
    }
    return this._getActionText(action);
  }
}
customElements.define('action-toolbar-menu', ActionToolbarMenu);