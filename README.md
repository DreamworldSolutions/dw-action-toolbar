
 # action-toolbar
  element is used to display action toolbar anywhere like in list, header, dialog.
  
  ## Behaviors
  [See all](https://docs.google.com/document/d/15tjrhPbrcqcbZ4rGQNtoJLOv4eOxPKfk4gxeltMmJKw)
  

### Install

`npm i @dw/dw-action-toolbar --save`

### Usage

```js
import '@dw/dw-action-toolbar/action-toolbar';
```
### Events
  Fires events by action name e.g for `delete` action fires `delete`


## Examples
#### Example of only primary action (no vert more, always visible):
```html
<action-toolbar .primaryActions="${['edit','delete']}"></action-toolbar>
```
  
 #### Example of primary and secondary actions:
  ```html
  <action-toolbar .primaryActions="${['edit']}" .secondaryActions="${['delete','archive']}" .semiPrimaryActions="${['delete']}"></action-toolbar>
  ```
  
  #### Example of action title:
  ```html
  <action-toolbar .primaryActions="${['edit','delete']}" .langResources="${{'en':{'deleteTitle':'Remove'}}}"></action-toolbar>
  ```
  #### Example of disabled icon:
  ```html
  <action-toolbar .primaryActions="${['edit','delete']}" .disabledActions="${['delete']}"></action-toolbar>
  ```
  #### Example of disabled icon with title:
  ```html
  <action-toolbar .primaryActions="${['edit','delete']}" .disabledActions="${['delete']}" .langResources="${{'en':{'deleteDisabledTooltip':'Delete is not allowed'}}}"></action-toolbar>
  ```
  #### Example of set icons:
  ```html
  <action-toolbar .primaryActions="${['edit','delete']}" .icons="${{'edit':'myicons:edit'}}"></action-toolbar>
  ```
  #### Example of set hover target ancestors selector:
  ```html
  <action-toolbar .primaryActions="${['edit','delete']}" .hoverTargetParentSelector="data-table-row"></action-toolbar>
  ```