Roadmap.prototype._getMilestone = function(columnIdx, milestoneRank) {
    let toReturn = null;
    const length = this._data.milestones.length;

    for (let x = 0; x < length; x++) {
        const milestone = this._data.milestones[x];
        if (milestone.rank === milestoneRank && milestone.belongsToColumnIdx === columnIdx) {
            toReturn = milestone;
            break;
        }
    }

    return toReturn;
}