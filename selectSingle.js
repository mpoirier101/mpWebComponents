class mpSelectSingle extends HTMLElement {

  constructor() {
    super();
  }
  // connectedCallback() {}
  // disconnectedCallback() {}

  init(options = {}) {
    const me = this;

    var placeholder = options.placeholder || me.getAttribute("placeholder") || "";
    var caption = options.caption || me.getAttribute("caption") || "";
    var value = options.value || me.getAttribute("value") || "";
    var required = options.required || me.getAttribute("required") || "";
    var list = options.list || (me.getAttribute("list") || "").split(',');

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class="singleSelect">${caption} <input type="text" readonly /><div class="singleSelect-content"></div></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    me.ctrl = me.shadow.querySelector("input[type=text]");
    if (placeholder) { me.ctrl.placeholder = placeholder; }
    if (required) { me.ctrl.required = true; }

    me.content = me.shadow.querySelector(".singleSelect-content");
    me.content.addEventListener("click", function (e) {
      e.cancelBubble = true;
      toggleEvent(e);
    }, false);

    if (list && list.length > 0) {
      me.content.innerHTML = "";
      list.forEach(function (item, i) {
        var option = document.createElement("option");
        option.value = item[0];
        option.text = item[1];
        if (value == item[0]) {
          me.ctrl.value = item[1];
          me.ctrl.title = item[1];
          me.ChangedEvent.detail.value = item[0];
        }
        me.content.append(option);
      });
    }

    function toggleEvent(e) {
      var target = e.target;
      if (target.tagName == "OPTION") {
        me.ChangedEvent.detail.value = target.value;
        me.ctrl.value = target.text;
        me.ctrl.title = target.text;
        me.dispatchEvent(me.ChangedEvent);
      }
    }
  }
}
window.customElements.define("mp-select", mpSelectSingle);
