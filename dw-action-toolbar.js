import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { flexLayout, alignment } from '@dw/flex-layout';
import { union, intersection, difference, includes, get } from 'lodash-es';
import './dw-action-toolbar-menu';
import * as icons from '@dw/material-icons'
class dwActionToolbar extends LitElement {
  /**
  `dw-action-toolbar` element is used to display action toolbar anywhere like in list, header, dialog.
  `dw-context-menu-button` is used to display vert-more.
  
  ## Behaviors
  [See all](https://docs.google.com/document/d/15tjrhPbrcqcbZ4rGQNtoJLOv4eOxPKfk4gxeltMmJKw)
  
  Example of only primary action (no vert more, always visible):
  
      <dw-action-toolbar primaryActions=${['edit','delete']}>
      </dw-action-toolbar>
  
  Example of primary and secondary actions:
  
      <dw-action-toolbar .primaryActions=${['edit']} .secondaryActions=${['delete','archive']} .semiPrimaryActions=${['delete']}>
      </dw-action-toolbar>
  
  Example of action title:
  
      <dw-action-toolbar .primaryActions=${['edit','delete']}
        .langResources=${{'en':{'deleteTitle':'Remove'}}}>
      </dw-action-toolbar>
  
  Example of disabled icon:
  
      <dw-action-toolbar .primaryActions=${['edit','delete']} .disabledActions=${['delete']}>
      </dw-action-toolbar>
  
  Example of disabled icon with title:
  
      <dw-action-toolbar .primaryActions=${['edit','delete']} .disabledActions=${['delete']}
        .langResources=${{'en':{'deleteDisabledTooltip':'Delete is not allowed'}}}>
      </dw-action-toolbar>
  
  Example of set icons:
  
      <dw-action-toolbar .primaryActions=${['edit','delete']} .icons=${{'edit':'myicons:edit'}}>
      </dw-action-toolbar>
  
  Example of set hover target ancestors selector:
  
      <dw-action-toolbar .primaryActions=${['edit','delete']} .hoverTargetParentSelector="data-table-row">
      </dw-action-toolbar>
  
  @demo demo/index.html
  @hero hero.svg
   */
  static get styles() {
    return [
      flexLayout,
      alignment,
      css`
      :host {
        display: block;
        --dw-action-toolbar-icon-color: var(--primary-text-color);
        --dw-action-toolbar-icon-hover-color: var(--light-theme-base-color);
        --dw-action-toolbar-icon-disabled-color: var(--disabled-text-color);
        --dw-action-toolbar-icon-ripple-ink-color: rgba(0, 0, 0, 0.12);
        --dw-action-toolbar-bg-color: var(--light-theme-background-color);
        --dw-action-toolbar-item-color: var(--light-theme-text-color);
        --dw-action-toolbar-disabled-color: var(--light-theme-disabled-color);
        --dw-select-width: 215px;
      }
      .icon {
        height: 40px;
        width: 40px;
        cursor: pointer;
        fill: var(--dw-action-toolbar-icon-color);
      }
      .icon:hover {
        fill: var(--dw-action-toolbar-icon-hover-color);
      }
      .icon[disabled='true'] {
        fill: var(--dw-action-toolbar-icon-disabled-color);
        pointer-events: none;
        cursor: auto;
      }
      .ripple {
        background-position: center;
        transition: background 0.8s;
        border-radius: 50px;
      }
      .ripple:active {  
        background-color: var(--dw-action-toolbar-icon-ripple-ink-color);
        background-size: 100%;
        transition: background 0s;
      }
      dw-action-toolbar-menu {
        z-index: 100;
      }
    `];
  }

