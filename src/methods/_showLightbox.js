Roadmap.prototype._showLightbox = function(milestoneData, columnIdx, isColumn) {
    var lightboxElement = $('<div>', {
        class: this._data.classnamePrefix + 'lightbox'
    });
    var modalElement = $('<div>', {
        class: this._data.classnamePrefix + 'modal'
    });
    var modalElementInner = $('<div>', {
        class: this._data.classnamePrefix + 'modalInner'
    });
    var titleElement = $('<div>', {
        class: this._data.classnamePrefix + 'title'
    });
    var versionElement = $('<span>', {
        class: this._data.classnamePrefix + 'version'
    });
    var statusElement = $('<div>', {
        class: this._data.classnamePrefix + 'status'
    });
    var footerElement = $('<div>', {
        class: this._data.classnamePrefix + 'footer'
    });
    var isEditing = false;

    if (!isColumn) {
        titleElement.text(milestoneData.title);
    } else {
        titleElement.text(milestoneData.name);
    }

    if (!isColumn) {
        versionElement.text(milestoneData.version);
        titleElement.append(versionElement);
    }

    modalElement.append(titleElement);

    if (!isColumn) {
        if (milestoneData.status !== 'pending' && (!milestoneData.descriptionHTML || milestoneData.descriptionHTML === '')) {
            modalElementInner.text('To Be Announced');
        } else {
            modalElementInner.html(milestoneData.descriptionHTML);
        }
    } else {
        modalElementInner.text('Final version of ' + milestoneData.name + ' before we launch. Features are frozen');
    }

    if (this._data.isEditMode) {
        modalElementInner.dblclick((e) => {
            isEditing = true;
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

                this._userData.milestones[milestoneData.userDataIdx].descriptionHTML = elem.text();
                this.milestones(this._userData.milestones);
                setTimeout(() => {
                    isEditing = false;
                }, 500);
            })
        });
    }

    modalElement.append(modalElementInner);

    statusElement.addClass(this._data.classnamePrefix + 'inProgress');
    statusElement.text('In Progress');
    
    if (!isColumn && milestoneData.status === 'complete') {
        statusElement.addClass(this._data.classnamePrefix + 'complete');

        if (milestoneData.released) {
            statusElement.text('Released ' + milestoneData.released);
        } else {
            statusElement.text('N/A');
        }
    } else if (isColumn && milestoneData.progressComplete === '100') {
        statusElement.addClass(this._data.classnamePrefix + 'complete');
        statusElement.text('Released');
    }

    if (this._data.isEditMode) {
        statusElement.click((e) => {
            if (e.originalEvent.layerX < 43) {
                var elem = $(e.target);

                if (elem.hasClass(this._data.classnamePrefix + 'complete')) {
                    statusElement.removeClass(this._data.classnamePrefix + 'complete');
                    statusElement.addClass(this._data.classnamePrefix + 'inProgress');
                    
                    this._userData.milestones[milestoneData.userDataIdx].status = 'pending';
                    statusElement.text('In Progress');

                    if (this._userData.completeMilestones[milestoneData.belongsToColumnIdx]) {
                        const idx = this._userData.completeMilestones[milestoneData.belongsToColumnIdx].indexOf(milestoneData.rank);

                        if (idx > -1) {
                            this._userData.completeMilestones[milestoneData.belongsToColumnIdx].splice(idx, 1);
                        }
                    }
                } else {
                    statusElement.addClass(this._data.classnamePrefix + 'complete');
                    statusElement.removeClass(this._data.classnamePrefix + 'inProgress');

                    this._userData.milestones[milestoneData.userDataIdx].status = 'complete';
                    if (this._userData.milestones[milestoneData.userDataIdx].released) {
                        statusElement.text('Released ' + this._userData.milestones[milestoneData.userDataIdx].released);
                    } else {
                        statusElement.text('N/A');
                    }
                }

                this.milestones(this._userData.milestones);
            }
        });

        statusElement.dblclick((e) => { 
            var elem = $(e.target);

            if (e.originalEvent.layerX >= 43 && elem.hasClass(this._data.classnamePrefix + 'complete')) {
                isEditing = true;
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

                    this._userData.milestones[milestoneData.userDataIdx].released = elem.text().replace('Released ', '');
                    
                    if (this._userData.milestones[milestoneData.userDataIdx].released) {
                        statusElement.text('Released ' + this._userData.milestones[milestoneData.userDataIdx].released);
                    } else {
                        statusElement.text('N/A');
                    }

                    this.milestones(this._userData.milestones);
                    setTimeout(() => {
                        isEditing = false;
                    }, 500);
                })
            }
        });
    }

    footerElement.append(statusElement);

    if (milestoneData.moreInfoURL) {
        var detailsButton = $('<div>');
        detailsButton.addClass(this._data.classnamePrefix + 'detailsButton');

        detailsButton.text('Details');
        detailsButton.click(function() {
            window.open(milestoneData.moreInfoURL, '_blank');
        });

        footerElement.append(detailsButton);
    }

    modalElement.append(footerElement);
    lightboxElement.append(modalElement);
    lightboxElement.click((e) => {
        if (!this._data.isEditMode || (e.target.className.indexOf('status') === -1 &&  e.target.className.indexOf('modalInner') === -1 && !isEditing)) {
            $('.' + this._data.classnamePrefix + 'lightbox').remove();
        }
    });
    $('body').append(lightboxElement);
}