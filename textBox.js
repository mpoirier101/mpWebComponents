class TextBox extends HTMLElement {

  static get observedAttributes() {
    return ["value"];
  }
  get value() {
    return this.ctrl.value;
  }

  constructor() {
    super();
  }

  init(value) {
    const me = this;
    var placeholder = me.getAttribute("placeholder") || "";
    var caption = me.getAttribute("caption") || "";
    var pattern = me.getAttribute("pattern") || "";

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class='textBox'>${caption} <input type="text" /></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    me.ctrl = me.shadow.querySelector("input[type=text]");
		if (value) {
			me.ctrl.value = value;
			me.ChangedEvent.detail.value = value;
		}
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

  attributeChangedCallback(name, oldVal, newVal) {
    this.value = newVal;
  }
}
window.customElements.define("mp-text", TextBox);
