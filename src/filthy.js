const ALLOWED_TAGS = 'div,p,a,br,i,em,strong,b,img';
const ALLOWED_ATTRS = 'href,title,alt,src,width,height';

const createDoc = () => document.implementation.createHTMLDocument();
const createDiv = (doc) => doc.createElement('div');

let doc;

function cleanAttribute(name, content) {
	if(['href', 'src'].indexOf(name) < 0) return content;
	const urlPattern = /^((http|https|ftp):\/\/)/;
	if(!urlPattern.test(content)) return '';
	return content;
}

function cleanNode(originalNode, allowedAttrs) {
	const nodeName = originalNode.nodeName.toLowerCase();
	const nodeCopy = doc.createElement(nodeName);

	for(let n = 0; n < originalNode.attributes.length; n++) {
		const attrName = originalNode.attributes.item(n).name;
		if(allowedAttrs.indexOf(attrName) > -1) {
			const attr = cleanAttribute(attrName, originalNode.getAttribute(attrName))
			nodeCopy.setAttribute(attrName, attr);
		}
	}

	return nodeCopy;
}

function filter(node, opts = {}) {
	const nodeName = node.nodeName.toLowerCase();
	const allowedNodes = opts.allowedNodes || ALLOWED_TAGS.split(',');
	const allowedAttrs = opts.allowedAttrs || ALLOWED_ATTRS.split(',');

	if(nodeName === '#text') return node;
	if(nodeName === '#comment') return doc.createTextNode('');
	if(allowedNodes.indexOf(nodeName) < 0) return doc.createTextNode('');

	const nodeCopy = cleanNode(node, allowedAttrs);

	while (node.childNodes.length > 0) {
    const child = node.removeChild(node.childNodes[0]);
    nodeCopy.appendChild(filter(child, opts));
  }

	return nodeCopy;
}

function sanitizeHtml(htmlString, opts) {
	doc = createDoc();
	const div = createDiv(doc);
	div.innerHTML = htmlString;
	return filter(div, opts).innerHTML;
}

module.exports = sanitizeHtml;
