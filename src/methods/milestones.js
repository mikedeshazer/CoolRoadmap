Roadmap.prototype.milestones = function(milestones) {
    if (!milestones) {
        throw new Error('You must call Roadmap.milestones with a milestones');
    }

    this._data.milestones = [];
    this._userData.milestones = milestones;
    this._data.highestRank = 0;
    this._data.lowestRank = 0;

    const columnRanks = [];
    const length = milestones.length;

    this._userData.columnNames.forEach(() => {
        columnRanks.push([]);
    })

    for (let idx = 0; idx < length; idx++) {
        const milestone = milestones[idx];

        if (typeof milestone.rank !== 'number') {
            console.log(milestone);
            throw new Error('milestone rank must be an number');
        }
        if (typeof milestone.belongsToColumn !== 'number') {
            console.log(milestone);
            throw new Error('milestone belongsToColumn must be an number');
        }

        if (milestone.rank > this._data.highestRank) {
            this._data.highestRank = milestone.rank;
        }

        if (milestone.rank < this._data.lowestRank) {
            this._data.lowestRank = milestone.rank;
        }

        if (!milestone.connections) {
            milestone.connections = [];
        }

        if (!milestone.difficulty) {
            milestone.difficulty = this._data.defaultMilestoneDifficulty;
        }

        milestone.userDataIdx = idx;
        milestone.belongsToColumnIdx = milestone.belongsToColumn - 1;
        this._data.milestones.push(milestone);

        if (!columnRanks[milestone.belongsToColumnIdx]) {
            columnRanks[milestone.belongsToColumnIdx] = [];
        }

        columnRanks[milestone.belongsToColumnIdx].push(milestone.rank);
    };

    if (this._data.isEditMode && milestones.length > 0) {
        this._data.highestRank += 1;
    }

    const columnRanksLength = columnRanks.length;
    for (let idx = 0; idx < columnRanksLength; idx++) {
        const columnRankData = columnRanks[idx];
        
        let count = this._data.lowestRank;
        while (count <= this._data.highestRank) {
            if (columnRankData.indexOf(count) === -1) {
                this._data.milestones.push({
                    spacer: true,
                    belongsToColumn: idx + 1,
                    belongsToColumnIdx: idx,
                    rank: count
                });
            }

            count ++;
        }

        if (this._data.lowestRank != this._data.highestRank) {
            this._data.milestones.push({
                spacer: true,
                belongsToColumn: idx + 1,
                belongsToColumnIdx: idx,
                rank: this._data.lowestRank - 1
            });
        }
    };

    this._data.milestones.sort((a, b) => {
        if (a.rank > b.rank) return -1;
        if (a.rank < b.rank) return 1;

        return 0;
    });

    this.markComplete(this._userData.completeMilestones);
    this.columns(this._userData.columnNames);
    this._build();
}