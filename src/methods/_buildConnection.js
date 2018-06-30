Roadmap.prototype._buildConnection = function(milestoneData, connectionData, milestoneElem) {
    const connectingMilestone = this._getMilestone(connectionData[0] - 1, connectionData[1]);
    
    if (!connectingMilestone || connectingMilestone.spacer) {
        return;
    }

    const connection = $('<div>', {
        class: this._data.classnamePrefix + 'arrow'
    });
    let heightDiffIdx = milestoneData.rank - connectingMilestone.rank;
    let widthDiffIdx = connectingMilestone.belongsToColumn - milestoneData.belongsToColumn;

    let heightDiff = heightDiffIdx * (this._data.nodeSizes.height + this._data.nodeSizes.spacing.bottom);
    let widthDiff = widthDiffIdx * (this._data.nodeSizes.width + this._data.nodeSizes.spacing.right);
    let isNoEnd = true;
    let startColor = '#2e3148';
    let endColor = '#2e3148';
    const paddingAndArrow = 12;
    let connectionPointPositions = milestoneElem.data('connectionPointPositions');
    let transformDegrees = Math.atan2(heightDiff, widthDiff) * 180 / Math.PI;

    if (milestoneData.status === "complete") {
        startColor = this._data.columns[milestoneData.belongsToColumnIdx].color;
        endColor = this._data.columns[connectingMilestone.belongsToColumnIdx].color;
    }

    connection.css('transform', 'rotate(' + transformDegrees + 'deg)');
    
    if (transformDegrees < -30 && transformDegrees > -89) {
        const hostPoint = connectionPointPositions[2];
        const connectingPoint = connectionPointPositions[6];

        connection.css('left', hostPoint[1] + 'px');

        heightDiff += this._data.nodeSizes.height;
        widthDiff -= ((this._data.nodeSizes.width / 6) * 4);
    } else if (transformDegrees < -91 && transformDegrees > -150) {
        const hostPoint = connectionPointPositions[0];
        const connectingPoint = connectionPointPositions[4];

        connection.css('left', hostPoint[1] + 'px');

        heightDiff += this._data.nodeSizes.height;
        widthDiff += ((this._data.nodeSizes.width / 6) * 4);
    } else if (transformDegrees === -90) {
        const hostPoint = connectionPointPositions[1];
        const connectingPoint = connectionPointPositions[5];

        connection.css('left', hostPoint[1] + 'px');

        heightDiff += this._data.nodeSizes.height + paddingAndArrow;
        widthDiff = 0; 
        isNoEnd = false;
    } else if (transformDegrees < -149 || transformDegrees > 149) {
        const hostPoint = connectionPointPositions[7];
        const connectingPoint = connectionPointPositions[4];

        connection.css('left', hostPoint[1] + 'px');
        connection.css('top', (hostPoint[0] + 3) + 'px');

        heightDiff += this._data.nodeSizes.height - (hostPoint[0] + 6);
        widthDiff += (hostPoint[1] * -1) + (this._data.nodeSizes.width / 6) * 5;
    } else {
        const hostPoint = connectionPointPositions[3];
        const connectingPoint = connectionPointPositions[7];

        connection.css('left', hostPoint[1] + 'px');
        connection.css('top', (hostPoint[0] + 3) + 'px');

        heightDiff += this._data.nodeSizes.height - ((hostPoint[0] + 6) * 2);
        widthDiff -= this._data.nodeSizes.width + 10;
    }
    
    transformDegrees = Math.atan2(heightDiff, widthDiff) * 180 / Math.PI;
    const distance = Math.hypot(heightDiff, widthDiff);

    if (isNoEnd) {
        connection.addClass(this._data.classnamePrefix + 'noEnd');
    }

    connection.css('transform', 'rotate(' + transformDegrees + 'deg)');
    connection.css('width', distance + 'px');
    connection.css('background-image', 'linear-gradient(to right, ' + startColor + ', ' + endColor + ')');
    this._pseudoStyle(connection, 'before', 'border-color', endColor);

    return connection;
}