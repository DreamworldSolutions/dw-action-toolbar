# @dreamworld/dw-action-toolbar

A LitElement Web Component that renders an action toolbar combining primary icon-buttons and a dropdown menu. Actions are declaratively configured; the split between visible icon-buttons and dropdown items is controlled at runtime via the `primaryActions` property.

---

## 1. User Guide

### Installation & Setup

```bash
yarn add @dreamworld/dw-action-toolbar
```

Import the component before using it in HTML or another LitElement:

```javascript
import "@dreamworld/dw-action-toolbar/dw-action-toolbar.js";
```

To run the local development server (requires `@web/dev-server`):

```bash
yarn start
```

---

### Basic Usage

```html
<dw-action-toolbar
  .actions="${actions}"
  .primaryActions="${['EDIT']}"
  .disabledActions="${{ DELETE: 'User has no write permission' }}"
  .hiddenActions="${['OPEN']}"
  .dialogTitle="Board Actions"
  @action="${(e) => console.log('action:', e.detail.name)}"
></dw-action-toolbar>
```

```javascript
const actions = [
  { name: "OPEN",  label: "Open",     icon: "folder_open" },
  { name: "ADD",   label: "Add",      icon: "add" },
  { name: "EDIT",  label: "Edit",     icon: "edit" },
  {
    name: "DOWNLOAD",
    label: "Download",
    icon: "download",
    subActionTitle: "Header",
    subActions: [
      { name: "PDF",   label: "PDF",   icon: "picture_as_pdf" },
      { name: "Excel", label: "Excel", icon: "description" },
    ],
  },
  {
    name: "SHARE",
    label: "Share",
    icon: "share",
    subActions: [
      { name: "SMS",   label: "SMS",   icon: "sms" },
      { name: "EMAIL", label: "E Mail", icon: "mail" },
    ],
  },
  { name: "DELETE", label: "Delete", icon: "delete", danger: true },
];
```

---

### API Reference

#### Action Object Schema

Each item in the `actions` array may contain the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `String` | Yes | Unique identifier for the action. Used as the key for `primaryActions`, `disabledActions`, and `hiddenActions`. |
| `label` | `String` | Yes | Display text shown in the dropdown list. |
| `icon` | `String` | Yes | Material icon name. |
| `iconFont` | `String` | No | Custom icon font identifier, passed to `<dw-icon-button>`. |
| `iconSymbol` | `String` | No | Custom icon symbol, passed to `<dw-icon-button>`. |
| `tooltip` | `String` | No | Tooltip text shown on hover for primary action buttons (non-touch devices only). |
| `iconColor` | `String` | No | Color for the action icon. Accepts a hex/CSS color (e.g. `"#ff0000"`) or a CSS custom property name prefixed with `-` (e.g. `"--my-color"`). |
| `danger` | `Boolean` | No | Marks the action as destructive (forwarded to `<dw-menu>` for styling). |
| `subActionTitle` | `String` | No | Heading text shown in the nested submenu when this action is expanded. |
| `subActions` | `Array` | No | Nested actions using the same object schema. Rendered as a secondary `<dw-menu>` anchored to this action's button. |

---

#### Props / Attributes

