class MultiSelect extends HTMLElement {
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
    me.shadow.innerHTML = `<div class="multiSelect">${caption} <input type="text" readonly /><div class="multiSelect-content"></div></div>`;
    me.shadow.innerHTML += `<link rel="stylesheet" type="text/css" href="mp-components.css">`;

    me.ChangedEvent = new CustomEvent("changed", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: [],
    });

    me.ctrl = me.shadow.querySelector("input[type=text]");
    me.ctrl.placeholder = placeholder;
    me.ctrl.addEventListener("click", function (e) {
      toggleEvent(e);
    }, false);

    me.content = me.shadow.querySelector(".multiSelect-content");
    me.content.addEventListener("mouseleave", function (e) {
      toggleEvent(e);
    }, false);

    function toggleEvent(e) {
			if (!me.content.classList.contains("show")) {
				me.content.classList.add("show");
			} else {
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

	init(list, selected) {
		const me = this;
    me.ChangedEvent.detail.length = 0;
		var descriptions = [];

		list.forEach(function (item, i) {
			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = me.id + item[0];
			checkbox.name = me.id;
			checkbox.value = item[0];

			if (selected && selected.indexOf(item[0]) > -1) {
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

		var desc = descriptions.join(", ");
		me.ctrl.value = desc;
		me.ctrl.title = desc;
	}
}
window.customElements.define("multi-select", MultiSelect);
