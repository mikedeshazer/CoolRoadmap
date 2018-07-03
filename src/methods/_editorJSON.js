Roadmap.prototype._editorJSON = function() {
    if ($('#' + this._data.classnamePrefix + 'editorJSON').length === 0) {
        const editorJSON = $('<div>', {
            class: this._data.classnamePrefix + 'editorJSON',
            id: this._data.classnamePrefix + 'editorJSON'
        });
        const editorJSONpre = $('<pre>');
        const editorJSONToggle = $('<div>', {
            class: this._data.classnamePrefix + 'toggle'
        });

        editorJSONToggle.text('View/Edit JSON')
        editorJSONToggle.click(() => {
            editorJSON.toggleClass(this._data.classnamePrefix + 'fullScreen')
        })

        editorJSON.dblclick((e) => { 
            var elem = $(e.target);
            var isEditable = elem.is('.editable');
            elem.prop('contenteditable', !isEditable).toggleClass('editable');
            elem.focus();

            elem.one('blur', (e) => {
                var elem = $(e.target);
                var isEditable = elem.is('.editable');
                elem.prop('contenteditable', !isEditable).toggleClass('editable');

                this._userData = JSON.parse(elem.text().replace(/<br>/g, '\n'));

                this.milestones(this._userData.milestones);
            })
        });

        editorJSON.append(editorJSONToggle);
        editorJSON.append(editorJSONpre);
        $('body').append(editorJSON);
    }
    
    $('#' + this._data.classnamePrefix + 'editorJSON pre').html(JSON.stringify(this._userData, null, 4).replace(/\n/g, '<br>'));
}