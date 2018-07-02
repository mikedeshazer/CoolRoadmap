Roadmap.prototype._mouseMove = function() {
    $('body').mousemove((event) => {
        this._data.mouse = {
            x: event.pageX,
            y: event.pageY
        }

        if (this._data.connecting) {
            var heightDiff = this._data.connecting.startPoint.y - this._data.mouse.y;
            var widthDiff = this._data.mouse.x - this._data.connecting.startPoint.x;

            transformDegrees = Math.atan2(heightDiff, widthDiff) * 180 / Math.PI;
            const distance = Math.hypot(heightDiff, widthDiff);
            const connection = $('#' + this._data.classnamePrefix + 'connectingArrow');
            
            connection.css('width', distance + 'px');
            connection.css('transform', 'rotate(' + transformDegrees * -1 + 'deg)');
        }
    });
}