export class Highlighter {
	private targetNode: HTMLElement;
	private highlightTag: string;
	private skipTags: RegExp;
	private colors: string[];
	private wordColor: string[];
	private colorIdx: number;
	private matchRegExp: RegExp | null;
	private openLeft: boolean;
	private openRight: boolean;
	private endRegExp: RegExp;
	private breakRegExp: RegExp;
	private selector: string;

	constructor(selector: string, tag?: string) {
		// private variables
		this.selector = selector;
		this.targetNode = document.querySelector(selector) || document.body;
		this.highlightTag = tag || "MARK";
		this.skipTags = new RegExp("^(?:" + this.highlightTag + "|SCRIPT)$");
		this.colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
		this.wordColor = [];
		this.colorIdx = 0;
		this.openLeft = false;
		this.openRight = false;
		this.matchRegExp = null;

		// characters to strip from start and end of the input string
		this.endRegExp = new RegExp("^[^\\w]+|[^\\w]+$", "g");

		// characters used to break up the input string into words
		this.breakRegExp = new RegExp("[^\\w'-]+", "g");
	}

	private setRegex(input: string) {
		const preparedInput = input
			.replace(this.endRegExp, "")
			.replace(this.breakRegExp, "|")
			.replace(/^\||\|$/g, "");

		if (preparedInput) {
			this.matchRegExp = new RegExp(preparedInput, "i");

			return this.matchRegExp;
		}

		return false;
	}

	// recursively apply word highlighting
	private highlightWords(node: Element | ChildNode) {
		// console.log(node);
		if (!node || !this.matchRegExp || this.skipTags.test(node.nodeName)) return;

		if (node.hasChildNodes()) {
			node.childNodes.forEach((childNode: ChildNode) => {
				this.highlightWords(childNode);
			});
		}

		if (node.nodeType === 3) {
			// NODE_TEXT

			if (node.nodeValue) {
				const matchIndexes = this.matchRegExp.exec(node.nodeValue);

				if (!matchIndexes) return;
				const first = Number.parseInt(matchIndexes[0]);

				if (!this.wordColor[first]) {
					this.wordColor[first] =
						this.colors[this.colorIdx++ % this.colors.length];
				}

				const match = document.createElement(this.highlightTag);
				match.appendChild(document.createTextNode(matchIndexes[0]));
				match.style.backgroundColor = this.wordColor[first];
				match.style.color = "#000";

				const after = (node as any).splitText(matchIndexes.index);
				after.nodeValue = after.nodeValue.substring(matchIndexes[0].length);
				node.parentNode?.insertBefore(match, after);
			}
		}
	}

	// remove highlighting
	public remove() {
		const arr = document.getElementsByTagName(this.highlightTag);
		let el = arr[0];
		while (el) {
			const parent = el.parentNode;

			if (el.firstChild && parent) {
				parent.replaceChild(el.firstChild, el);
				parent.normalize();
			}
			el = arr[0];
		}
	}

	// start highlighting at target node
	public apply(highlightValue: string) {
		this.remove();
		const preparedHighlightValue = highlightValue.replace(/(^\s+|\s+$)/g, "");

		if (preparedHighlightValue.length === 0) {
			return;
		}

		if (this.setRegex(preparedHighlightValue)) {
			this.targetNode = document.querySelector(this.selector) || document.body;
			this.highlightWords(this.targetNode);
		}

		return this.matchRegExp;
	}
}
