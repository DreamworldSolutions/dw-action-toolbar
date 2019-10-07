# action-toolbar

- Extended version of [dw-select](https://github.com/DreamworldSolutions/dw-select). 
- It's mainly element is used to display action toolbar.
  - Show primary action by default.
  - Show semi primary action on hover of `action-toolbar`.
  - Other action(exclude primary) show in dropdown.

## Install

`npm install --save @dreamworld/dw-action-toolbar`

## Usage

```javascript
import '@dreamworld/dw-action-toolbar/action-toolbar';
```
## Events
- Fires `action` event with action name.

## Features
- Hide actions
- Disable action with tooltip

### Hide actions
- Provide way to hide actions from master actions.
- Using `hiddenActions` property to hide a action.

#### Example with hidden actions:
  ```html
  <action-toolbar .actions="${[{name: 'ADD', label: 'Add', icon: 'content.add'}, {name: 'EDIT', label: 'Edit', icon: 'editor.edit'},      {name: 'DELETE', label: 'Delete', icon: 'action.delete'}]}" .hiddenActions="${['DELETE', 'ADD']}">
  </action-toolbar>
  ```

### Disable action with tooltip
  - Disable action using `disabledActions` property.
  - Passed `action` as `key` and `tooltip` as a `value` of object.

#### Example with disabled actions:
  ```html
  <action-toolbar .actions="${[{name: 'ADD', label: 'Add', icon: 'content.add'}, {name: 'EDIT', label: 'Edit', icon: 'editor.edit'},      {name: 'DELETE', label: 'Delete', icon: 'action.delete'}]}" .disabledActions="${{'DELETE': 'User has no write permission'}}">
  </action-toolbar>
  ```

## Examples
  ### Example with actions:
  ```html
  <action-toolbar .actions="${[{name: 'ADD', label: 'Add', icon: 'content.add'}, {name: 'EDIT', label: 'Edit', icon: 'editor.edit'}, {name: 'DELETE', label: 'Delete', icon: 'action.delete'}]}"></action-toolbar>
  ```

# Road map
- Support `primaryActions` & `semiPrimaryActions`.