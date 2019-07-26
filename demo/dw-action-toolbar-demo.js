import { LitElement, html, css } from 'lit-element';
import { flexLayout, alignment } from '@dw/flex-layout';
import '../dw-action-toolbar';
import {materialStyles} from'@dw/material-styles/material-styles';
class DwActionToolbarDemo extends LitElement {
  static get styles() {
    return [
      materialStyles,
      flexLayout,
      alignment,
      css`
        :host {
          display: inline-block;
          box-sizing: border-box
        }
        .list-item{
          height: 48px;
          width: 500px;
          background-color: rgba(0,0,0,0.12);
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
  }
  
  render() {
    return html`
      <span class="list-item layout horizontal end-justified center-center">
        <div>
          <dw-action-toolbar 
          @edit=${this._onEditClicked}
          @new=${this._newClicked}
          @delete=${this._onDeleteClicked} 
          @payment=${this._onPaymentClicked}
          @archive=${this._onArchiedClicked}
          .eventData=${{item: 'asdasd', second: 'asdasd'}} 
          .primaryActions=${['payment']}
          .semiPrimaryActions=${['edit']} 
          .secondaryActions=${['edit','delete','archive', 'new', 'new11', 'new112']} 
          .disabledActions=${['archive', 'new11']}
          .langResources=${this._getLangResources()}
          hoverTargetParentSelector="span" 
          .icons=${{edit: "image.edit", payment: 'action.payment'}}>
        </dw-action-toolbar>
        </div>
      </span>
    `;
  }

  _onDeleteClicked(e){
    console.log('delete Cliecked', e.detail)
  }
  _onArchiedClicked(e){ 
    console.log('Archived Cliecked', e.detail)
  }
  _onEditClicked(e){ 
    console.log('edit Cliecked', e.detail)
  }
  _onPaymentClicked(e){ 
    console.log('payment Cliecked', e.detail)
  }
  _newClicked(e) {
    console.log('new btn Cliecked', e.detail)
  }
  _getLangResources() {
    return {
      en: {
        editTitle: 'Edit',
        deleteTitle: 'Delete',
        archiveTitle: 'Archive',
        editDisabledTooltip: "This is disabled tooltip for edit",
        archiveDisabledTooltip: "this is disabled archied tooltip"
      },
      gu: {
        editTitle: 'Edit gu',
        deleteTitle: 'Delete gu',
        archiveTitle: 'Archive gu',
        editDisabledTooltip: "This is disabled tooltip for edit gu",
        archiveDisabledTooltip: "this is disabled archied tooltip"
      },
      hi: {
        editTitle: 'Edit hi',
        deleteTitle: 'Delete hi',
        archiveTitle: 'Archive hi',
        editDisabledTooltip: "This is disabled tooltip for edit hi",
        archiveDisabledTooltip: "this is disabled archied tooltip"
      }
    }
  }
}

customElements.define('dw-action-toolbar-demo', DwActionToolbarDemo);