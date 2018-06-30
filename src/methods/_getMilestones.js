Roadmap.prototype._getMilestones = function(columnIdx) {
    let toReturn = [];

    this._data.milestones.forEach((milestone) => {
        if (milestone.belongsToColumnIdx === columnIdx) {
            toReturn.push(milestone);
        }
    });

    return toReturn;
}