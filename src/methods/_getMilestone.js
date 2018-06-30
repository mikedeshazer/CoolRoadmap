Roadmap.prototype._getMilestone = function(columnIdx, milestoneRank) {
    let toReturn = null;

    this._data.milestones.forEach((milestone) => {
        if (milestone.rank === milestoneRank && milestone.belongsToColumnIdx === columnIdx) {
            toReturn = milestone;
        }
    });

    return toReturn;
}