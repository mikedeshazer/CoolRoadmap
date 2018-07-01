Roadmap.prototype._getNextAboveMilestone = function(columnIdx, milestoneRank) {
    let toReturn = null;

    this._data.milestones.forEach((milestone) => {
        if (milestone.rank > milestoneRank && 
            milestone.rank <= this._data.highestRank && 
            !milestone.spacer && 
            milestone.belongsToColumnIdx === columnIdx
        ) {
            toReturn = milestone;
        }
    });

    return toReturn;
}