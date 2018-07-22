Roadmap.prototype.markComplete = function(completeMilestones) {
    if (!completeMilestones) {
        throw new Error('You must call Roadmap.markComplete with a completeMilestones');
    }

    this._data.completeMilestones = completeMilestones;
    this._userData.completeMilestones = completeMilestones;
    
    const length = this._data.milestones.length;

    for (let idx = 0; idx < length; idx++) {
        const milestoneData = this._data.milestones[idx];

        if (this._userData.completeMilestones[milestoneData.belongsToColumnIdx] && this._userData.completeMilestones[milestoneData.belongsToColumnIdx].indexOf(milestoneData.rank) > -1) {
            this._data.milestones[idx].status = "complete";
        }
    };

    this._build();
}