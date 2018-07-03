Roadmap.prototype._updateStorage = function() {
    localStorage.setItem('roadmap', JSON.stringify(this._userData));
}