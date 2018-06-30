Roadmap.prototype._getNextBelowMilestone = function(columnIdx, milestoneRank) {
    let toReturn = null;

    this._data.milestones.forEach((milestone) => {
        if (milestone.rank < milestoneRank && 
            toReturn === null &&
            !milestone.spacer && 
            milestone.belongsToColumnIdx === columnIdx
        ) {
            toReturn = milestone;
        }
    });

    return toReturn;
}