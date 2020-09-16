# Wizard.js
Wizard.js can create step by step wizards on webpage

## Quick start
1. Add scripts and styles
```html
<link rel="stylesheet" href="wizard.min.css">
<script src="wizard.js"></script>
```
2. Add attribute data-wizard with discrptions
```html
<div data-wizard="You can edit price here">
	<label>Price</label>
	<input type="number" value="5000">
</div>
```
3. Start wizard ater loading page
```js
var wizard = new ScreenWizard();
```

## Features
Change order of wizard hints by data-index
```html
<div data-index="3" data-wizard="You can edit price here">
	<label>Price</label>
	<input type="number" value="5000">
</div>
```
Change wizard options and call methods
```js
window.wizard = new ScreenWizard({
	autostart: false
});

document.querySelector(".button-start").addEventListener("click", function(){
	wizard.start();
});
```

## Options
- autostart (Default: true)
- fogPadding (Default: 4)
- stopOnOverlayClick (Default: true)
- showOnce (Default: true)
- hintHtml
- buttonStrings (Default: ['Понятно','Дальше','Ок','Ясно'])

Opacity, transition duration, colors and other styles you can change by CSS.

## Methods
- wizard.start();
- wizard.exitWizard();
