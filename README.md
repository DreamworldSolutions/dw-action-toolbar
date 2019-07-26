
 # dw-action-toolbar
  element is used to display action toolbar anywhere like in list, header, dialog.
  
  ## Behaviors
  [See all](https://docs.google.com/document/d/15tjrhPbrcqcbZ4rGQNtoJLOv4eOxPKfk4gxeltMmJKw)
  

### Install

`npm i @dw/dw-action-toolbar --save`

### Usage

```js
import '@dw/dw-action-toolbar';
```
### Events
  Fires events by action name e.g for `delete` action fires `delete`


## Examples
#### Example of only primary action (no vert more, always visible):
```html
<dw-action-toolbar .primaryActions="${['edit','delete']}"></dw-action-toolbar>
```
  
 #### Example of primary and secondary actions:
  ```html
  <dw-action-toolbar .primaryActions="${['edit']}" .secondaryActions="${['delete','archive']}" .semiPrimaryActions="${['delete']}"></dw-action-toolbar>
  ```
  
  #### Example of action title:
  ```html
  <dw-action-toolbar .primaryActions="${['edit','delete']}" .langResources="${{'en':{'deleteTitle':'Remove'}}}"></dw-action-toolbar>
  ```
  #### Example of disabled icon:
  ```html
  <dw-action-toolbar .primaryActions="${['edit','delete']}" .disabledActions="${['delete']}"></dw-action-toolbar>
  ```
  #### Example of disabled icon with title:
  ```html
  <dw-action-toolbar .primaryActions="${['edit','delete']}" .disabledActions="${['delete']}" .langResources="${{'en':{'deleteDisabledTooltip':'Delete is not allowed'}}}"></dw-action-toolbar>
  ```
  #### Example of set icons:
  ```html
  <dw-action-toolbar .primaryActions="${['edit','delete']}" .icons="${{'edit':'myicons:edit'}}"></dw-action-toolbar>
  ```
  #### Example of set hover target ancestors selector:
  ```html
  <dw-action-toolbar .primaryActions="${['edit','delete']}" .hoverTargetParentSelector="data-table-row"></dw-action-toolbar>
  ```