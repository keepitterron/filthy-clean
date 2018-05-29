## Filthy
A lightweight, customizable library to sanitize user provided HTML.

### The problem
Injecting user provided HTML leaves your app vulnerable to XSS: a malicious user can run arbitrary javascript in your page.

### The approach
Instead of running complicated regexps on the html string itself, why not letting the browser handling the parsing instead?
`document.implementation.createHTMLDocument()` allows us to manipulate a DOM element without running any scripts or preloading any resource.

## Usage
```js
	const filthy = require('filthy-clean');
	const cleanHtml = filthy(userProvidedHtmlString, options);
```

### Options
- `options.allowedNodes` - An array of nodes to  keep (eg: ['div', 'br', 'strong'])
- `options.allowedAttrs` - An array of attributes to  keep (eg: ['alt', 'href', 'src'])

### Defaults
- `options.allowedNodes` - ['div, 'p', 'a', 'br', 'i', 'em', 'strong', 'b', 'img']
- `options.allowedAttrs` - ['href', 'title', 'alt', 'src', 'width', 'height']
