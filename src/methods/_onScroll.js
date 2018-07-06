Roadmap.prototype._onScroll = function() {
    $(window).scroll(() => {
        this._data.scrollPos = $(document).scrollTop();
    });

    $('#' + this._data.wrapperDivId).scroll(() => {
        this._data.wrapperScrollPos = $('#' + this._data.wrapperDivId).scrollTop();
    });
}