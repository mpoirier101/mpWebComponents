class SingleSelect extends HTMLElement {
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
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    me.shadow.innerHTML += `<div class="singleSelect">${caption} <input type="text" readonly /><div class="singleSelect-content"></div></div>`;
    
    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    me.ctrl = me.shadow.querySelector("input[type=text]");
    me.ctrl.placeholder = placeholder;
    me.ctrl.addEventListener("click", function (e) {
      toggleEvent(e);
    }, false);

    me.content = me.shadow.querySelector(".singleSelect-content");
    me.content.addEventListener("click", function (e) {
      toggleEvent(e);
    }, false);

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

  init(list, value) {
    const me = this;
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
}
window.customElements.define("single-select", SingleSelect);
