class mpSelectMany extends HTMLElement {
  
  constructor() {
    super();
  }
  // connectedCallback() {}
  // disconnectedCallback() {}

  init(options = {}) {
    const me = this;

    var placeholder = options.placeholder || me.getAttribute("placeholder") || "";
    var caption = options.caption || me.getAttribute("caption") || "";
    var value = options.value || (me.getAttribute("value") || "").split(',');
    var required = options.required || me.getAttribute("required") || "";
    var list = options.list || (me.getAttribute("list") || "").split(',');
    var descriptions = [];

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class="multiSelect">${caption} <input type="text" readonly /><div class="multiSelect-content"></div></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: [],
    });

    me.ctrl = me.shadow.querySelector("input[type=text]");
    if (placeholder) { me.ctrl.placeholder = placeholder; }
    if (required) { me.ctrl.required = true; }

    me.content = me.shadow.querySelector(".multiSelect-content");
    me.content.addEventListener("click", function (e) {
      toggleEvent(e);
    }, false);

    if (list && list.length > 0) {
      list.forEach(function (item, i) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = me.id + item[0];
        checkbox.name = me.id;
        checkbox.value = item[0];

        if (value && value.indexOf(item[0]) > -1) {
          checkbox.checked = true;
          me.ChangedEvent.detail.push(item[0]);
          descriptions.push(item[1]);
        }

        var label = document.createElement("label");
        label.htmlFor = me.id + item[0];
        label.innerText = item[1];
        var div = document.createElement("div");
        div.append(checkbox);
        div.append(label);
        me.content.append(div);
      });
    }

    var desc = descriptions.join(", ");
    me.ctrl.value = desc;
    me.ctrl.title = desc;

    function toggleEvent(e) {
      me.ChangedEvent.detail.length = 0;
      var descriptions = [];
      var selected = me.shadow.querySelectorAll("input:checked");
      selected.forEach((checkbox) => {
        me.ChangedEvent.detail.push(checkbox.value);
        descriptions.push(checkbox.nextElementSibling.textContent);
      });
      var desc = descriptions.join(", ");
      me.ctrl.value = desc;
      me.ctrl.title = desc;
      me.dispatchEvent(me.ChangedEvent);
    }
  }
}
window.customElements.define("mp-selectmany", mpSelectMany);
