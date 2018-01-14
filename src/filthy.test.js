const sanitizeHtml = require('./filthy');
const jsdom = require('jsdom').JSDOM;
const { document } = new jsdom('<!DOCTYPE html><p>Hello world</p>').window;

const filthyString = `
	<div class="xss" onload="javascript:doEvil();" aria-label="eval('alert('\'boo\)')">
		<link rel="stylesheet" href="http://github.com/style.css" />
		<p style="border: 1px solid red;">
			Lorem <strong>Ipsum</strong> dolor <b>sit</b> <em>amet</em><br />
			<u>underlined</u> and <i>italic</i>
			Go to <a href="http://github.com/keepitterron" title="Keepitterron's github">this profile</a>
		</p>
		<img src="http://keepitterron.github.io/keepitterron/avatar.png" alt="An image" width="700" height="600" />
		<!-- a pretty comment -->
		<a href="javascript:alert('evil')">this won't run</a>
		<script>alert(1);</script>
	</div>
`;

describe("filthy", () => {
  it("sanitizes an HTML string to be safely embedded", () => {
    const expected = `<div> <p> Lorem <strong>Ipsum</strong> dolor <b>sit</b> <em>amet</em><br> and <i>italic</i> Go to <a href=\"http://github.com/keepitterron\" title=\"Keepitterron's github\">this profile</a> </p> <img src=\"http://keepitterron.github.io/keepitterron/avatar.png\" alt=\"An image\" width=\"700\" height=\"600\"> <a href=\"\">this won't run</a> </div>`;
    const res = sanitizeHtml(filthyString);

    expect(formatHtmlString(res)).toBe(expected);
  });

  it("uses custom allowNodes if provided", () => {
    const expected = '<div> <link href="http://github.com/style.css"> </div>';
    const res = sanitizeHtml(filthyString, { allowedNodes: ["div", "link"] });

    expect(formatHtmlString(res)).toBe(expected);
  });

  it("uses custom allowAttrs if provided", () => {
    const expected = '<div> <img alt="An image"> </div>';
    const res = sanitizeHtml(filthyString, {
      allowedNodes: ["div", "img"],
      allowedAttrs: ["alt"]
    });

    expect(formatHtmlString(res)).toBe(expected);
  });
});

const formatHtmlString = str =>
  str
    .trim()
    .replace(/\n|\r/g, "")
    .replace(/\s\s+/g, " ");
