class mpDateRange extends HTMLElement {

  constructor() {
    super();
  }
  // connectedCallback() {}
  // disconnectedCallback() {}

  init(options) {
    const me = this;

    var placeholders = options.placeholder || (me.getAttribute("placeholder") || "").split(',');
    var captions = options.caption || (me.getAttribute("caption") || "First,Last").split(',');
    var pattern = options.pattern || me.getAttribute("pattern") || "\d{4}-\d{2}-\d{2}";
    var values = options.value || (me.getAttribute("value") || "").split(',');
    var required = options.required || me.getAttribute("required") || "";

		me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class='dateRange'>${captions[0]} <input type="date" />&nbsp;${captions[1]} <input type="date" /></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: [],
    });

    me.start = me.shadow.querySelectorAll("input[type=date]")[0];
    if (placeholders[0]) { me.start.placeholder = placeholders[0]; }
    if (required) { me.start.required = true; }
    if (pattern) { me.start.pattern = pattern; }
    me.start.addEventListener("change", function (e) {
      me.ChangedEvent.detail[0] = me.start.value;
      toggleEvent(e);
    }, false);

    me.end = me.shadow.querySelectorAll("input[type=date]")[1];
    if (placeholders[1]) { me.end.placeholder = placeholders[1]; }
    if (required) { me.end.required = true; }
    if (pattern) { me.end.pattern = pattern; }
    me.end.addEventListener("change", function (e) {
      me.ChangedEvent.detail[1] = me.end.value;
      toggleEvent(e);
    }, false);
    
    if (values.length == 2) {
      me.start.value = values[0];
      me.end.value = values[1];
      me.ChangedEvent.detail[0] = values[0];
      me.ChangedEvent.detail[1] = values[1];
    }

    function toggleEvent(e) {
      if (!me.ChangedEvent.detail[0] || !me.ChangedEvent.detail[1]) {
        return;
      }
      if (me.ChangedEvent.detail[0] > me.ChangedEvent.detail[1]) {
        return;
      }
      me.dispatchEvent(me.ChangedEvent);
    }
  }
}
window.customElements.define("mp-daterange", mpDateRange);
