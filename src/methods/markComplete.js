Roadmap.prototype.markComplete = function(completeMilestones) {
    if (!completeMilestones) {
        throw new Error('You must call Roadmap.markComplete with a completeMilestones');
    }

    this._data.completeMilestones = completeMilestones;
    this._userData.completeMilestones = completeMilestones;

    this._data.milestones.forEach((milestoneData, idx) => {
        if (this._userData.completeMilestones[milestoneData.belongsToColumnIdx] && this._userData.completeMilestones[milestoneData.belongsToColumnIdx].indexOf(milestoneData.rank)) {
            this._data.milestones[idx].status = "complete";
        }
    });

    this._build();
}