| Property | Type | Default | Reflected Attribute | Description |
|---|---|---|---|---|
| `actions` | `Array` | — | — | Master list of all available actions. Drives the entire toolbar. Changes trigger a recompute of the primary/secondary split. |
| `primaryActions` | `Array` | `[]` | — | Names of actions to render as visible icon-buttons. All other actions appear in the dropdown. Must reference names declared in `actions`. |
| `disabledActions` | `Object` | — | — | Map of `{ actionName: tooltipMessage }`. Matching actions are rendered as disabled; the tooltip message is shown on hover. |
| `hiddenActions` | `Array` | — | — | Names of actions to exclude from rendering entirely. Applied recursively — can hide top-level actions or nested `subActions`. |
| `primaryActionButtonSize` | `Number` | `48` | — | Size of primary icon-buttons in pixels. |
| `primaryActionIconSize` | `Number` | `24` | — | Size of icons within primary buttons, in pixels. Also applied to the dropdown trigger button. |
| `listItemIconSize` | `Number` | `24` | — | Icon size for items rendered inside the dropdown list, in pixels. |
| `triggerIcon` | `String` | `"more_vert"` | — | Icon name for the button that opens the secondary-actions dropdown. |
| `mobileMode` | `Boolean` | `false` | `mobile-mode` | When `true`, renders the dropdown as a full-screen dialog (via `<dw-menu>` mobile mode). |
| `noHeader` | `Boolean` | `false` | `no-header` | When `true`, hides the header (title + close button area) of the dialog. |
| `dialogTitle` | `String` | — | — | Heading text displayed in the dropdown dialog. For submenus, the action's `subActionTitle` is used instead. |
| `alwaysFullScreenInMobile` | `Boolean` | `false` | — | Forces full-screen rendering in mobile mode regardless of item count. |
| `customTrigger` | `Boolean` | `false` | `custom-trigger` | Removes the default trigger button. Provide a custom trigger element via a slot. |
| `noCloseIcon` | `Boolean` | `true` | — | When `true`, hides the close icon in the dropdown. |
| `closeIcon` | `String` | `"close"` | — | Icon name for the close button inside the dropdown dialog. |
| `closeIconPosition` | `String` | `"right"` | — | Position of the close icon: `"left"` or `"right"`. Has no effect when `noCloseIcon` is `true`. |
| `dialogHAlign` | `String` | `"left"` | — | Horizontal alignment of the dropdown relative to its trigger: `"left"` or `"right"`. |
| `dialogVAlign` | `String` | `"bottom"` | — | Vertical alignment of the dropdown relative to its trigger: `"top"` or `"bottom"`. |
| `dialogHOffset` | `Number` | `0` | — | Horizontal offset in pixels. Negative values allowed. |
| `dialogVOffset` | `Number` | `0` | — | Vertical offset in pixels. Negative values allowed. |
| `customFooterTemplate` | `Object` | — | — | A LitHTML `TemplateResult` rendered into the dropdown footer. |

---

#### Events

| Event | Detail Type | Description |
|---|---|---|
| `action` | `{ name: String }` | Dispatched when a primary action button is clicked or a dropdown/submenu action is selected. `detail.name` is the action's `name` string. For primary actions, fires after the button's ripple animation completes. |

---

#### CSS Custom Properties

The `:host` element establishes a flex row layout:

```css
:host {
  display: flex;
  flex-direction: row;
  align-items: center;
}
```

Per-action icon color is applied inline via two CSS custom properties, driven by the action's `iconColor` field:

| CSS Custom Property | Set When | Value |
|---|---|---|
| `--dw-icon-color` | `action.iconColor` is defined | The resolved color value or `var(--your-property)` |
| `--mdc-theme-on-surface` | `action.iconColor` is defined | Same as `--dw-icon-color` |

---

### Advanced Usage

#### Actions with Nested Submenus

When a `primaryActions` item has a `subActions` array, clicking it opens a secondary `<dw-menu>` anchored to that button rather than dispatching an `action` event. The submenu uses `subActionTitle` as its heading if provided. On mobile devices, the menu renders as a bottom-sheet dialog; on desktop it renders as a popover.

```javascript
const actions = [
  {
    name: "DOWNLOAD",
    label: "Download",
    icon: "download",
    subActionTitle: "Choose Format",
    subActions: [
      { name: "PDF",   label: "PDF",   icon: "picture_as_pdf" },
      { name: "Excel", label: "Excel", icon: "description" },
    ],
  },
];
```

```html
<dw-action-toolbar
  .actions="${actions}"
  .primaryActions="${['DOWNLOAD']}"
  @action="${(e) => console.log(e.detail.name)}"
></dw-action-toolbar>
```

