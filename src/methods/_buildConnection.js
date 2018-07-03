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
    let startColor = '#2e3148';
    let endColor = '#2e3148';

    if (milestoneData.status === "complete") {
        startColor = this._data.columns[milestoneData.belongsToColumnIdx].color;
        endColor = this._data.columns[connectingMilestone.belongsToColumnIdx].color;
    }
    
    this._elementLoaded('#' + this._data.classnamePrefix + 'milestone-' + milestoneData.id, (milestoneElem) => {
        let connectionPointStart;
        let connectionPointEnd;
        let addArrow = false;
        let paddingAndArrow = 0;

        if (heightDiffIdx === 0 && widthDiffIdx === -1) {
            // to the immediate left
            connectionPointStart = this._data.connectionPointPositions[7];
            connectionPointEnd = this._data.connectionPointPositions[3];
        } else if (heightDiffIdx === 0 && widthDiffIdx === 1) {
            // to the immediate right
            connectionPointStart = this._data.connectionPointPositions[3];
            connectionPointEnd = this._data.connectionPointPositions[7];
        } else if (widthDiffIdx === 0) {
            // in same column
            connectionPointStart = this._data.connectionPointPositions[1];
            connectionPointEnd = this._data.connectionPointPositions[5];
            paddingAndArrow = 12;
            connection.removeClass(this._data.classnamePrefix + 'noEnd');
        } else if (widthDiffIdx <= -1) {
            // to the left
            connectionPointStart = this._data.connectionPointPositions[0];
            connectionPointEnd = this._data.connectionPointPositions[6];
        } else if (widthDiffIdx >= 1) {
            // to the right
            connectionPointStart = this._data.connectionPointPositions[2];
            connectionPointEnd = this._data.connectionPointPositions[4];
        } else {
            return;
        }

        const bounding = $('#' + this._data.classnamePrefix + 'milestone-' + connectingMilestone.id)[0].getBoundingClientRect();
        const endWidth = bounding.left + connectionPointEnd[1];
        const endHeight = bounding.top + connectionPointEnd[0];

        const boundingTo = milestoneElem[0].getBoundingClientRect();
        const startWidth = boundingTo.left + connectionPointStart[1];
        const startHeight = boundingTo.top + connectionPointStart[0];

        const widthDiff =  endWidth - startWidth;
        const heightDiff = endHeight - startHeight + paddingAndArrow;

        const transformDegrees = Math.atan2(heightDiff, widthDiff) * 180 / Math.PI;
        const distance = Math.hypot(heightDiff, widthDiff);

        connection.css('top',  connectionPointStart[0] + 'px');
        connection.css('left', connectionPointStart[1] + 'px');
        connection.css('transform', 'rotate(' + transformDegrees + 'deg)');
        connection.css('width', distance + 'px');
    });

    connection.addClass(this._data.classnamePrefix + 'noEnd');
    connection.css('background-image', 'linear-gradient(to right, ' + startColor + ', ' + endColor + ')');

    connection.dblclick(() => {
        connection.remove();
        milestoneData.connections.forEach((conenction, idx) => {
            if (conenction === connectionData) {
                this._userData.milestones[milestoneData.userDataIdx].connections.splice(idx, 1);
            }
        });
        this.milestones(this._userData.milestones);
    })

    this._pseudoStyle(connection, 'before', 'border-color', endColor);

    return connection;
}