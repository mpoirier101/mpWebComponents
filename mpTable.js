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
    
    me._theme = options.theme || "";
    me._columns = options.columns || [];
    me._data = options.data || [];
    json = options.json || "";

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
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
      me._printTable(me._data, me._columns);
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
    me._printTable();
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
        th.classList.add("theme");
        th.innerHTML = col.display;
        if (col.sort) th.innerHTML += (col.sort == 1) ? " &#9650;" : " &#9660;";

        th.addEventListener("click", function (e) {
          headClick(col);
        }, false);

        tr.append(th);
      });
      thead.append(tr);
    }

    function printRows(tbody, items, columns) {
      const me = this;
      items.forEach(function (item) {
        var tr = document.createElement('tr');
        if (item.id) {
          tr.setAttribute('id', item.id);

          tr.addEventListener("click", function (e) {
            rowClick(this);
          }, false);

        }
        columns.forEach(function (col, i) {
          var td = document.createElement('td');
          td.innerText = eval("item." + col.data);
          tr.append(td);
        });
        tbody.append(tr);
      });
    }

    function rowClick(row) {
      me.selectRow(row.id);
      me.RowClickEvent.detail.value = row.id;
      me.dispatchEvent(me.RowClickEvent);
    }

    function headClick(col) {
      if (col.data != me._sortProp) {
        me._sortProp = col.data;
        me._sortOrder = 1;
      } else {
        me._sortOrder = (me._sortOrder == 1) ? -1 : 1;
      }
      me._data.sort(dynamicSort(col.data));
      me._columns.map((x) => x.sort = "");
      me._columns.find((x) => x.data == col.data).sort = me._sortOrder;
      me._printTable();
    }

    function dynamicSort(property) {
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * me._sortOrder;
      }
    }
  }

  selectRow(id) {
    const me = this;
    if (me._theme) {
      var rows = me.shadow.querySelectorAll('tbody tr');
      rows.forEach(function (row) {
        if (row.id == id) {
          row.classList.add(me._theme);
          row.scrollIntoView();
        } else {
          row.classList.remove(me._theme);
				}
      });
		}
    //me.RowClickEvent.detail.value = row.id;
    //me.dispatchEvent(me.RowClickEvent);
	}
}
window.customElements.define("mp-table", mpTable);
