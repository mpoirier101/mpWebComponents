class TextBox extends HTMLElement {
  static get observedAttributes() {
    return ["value"];
  }

  constructor() {
    super();
  }

  load() {
    const me = this;
    var placeholder = me.getAttribute("placeholder") || "";
    var caption = me.getAttribute("caption") || "";
    var pattern = me.getAttribute("pattern") || "";

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<div class='textBox'>${caption} <input type="text" /></div>`;
    me.shadow.innerHTML += `<link rel="stylesheet" type="text/css" href="mp-components.css">`;

    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    me.ctrl = me.shadow.querySelector("input[type=text]");
    me.ctrl.placeholder = placeholder;
    me.ctrl.pattern = pattern;
    me.ctrl.addEventListener("input", function (e) {
      me.ChangedEvent.detail.value = me.ctrl.value;
        toggleEvent();
      }, false);

    function toggleEvent() {
      me.dispatchEvent(me.ChangedEvent);
    }
  }

  get value() {
    return this.ctrl.value;
  }

  connectedCallback() {
    if (!this.shadow) {
      this.load();
    }
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldVal, newVal) {
    this.value = newVal;
  }

  init(value) {
		if (value) {
			this.ctrl.value = value;
			this.ChangedEvent.detail.value = value;
		}
	}
}
window.customElements.define("mp-text", TextBox);
