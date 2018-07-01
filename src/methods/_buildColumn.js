Roadmap.prototype._buildColumn = function(columnData) {
    const column = $('<div>', {
        class: this._data.classnamePrefix + 'column'
    });
    const header = $('<div>', {
        class: this._data.classnamePrefix + 'node ' + this._data.classnamePrefix + 'header'
    });
    const headerProgressBar = $('<div>', {
        class: this._data.classnamePrefix + 'progress'
    });
    const headerProgressBarInner = $('<div>', {
        class: this._data.classnamePrefix + 'progressBar'
    });
    const headerProgressBarContent = $('<div>', {
        class: this._data.classnamePrefix + 'progressContent'
    });

    if (columnData.empty) {
        column.addClass(this._data.classnamePrefix + 'empty');
    } else {
        if (columnData.color) {
            headerProgressBarInner.css('background-color', columnData.color)
        }

        headerProgressBarInner.width(columnData.progressComplete + '%');
        headerProgressBarContent.text(columnData.progressComplete + '% Complete');
        headerProgressBar.append(headerProgressBarInner);
        headerProgressBar.append(headerProgressBarContent);
        header.text(columnData.name);
    }

    header.append(headerProgressBar);
    column.append(header);

    return column;
}