Roadmap.prototype._onScroll = function() {
    $(window).scroll(() => {
        this._data.scrollPos = $(document).scrollTop();
    });
}