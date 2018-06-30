Roadmap.prototype.columns = function(columnNames) {
    if (!columnNames) {
        throw new Error('You must call Roadmap.columns with a columnNames');
    }

    let grandTotalProgressComplete = 0;

    this._data.columns = [];
    this._userData.columnNames = columnNames;
    columnNames.forEach((columnName, idx) => {
        const columnMilestones = this._getMilestones(idx);
        let totalComplete = 0;
        let totalDifficulty = 0;

        columnMilestones.forEach((milestoneData) => {
            if (!milestoneData.spacer) {
                totalDifficulty += milestoneData.difficulty;
            }

            if (milestoneData.status === "complete" && !milestoneData.spacer) {
                totalComplete += milestoneData.difficulty;
            }
        })

        let progressComplete = ((totalComplete / totalDifficulty) * 100).toFixed(0);

        if (isNaN(progressComplete)) {
            progressComplete = 100;
        }

        grandTotalProgressComplete += parseInt(progressComplete);
        this._data.columns.push({
            name: columnName,
            progressComplete: progressComplete,
            color: this._data.styles[idx],
        })
    });
    
    this._data.overallProgress = (grandTotalProgressComplete / columnNames.length).toFixed(0);

    this._build();
}