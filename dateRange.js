class DateRange extends HTMLElement {
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

		me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class='dateRange'>Start: <input type="date" required pattern="\d{4}-\d{2}-\d{2}" />&nbsp;End: <input type="date" required pattern="\d{4}-\d{2}-\d{2}" /></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: [],
    });

    me.start = me.shadow.querySelectorAll("input[type=date]")[0];
    me.start.addEventListener("change", function (e) {
      me.ChangedEvent.detail[0] = me.start.value;
      toggleEvent(e);
    }, false);

    me.end = me.shadow.querySelectorAll("input[type=date]")[1];
    me.end.addEventListener("change", function (e) {
      me.ChangedEvent.detail[1] = me.end.value;
      toggleEvent(e);
    }, false);

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

  init(selected) {
    const me = this;
    if (selected.length == 2) {
      me.start.value = selected[0];
      me.end.value = selected[1];
      me.ChangedEvent.detail[0] = selected[0];
      me.ChangedEvent.detail[1] = selected[1];
    }
  }
}
window.customElements.define("date-range", DateRange);
