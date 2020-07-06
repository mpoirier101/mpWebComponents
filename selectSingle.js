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
    me.ctrl.addEventListener("click", function (e) {
      toggleEvent(e);
    }, false);
    me.ctrl.addEventListener("focusout", function (e) {
      deferCloseContent(e);
    }, false);

    me.content = me.shadow.querySelector(".singleSelect-content");
    me.content.addEventListener("mouseleave", function (e) {
      closeContent(e);
    }, false);
    me.content.addEventListener("click", function (e) {
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

    function deferCloseContent(e) {
      setTimeout(closeContent, 300);
    }

    function closeContent(e) {
      me.content.classList.remove("show");
    }

    function toggleEvent(e) {
      if (!me.content.classList.contains("show")) {
        me.content.classList.add("show");
      } else {
        var target = e.target;
        if (target.tagName == "OPTION") {
          me.ChangedEvent.detail.value = target.value;
          me.ctrl.value = target.text;
          me.ctrl.title = target.text;
          me.dispatchEvent(me.ChangedEvent);
        }
        me.content.classList.remove("show");
      }
    }
  }
}
window.customElements.define("mp-select", mpSelectSingle);
