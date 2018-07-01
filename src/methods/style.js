Roadmap.prototype.style = function(styles) {
    if (!styles) {
        throw new Error('You must call Roadmap.style with a styles');
    }

    this._data.styles = styles;
    this._userData.styles = styles;

    this._data.columns.forEach((columnData, idx) => {
        this._data.columns[idx].color = this._data.styles[idx];
    });

    this._build();
}