The `action` event fires with `"PDF"` or `"Excel"` when a sub-action is selected.

#### Mobile vs. Desktop Layout

```html
<!-- Desktop: popover dropdown, aligned to the right of the trigger -->
<dw-action-toolbar
  .actions="${actions}"
  .dialogHAlign="${'right'}"
  .mobileMode="${false}"
></dw-action-toolbar>

<!-- Mobile: full-screen dialog with two primary icon-buttons -->
<dw-action-toolbar
  .actions="${actions}"
  .primaryActions="${['SHARE', 'DOWNLOAD']}"
  .dialogTitle="${'Board Actions'}"
  mobile-mode
></dw-action-toolbar>
```

#### Per-Action Icon Color

```javascript
const actions = [
  // Hex color
  { name: "DELETE", label: "Delete", icon: "delete", iconColor: "#f44336" },
  // CSS custom property (must be prefixed with "-")
  { name: "EDIT",   label: "Edit",   icon: "edit",   iconColor: "--my-edit-color" },
];
```

---

## 2. Developer Guide / Architecture

### Architecture Overview

**Pattern**: Declarative LitElement Web Component with computed reactive state.

**Module Responsibilities**:

| Module | Role |
|---|---|
| `DwActionToolbar` | Top-level component. Owns `actions`, `primaryActions`, `hiddenActions`, `disabledActions` input state. Computes derived render lists. |
| `<dw-icon-button>` | Renders each primary action as a clickable icon button with ripple animation support. |
| `<dw-menu>` | Renders secondary actions as a popover or full-screen dialog. Handles placement, mobile mode, and subAction heading. |
| `DeviceInfo` | Provides `touch` capability flag at construction time to suppress tooltips on touch devices. |

**Data Flow**:

```
actions / primaryActions / hiddenActions
           │
           ▼
    _computeItems()
           │
     ┌─────┴──────┐
     ▼             ▼
_primaryActions  _secondaryActions
     │             │
<dw-icon-button>  <dw-menu> (via trigger button)
     │             │
     └──── action event ────┘
```

**Computed State Strategy**:

`_primaryActions` and `_secondaryActions` are recomputed inside `_computeItems()` each time any of `actions`, `primaryActions`, or `hiddenActions` changes. All three properties use custom getter/setter pairs that guard with lodash `isEqual()`, preventing re-renders when a deeply equal value is set again.

**Hidden Actions — Recursive Removal**:

`_removeHiddenActions()` walks the action tree recursively. Hidden names are excluded both at the top level and within any `subActions` arrays, producing a clean filtered clone without mutating the original `actions` input.

**Nested Submenu State Machine**:

```
State: _menuOpenedFor = undefined
  → user clicks trigger button
  → _opened = true
  → <dw-menu> shows _secondaryActions

State: _menuOpenedFor = "ACTION_NAME"
  → user clicks a primary button that has subActions
  → _opened = true
  → <dw-menu> shows action.subActions, heading = action.subActionTitle

State: dw-dialog-closed event fires
  → _opened = false, _menuOpenedFor = undefined
```

**Async Click Handling**:

Before dispatching the `action` event, the click handler awaits `target.waitForEntryAnimation` (a promise exposed by `<dw-icon-button>`) so the ripple animation completes before the application reacts (e.g., navigating away or toggling state).

**Key Dependencies**:

| Package | Usage |
|---|---|
| `@dreamworld/pwa-helpers` | LitElement, `css`, `html`, `nothing` re-exports |
| `lit/directives/repeat.js` | Keyed list rendering for primary action buttons |
| `lit/directives/style-map.js` | Inline icon color styles per action |
| `lodash-es` | `cloneDeep`, `filter`, `find`, `isEmpty`, `isEqual` |
| `@dreamworld/device-info` | Touch capability detection at construction |
