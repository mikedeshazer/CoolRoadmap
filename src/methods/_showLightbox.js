Roadmap.prototype._showLightbox = function(milestoneData, columnIdx, isColumn) {
    var lightboxElement = $('<div>', {
        class: this._data.classnamePrefix + 'lightbox'
    });
    var modalElement = $('<div>', {
        class: this._data.classnamePrefix + 'modal'
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
            modalElement.html(modalElement.html() + 'To Be Announced');
        } else {
            modalElement.html(modalElement.html() + milestoneData.descriptionHTML);
        }
    } else {
        modalElement.html(modalElement.html() + 'Final version of ' + milestoneData.name + ' before we launch. Features are frozen');
    }

    statusElement.addClass(this._data.classnamePrefix + 'inProgress');
    statusElement.text('In Progress');
    
    if (!isColumn && milestoneData.status === 'complete') {
        statusElement.addClass(this._data.classnamePrefix + 'complete');

        if (milestoneData.released) {
            statusElement.text('Released ' + milestoneData.released);
        } else {
            statusElement.text('');
        }
    } else if (isColumn && milestoneData.progressComplete === '100') {
        statusElement.addClass(this._data.classnamePrefix + 'complete');
        statusElement.text('Released');
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
    lightboxElement.click(() => {
        $('.' + this._data.classnamePrefix + 'lightbox').remove();
    });
    $('body').append(lightboxElement);
}