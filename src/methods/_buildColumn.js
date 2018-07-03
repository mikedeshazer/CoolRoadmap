Roadmap.prototype._buildColumn = function(columnData) {
    const column = $('<div>', {
        class: this._data.classnamePrefix + 'column'
    });
    const header = $('<div>', {
        class: this._data.classnamePrefix + 'node ' + this._data.classnamePrefix + 'header'
    });
    const headerText = $('<div>');
    const headerProgressBar = $('<div>', {
        class: this._data.classnamePrefix + 'progress'
    });
    const headerProgressBarInner = $('<div>', {
        class: this._data.classnamePrefix + 'progressBar'
    });
    const headerProgressBarContent = $('<div>', {
        class: this._data.classnamePrefix + 'progressContent'
    });
    const removeIcon = $('<div>', {
        class: this._data.classnamePrefix + 'remove'
    });
    
    if (this._data.isEditMode) {

        removeIcon.text('X');

        removeIcon.click(() => {
            this._userData.milestones.forEach((milestone, idx) => {
                if (milestone.belongsToColumn >= columnData.columnIdx + 1) {
                    this._userData.milestones[idx].belongsToColumn--;
                }
            });

            this._userData.columnNames.splice(columnData.columnIdx, 1);
            this.milestones(this._userData.milestones);
        })
    }

    if (columnData.empty) {
        column.addClass(this._data.classnamePrefix + 'empty');
        headerText.html('&plus; New Column');

        header.click((e) => {
            this._userData.columnNames.push('New Column');
            this.milestones(this._userData.milestones);
        });

        header.append(headerText);
    } else {
        if (columnData.color) {
            headerProgressBarInner.css('background-color', columnData.color)
        }

        headerProgressBarInner.width(columnData.progressComplete + '%');
        headerProgressBarContent.text(columnData.progressComplete + '% Complete');
        headerProgressBar.append(headerProgressBarInner);
        headerProgressBar.append(headerProgressBarContent);
        headerText.text(columnData.name);

        headerText.dblclick((e) => {
            var elem = $(e.target);
            var isEditable = elem.is('.editable');
            elem.prop('contenteditable', !isEditable).toggleClass('editable');
            elem.focus();
            document.execCommand('selectAll', false, null);

            elem.keypress(function(e) {
                if(e.which == 13) {
                    e.preventDefault();
                    elem.blur();
                }
            });

            elem.one('blur', (e) => {
                var elem = $(e.target);
                var isEditable = elem.is('.editable');
                elem.prop('contenteditable', !isEditable).toggleClass('editable');

                this._userData.columnNames[columnData.columnIdx] = elem.text();
                this.milestones(this._userData.milestones);
            })
        })

        header.append(headerText);
        header.append(headerProgressBar);
        
        if (this._data.isEditMode) {
            header.append(removeIcon);
        }
    }

    column.append(header);

    return column;
}