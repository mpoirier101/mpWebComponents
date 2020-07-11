class mpTable extends HTMLElement {

  constructor() {
    super();
  }
  // connectedCallback() {}
  // disconnectedCallback() {}

  _theme = "";
  _columns = [];
  _data = [];
  _sortOrder = 1;
  _sortProp = "";
  
  init(options = {}) {
    const me = this;

    var width = 0;
    var height = 0;
    var themeUrl = "";
    var json = "";
  
    width = options.width || me.getAttribute("width") || "100%";
    height = options.height || me.getAttribute("height") || "";
    themeUrl = options.themeUrl;
    
    me._theme = options.theme || "";
    me._columns = options.columns || [];
    me._data = options.data || [];
    json = options.json || "";

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    if (themeUrl) { me.shadow.innerHTML += `<link rel="stylesheet" type="text/css" href="${themeUrl}">`; }
    me.shadow.innerHTML += `<div class="tableWrap"><table><thead></thead><tbody></tbody></table></div>`;

    me.RowClickEvent = new CustomEvent("rowClick", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: "" },
    });

    me.table = me.shadow.querySelector(".tableWrap");
    if (width) me.table.setAttribute('width', width);
    if (width) me.table.style.maxWidth = width;
    if (height) me.table.setAttribute('height', height);
    if (height) me.table.style.maxHeight = height;

    if (json) {
      me._data = JSON.parse(json);
    }
    if (me._data) {
      this._printTable(me._data, me._columns);
    }
  }

  fillTable(items, columns) {
    const me = this;
    if (items) {
      if (items instanceof Array) {
        me._data = items;
      } else {
        me._data = JSON.parse(items);
      }
    }
    if (columns) {
      if (columns instanceof Array) {
        me._columns = columns;
      } else {
        me._columns = JSON.parse(columns);
      }
    }
    this._printTable();
  }

  _printTable() {
    const me = this;
    var thead = me.shadow.querySelector("thead");
    var tbody = me.shadow.querySelector("tbody");
    thead.innerHTML = "";
    tbody.innerHTML = "";
    printHeader(thead, me._columns);
    printRows(tbody, me._data, me._columns);

    function printHeader(thead, columns) {
      var tr = document.createElement('tr');
      columns.forEach(function (col, i) {
        var th = document.createElement('th');
        if (me._theme) th.classList.add(me._theme);
        th.innerHTML = col.display;
        if (col.sort) th.innerHTML += (col.sort == 1) ? " &#9650;" : " &#9660;";
        th.addEventListener("click", function (e) {
          headClick(col.data);
        }, false);
        tr.append(th);
      });
      thead.append(tr);
    }

    function printRows(tbody, items, columns) {
      items.forEach(function (item, i) {
        var tr = document.createElement('tr');
        if (item.id) {
          tr.setAttribute('id', item.id);
          tr.addEventListener("click", function (e) {
            me.RowClickEvent.detail.value = this.id;
            me.dispatchEvent(me.RowClickEvent);
          }, false);
        }  
        columns.forEach(function (col, i) {
          var td = document.createElement('td');
          td.innerText = item[col.data] || "";
          tr.append(td);
        });
        tbody.append(tr);
      });
    }

    function headClick(prop) {
      if (prop != me._sortProp) {
        me._sortProp = prop;
        me._sortOrder = 1;
      } else {
        me._sortOrder = (me._sortOrder == 1) ? -1 : 1;
      }
      me._data.sort(dynamicSort(prop));
      me._columns.map((x) => x.sort = "");
      me._columns.find((x) => x.data == prop).sort = me._sortOrder;
      me._printTable();
  
      function dynamicSort(property) {
        return function (a, b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * me._sortOrder;
        }
      }
    }
   }
}
window.customElements.define("mp-table", mpTable);
