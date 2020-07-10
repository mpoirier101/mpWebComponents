class mpTable extends HTMLElement {

  constructor() {
    super();
  }
  // connectedCallback() {}
  // disconnectedCallback() {}

  _caption = ""; 
  _width = 0;
  _height = 0;
  _themeUrl = "";
  _theme = "";
  _rowClick = null;
  _columns = [];
  _data = [];
  _json = "";
  _sortOrder = 1;
  _sortProp = "";
  
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
    this._printTable(me._data, me._columns);
  }

  init(options = {}) {
    const me = this;

    me._caption = options.caption || me.getAttribute("caption") || "";
    me._width = options.width || me.getAttribute("width") || "100%";
    me._height = options.height || me.getAttribute("height") || "";
    me._themeUrl = options.themeUrl;
    me._theme = options.theme || "";
    me._rowClick = options.rowClick || null;
    me._columns = options.columns || [];
    me._data = options.data || [];
    me._json = options.json || "";

    me.shadow = me.attachShadow({ mode: "open" });
    me.shadow.innerHTML = `<link rel="stylesheet" type="text/css" href="/css/mp-components.css">`;
    if (me._themeUrl) { me.shadow.innerHTML += `<link rel="stylesheet" type="text/css" href="${me._themeUrl}">`; }
    me.shadow.innerHTML += `<div class="tableWrap"><table><thead></thead><tbody></tbody></table></div>`;
    
    me.table = me.shadow.querySelector(".tableWrap");
    if (me._width) me.table.setAttribute('width', me._width);
    if (me._width) me.table.style.maxWidth = me._width;
    if (me._height) me.table.setAttribute('height', me._height);
    if (me._height) me.table.style.maxHeight = me._height;

    if (me._rowClick) {
      me.rows = me.shadow.querySelector("tbody tr");
      me.rows.addEventListener("click", function (e) {
        me._rowClick(this.id);
      }, false);
    }

    if (me._json) {
      me._data = JSON.parse(me._json);
    }
    if (me._data) {
      this._printTable(me._data, me._columns);
    } else {
      table.html("no result");
    }
  }

  _printTable(items, columns) {
    const me = this;
    var thead = me.shadow.querySelector("thead");
    var tbody = me.shadow.querySelector("tbody");
    thead.innerHTML = "";
    tbody.innerHTML = "";
    printHeader(thead, columns);
    printRows(tbody, items, columns);

    function printHeader(thead, columns) {
      var tr = document.createElement('tr');
      columns.forEach(function (col, i) {
        var th = document.createElement('th');
        if (me._theme) th.classList.add(me._theme);
        th.innerText = col.display;
        th.addEventListener("click", function (e) {
          me._headClick(col.data);
        }, false);
        tr.append(th);
      });
      thead.append(tr);
    }

    function printRows(tbody, items, columns) {
      items.forEach(function (item, i) {
        var tr = document.createElement('tr');
        if (item.id) tr.setAttribute('id', item.id);
        columns.forEach(function (col, i) {
          var td = document.createElement('td');
          td.innerText = item[col.data] || "";
          tr.append(td);
        });
        tbody.append(tr);
      });
    }
  }

  _headClick(prop) {
    const me = this;
    if (prop != me._sortProp) {
      me._sortProp = prop;
      me._sortOrder = 1;
    } else {
      me._sortOrder = (me._sortOrder == 1) ? -1 : 1;
    }
    me._data.sort(dynamicSort(prop));
    me._printTable(me._data, me._columns);

    function dynamicSort(property) {
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * me._sortOrder;
      }
    }
  }
}
window.customElements.define("mp-table", mpTable);
