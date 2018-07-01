Roadmap.prototype._pseudoStyle = function(hostElement, pseudoElement, prop, value) {
    const _sheetId = "pseudoStyles";
    const _head = document.head || document.getElementsByTagName('head')[0];
    const _sheet = document.getElementById(_sheetId) || document.createElement('style');
    _sheet.id = _sheetId;
    const className = "pseudoStyle" + Math.floor(Math.random() * (999999999 + 1));

    hostElement.addClass(className);
    
    _sheet.innerHTML += "." + this._data.classnamePrefix + "container ." + className + ":" + pseudoElement + "{" + prop + ":" + value + " !important}";
    _head.appendChild(_sheet);
}