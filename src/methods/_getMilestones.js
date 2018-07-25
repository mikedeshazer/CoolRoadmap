Roadmap.prototype._getMilestones = function(columnIdx) {
    let toReturn = [];
    const length = this._data.milestones.length;

    for (let x = 0; x < length; x++) {
        const milestone = this._data.milestones[x];

        if (milestone.belongsToColumnIdx === columnIdx) {
            toReturn.push(milestone);
        }
    }

    return toReturn;
}