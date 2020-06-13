class mpDialog extends HTMLElement {

  static get Buttons() {
    return {
      OK: "0",
      Cancel: "1"
    }
  }

  constructor() {
    super();
  }
  connectedCallback() {
    this.style.display = 'none';
    this.classList.add("dialog");
  }
  // disconnectedCallback() {}

  init(options) {
    const me = this;

    var pos1 = 0;
    var pos2 = 0;
    var pos3 = 0;
    var pos4 = 0;
  
    var title = options.title || "";
    var themeUrl = options.themeUrl;
    var theme = options.theme || "";
    var buttons = options.buttons || [];

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    if (themeUrl) {
      me.shadow.innerHTML += `<link rel="stylesheet" type="text/css" href="${themeUrl}">`;
    }
    me.shadow.innerHTML += `<div class="dialogheader ${theme}">${title}</div><span class="dialogclose ${theme}">&times;</span><div class="dialogcontent"><slot></slot></div><div class="dialogfooter ${theme}"></div>`;

    me.ClosedEvent = new CustomEvent("closed", {
      bubbles: false,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    me.header = me.shadow.querySelector(".dialogheader");
    me.header.addEventListener("mousedown", function (e) {
      dragMouseDown(e);
    });

    me.close = me.shadow.querySelector(".dialogclose");
    me.close.addEventListener("click", closeDialog);

    me.footer = me.shadow.querySelector(".dialogfooter");
    if (buttons && buttons.length > 0) {
      for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var btnName = "";
        switch (button) {
          case mpDialog.Buttons.OK:
            btnName = "OK";
            break;
          case mpDialog.Buttons.Cancel:
            btnName = "Cancel";
            break;
          default:
            btnName = "Unknown";
            break;
        }
        var btn = document.createElement("button");
        var txt = document.createTextNode(btnName);
        btn.append(txt);
        btn.value = button;
        btn.addEventListener("click", closeDialog);
        me.footer.append(btn);
      }
    }

    function closeDialog(e) {
      e = e || window.event;
      e.preventDefault();
      me.ClosedEvent.detail.value = e.srcElement.value;
      me.style.display = 'none';
      me.dispatchEvent(me.ClosedEvent);
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      // release mouse when drag ends  
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      me.style.top = (me.offsetTop - pos2) + "px";
      me.style.left = (me.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  show() {
    this.style.display = "flex";
  }
}
window.customElements.define("mp-dialog", mpDialog);