  static get properties() {
    /**
     * Fired when user tap any action in action toolbar or drop-down menu. i.e `edit`,  `delete`
     *
     * @event <action-name>lib
     * @param {Object} e
     * @param {Object} e.detail <eventData>
     */
    return {
      /**
       * Always visible action icon buttons.
       * Actions which is to be performed most-likely are considered as primary actions.
       */
      primaryActions: {
        type: Array
      },

      /**
       * Actions to display in dropdown menu.
       * Actions which are to be performed occasionally are considered secondary actions.
       * Note: if action is marked `semiPrimary` then it will be visible as primary action on hover.
       */
      secondaryActions: {
        type: Array
      },

      /**
       * Secondary actions which becomes primary during hover state.
       * Note: If action is not defined in `secondary` and defined here then action is not displayed.
       */
      semiPrimaryActions: {
        type: Array
      },

      /**
       * Specify action names to make is disabled action
       * Note: disabled action button tap is ignored
       */
      disabledActions: {
        type: Array
      },

      /**
       * Specify set of icons by action name
       */
      icons: {
        type: Object
      },

      /**
       * Language is for show action in perticular language
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

      /**
       * The element that should be used to listen hover state of the element.
       * If not set, it will find closest ancestor by `hoverTargetParentSelector`
       * @type {!Element}
       */
      hoverTarget: {
        type: Object
      },

      /**
       * A element selector string to find `hoverTarget` in closest ancestor.
       * Note: When `hoverTarget` is specified, this property has no effect.
       */
      hoverTargetParentSelector: {
        type: String
      },
      /**
       * The element that should be used to listen hover state of the element.
       * Priority order are follow: `hoverTarget`, `hoverTargetParentSelector`, `this`
       * @type {!Element}
       */
      _hoverTarget: {
        type: Object
      },

      /**
       * Actual primary actions to be display
       * When semi primary actions converted to primary actions that will be added left side.
       */
      _primaryActions: {
        type: Array
      },

      /**
       * Secondary actions to be display in drop-down menu
       */
      _secondaryActions: {
        type: Array
      },
      /**
       * True if the context-menu is currently opened.
       */
      _contextMenuOpened: {
        type: Boolean
      },
      /**
       * True when, hover state is activated
       * When true, semi primary actions are converted to primary actions.
       */
      _showSemiPrimaryAsPrimary: {
        type: Boolean
      },

      /**
       * Position target of vert more
       */
      _positionTarget: {
        type: Object
      },
      /**
       * True when `_hoverTarget` element is hovered by mouse.
       * Note: Hover due to touch can not be considered hoverActivated.
       */
      _hover: {
        type: Boolean
      },
    };
  }

  constructor() {
    super();
    this.primaryActions = [];
    this.secondaryActions = [];
    this.semiPrimaryActions = [];
    this.icons = {};
    this._primaryActions = [];
    this._secondaryActions = [];
    this.language = 'en';
    this._hoverTarget = this;
    this._hover = false;
    this._contextMenuOpened = false;
    this._showSemiPrimaryAsPrimary = false;
    this._handleMouseEnter = this._handleMouseEnter.bind(this);
    this._handleMouseleave = this._handleMouseleave.bind(this);
  }

  render() {
    return html`
    <div class="layout horizontal">
      ${repeat(this._primaryActions, (action) => action, (action) => html`
          <div title=${this._getActionTitle(action, this.disabledActions)}>
            <div class="icon ripple layout vertical center-center"
              disabled=${includes(this.disabledActions, action)}
              @click=${() => this._sendEventData(action)}>
              ${this._getIcon(action)}
            </div>
          </div>
      `)}
      <div class="icon ripple layout vertical center-center" @click=${this._vertMoreClick}>${icons.navigation.more_vert}</div>
      <dw-action-toolbar-menu
        class="secondary-actions"
        .language=${this.language}
        .langResources=${this.langResources}
        .positionTarget=${this._positionTarget}
        .opened=${this._contextMenuOpened}
        .items=${this._secondaryActions}
        .disabledActions=${this.disabledActions}
        @value-changed=${this._valueChanged}
        @opened-changed=${this._openedChanged}>
      </dw-action-toolbar-menu>
    </div>
    `;
  }

  /**
   * Retrieves title of action to be shown.
   * it is also used for enabled action tooltip.
   *
   * @param {String} action -Actions 
   * @param {Array} disabledActions -Array of disable action
   */
  _getActionTitle(action, disabledActions) {
    if (includes(disabledActions, action)) {
      return this.t(action + 'DisabledTooltip') || action;
    }
    return this.t(action + 'Title') || action;
  }

  /**
   * Invoked when contex menu action clicked
   * @param {Object} e- event of context menu
   * @param {String} e.detail.value - Clicked action
   */
  _valueChanged(e) {
    this._dispachActionEvent(e.detail.value);
  }

  /**
   * Invoked when contex menu is opened
   * @param {Object} e -event of context menu
   * @param {Boolean} e.detail.opened-  represent status of context menu
   */
  _openedChanged(e) {
    this._contextMenuOpened = e.detail.opened;
    this._hover = false;
  }

  /**
   *  gets icon from icons.
   */
  _getIcon(action) {
    let iconPath = this.icons[action];
    return get(icons, iconPath);
  }

