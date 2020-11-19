class mpTextBox extends HTMLElement {

  constructor() {
    super();
  }
  //connectedCallback() {}
  // disconnectedCallback() {}

  init(options = {}) {
    const parent = this.parentElement;
    const me = this;

    var name = options.name || me.getAttribute("name") || "";
    var placeholder = options.placeholder || me.getAttribute("placeholder") || "Enter text";
    var caption = options.caption || me.getAttribute("caption") || "";
    var pattern = options.pattern || me.getAttribute("pattern") || "";
    var value = options.value || me.getAttribute("value") || "";
    var required = options.required || me.getAttribute("required") || "";
    var maxlen = options.maxlength || me.getAttribute("maxlength") || "";
    var type = options.type || me.getAttribute("type") || "text";

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class='textBox'>${caption} <input type="${type}" /></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.name = name;
    parent.append(input);

    me.ctrl = me.shadow.querySelector("input[type="+type+"]");

    if (placeholder) { me.ctrl.placeholder = placeholder; }
    if (required) { me.ctrl.required = true; }
    if (pattern) { me.ctrl.pattern = pattern; }
    if (maxlen) { me.ctrl.maxlength = maxlen; }
		if (value) {
      input.value = me.ctrl.value;
			me.ctrl.value = value;
			me.ChangedEvent.detail.value = value;
		}

    me.ctrl.addEventListener("input", function (e) {
      input.value = me.ctrl.value;
      me.ChangedEvent.detail.value = me.ctrl.value;
      toggleEvent();
    }, false);
    
    function toggleEvent() {
      me.dispatchEvent(me.ChangedEvent);
    }
  }
}
window.customElements.define("mp-text", mpTextBox);
