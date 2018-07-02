Roadmap.prototype._onResize = function() {
    $(window).resize(() => {
        if (this._data.columns.length <=5) {
            this._data.nodeSizes = {
                width: -1
            };

            this._build();
        }
    });
}