class mpDate extends HTMLElement {

  constructor() {
    super();
  }
  // connectedCallback() {}
  // disconnectedCallback() {}

  init(options = {}) {
    const me = this;

    var placeholder = options.placeholder || me.getAttribute("placeholder") || "";
    var caption = options.caption || me.getAttribute("caption") || "Date";
    var pattern = options.pattern || me.getAttribute("pattern") || "\d{4}-\d{2}-\d{2}";
    var value = options.value || me.getAttribute("value") || "";
    var required = options.required || me.getAttribute("required") || "";

		me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class='dateRange'>${caption} <input type="date" /></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    me.ctrl = me.shadow.querySelector("input[type=date]");
    if (placeholder) { me.ctrl.placeholder = placeholder; }
    if (required) { me.ctrl.required = true; }
    if (pattern) { me.ctrl.pattern = pattern; }
		if (value) {
			me.ctrl.value = value;
			me.ChangedEvent.detail.value = value;
		}

    me.ctrl.addEventListener("change", function (e) {
      me.ChangedEvent.detail.value = me.ctrl.value;
      toggleEvent(e);
    }, false);

    function toggleEvent(e) {
      me.dispatchEvent(me.ChangedEvent);
    }
  }
}
window.customElements.define("mp-date", mpDate);