  /**
   * Fires event of `name of action` and sends event data.
   * @param {String} action - Action of
   */
  _sendEventData(action) {
    this._dispachActionEvent(action);
    this._contextMenuOpened = false;
  }

  /**
   * Dispaches action event
   * @param {String} action- action name
   */
  _dispachActionEvent(action) {
    let actionEvent = new CustomEvent(action, {
      detail: this.eventData
    });
    this.dispatchEvent(actionEvent);
  }

  /**
   * Invoked when clicked on vert more
   * @param {Object} e - Event of vert more icon
   * @param {Object} e.currentTarget- Element of vert more icon
   */
  _vertMoreClick(e) {
    this._positionTarget = e.currentTarget;
    this._contextMenuOpened = true;
  }

  /**
   * Invoke for translate
   * @param {String} text- text for translation 
   */
  t(text) {
    if (!text) {
      return;
    }
    return this.langResources[this.language || 'en'][text];
  }

  /**
   * Invoke after render
   * @param {Object} changedProps 
   */
  updated(changedProps) {
    super.updated();
    if (changedProps.has('primaryActions') || changedProps.has('secondaryActions') || changedProps.has('semiPrimaryActions') || changedProps.has('_showSemiPrimaryAsPrimary')) {
      this._managePrimaryActions();
    }
    if (changedProps.has('secondaryActions') || changedProps.has('semiPrimaryActions') || changedProps.has('_showSemiPrimaryAsPrimary')) {
      this._manageSecondaryActions();
    }
    if (changedProps.has('hoverTargetParentSelector') || changedProps.has('hoverTarget')) {
      this._manageHoverTarget();
    }
    if (changedProps.has('_hover') || changedProps.has('_contextMenuOpened')) {
      this._manageShowSemiPrimaryAsPrimary();
    }
    if (changedProps.has('_hoverTarget')) {
      this._addHoverListener();
      this._removeHoverListener(changedProps.get('_hoverTarget'));
    }
  }

  /**
   * Manages `_primaryAction` property
   */
  _managePrimaryActions() {
    if (this._showSemiPrimaryAsPrimary) {
      let _secondaryActions = intersection(this.secondaryActions, this.semiPrimaryActions);
      this._primaryActions = union(_secondaryActions, this.primaryActions);
      return;
    }
    this._primaryActions = this.primaryActions.slice();
  }
  /**
   * Manages `_secondaryActions` property
   */
  _manageSecondaryActions() {
    if (this._showSemiPrimaryAsPrimary) {
      this._secondaryActions = difference(this.secondaryActions, this.semiPrimaryActions);
      return
    }
    this._secondaryActions = this.secondaryActions.slice();
  }

  /**
   * Manages `_hoverTarget` property
   */
  _manageHoverTarget() {
    if (this.hoverTarget) {
      this._hoverTarget = this.hoverTarget;
      return;
    }
    if (this.hoverTargetParentSelector) {
      this._hoverTarget = this.closest(this.hoverTargetParentSelector);
      return;
    }
    this._hoverTarget = this;
  }

  /**
   * Manages to `_showSemiPrimaryAsPrimary` property 
   */
  _manageShowSemiPrimaryAsPrimary() {
    if (this._contextMenuOpened) {
      return;
    }
    if (this._hover) {
      this._showSemiPrimaryAsPrimary = true;
      return;
    }

    this._showSemiPrimaryAsPrimary = false;
  }

  /**
   * Add Listeners `mouseleave` and `mouseenter` event.
   */
  _addHoverListener() {
    this._hoverTarget.addEventListener('mouseenter', this._handleMouseEnter);
    this._hoverTarget.addEventListener('mouseleave', this._handleMouseleave);
  }

  /**
   * Remove listener `mouseleave` and `mouseenter` event.
   */
  _removeHoverListener(hoverTarget) {
    if (!hoverTarget) {
      return;
    }
    hoverTarget.removeEventListener('mouseenter', this._handleMouseEnter);
    hoverTarget.removeEventListener('mouseleave', this._handleMouseleave);
  }

  /**
   * Invokes when `mouseenter` event is triggered.
   */
  _handleMouseEnter() {
    this._hover = true;
  }

  /**
   * Invokes when `mouseleave` event is triggered.
   */
  _handleMouseleave() {
    this._hover = false;
  }
}

customElements.define('dw-action-toolbar', dwActionToolbar);