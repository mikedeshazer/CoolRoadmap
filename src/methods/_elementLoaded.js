Roadmap.prototype._elementLoaded = function(el, cb, attempts) {
    if (!attempts) {
        attempts = 0;
    }

    if ($(el).length) {
        // Element is now loaded.
        cb($(el));
    } else {
        if (attempts <= 1000) {
            setTimeout(() => {
                this._elementLoaded(el, cb, attempts+1)
            }, 1);
        }
    }
}