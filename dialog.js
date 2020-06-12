class Dialog extends HTMLElement {

  static get Buttons() {
    return {
      OK: "0",
      Cancel: "1"
    }
  }

  #pos1 = 0;
  #pos2 = 0;
  #pos3 = 0;
  #pos4 = 0;

  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  init(options) {
    const me = this;

    var title = options.title;
    var theme = options.theme;
    var buttons = options.buttons || [];

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="mp-components.css">`;
    me.shadow.innerHTML += `<link rel="stylesheet" type="text/css" href="w3.css">`;
    me.shadow.innerHTML += `<div class="dialogheader ${theme}">${title}</div><span class="dialogclose ${theme}">&times;</span><div class="dialogcontent"><slot></slot></div><div class="dialogfooter ${theme}"></div>`;
    
    me.header = me.shadow.querySelector(".dialogheader");
    me.header.addEventListener("mousedown", function (e) {
      dragMouseDown(e);
    });

    me.close = me.shadow.querySelector(".dialogclose");
    me.close.addEventListener("click", function (e) {
      closeDialog(e);
    });

    //this.content = this.shadow.querySelector(".dialogcontent");

    me.footer = me.shadow.querySelector(".dialogfooter");
    if (buttons && buttons.length > 0) {
      buttons.forEach(function (name, index) {

        var btnName = "";

        switch (name) {

          case Dialog.Buttons.OK:
            btnName = "OK";
            break;
          
          case Dialog.Buttons.Cancel:
            btnName = "Cancel";
            break;
          
          default:
            btnName = "Unknown";
            break;
        }
  
        var btn = document.createElement("button");
        var txt = document.createTextNode(btnName);
        btn.appendChild(txt);
        btn.value = name;
        btn.setAttribute("class", "w3-right");
        btn.addEventListener("click", buttonClick);
        me.footer.append(btn);
      });
    }

    function buttonClick(e) {
      e = e || window.event;
      e.preventDefault();
      switch (e.srcElement.value) {

        case Dialog.Buttons.OK:
          console.log("OK pressed");
          break;
        
        case Dialog.Buttons.Cancel:
          console.log("Cancel pressed");
          break;
        
        default:
          console.log("Unknown pressed");
          break;
      }
    }

    function closeDialog(e) {
      e = e || window.event;
      e.preventDefault();
      me.style.display = 'none';
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      me.#pos3 = e.clientX;
      me.#pos4 = e.clientY;
      // release mouse when drag ends  
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      me.#pos1 = me.#pos3 - e.clientX;
      me.#pos2 = me.#pos4 - e.clientY;
      me.#pos3 = e.clientX;
      me.#pos4 = e.clientY;
      // set the element's new position:
      me.style.top = (me.offsetTop - me.#pos2) + "px";
      me.style.left = (me.offsetLeft - me.#pos1) + "px";
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
window.customElements.define("mp-dialog", Dialog);
