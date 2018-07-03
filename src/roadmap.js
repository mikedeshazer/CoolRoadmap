function Roadmap(wrapperDivId) {
    Object.keys(this.__proto__).forEach((methodName) => {
        this[methodName] = this.__proto__[methodName];
    });

    if (!$) {
        throw new Error('Roadmap library requires jQuery');
    }

    if (!wrapperDivId) {
        throw new Error('You must call Roadmap with a wrapperDivId');
    }

    this._data = {
        nodeSizes: {
            width: -1
        },
        isEditMode: true,
        classnamePrefix: 'coolRoadmap-',
        wrapperDivId: wrapperDivId,
        columns: [],
        milestones: [],
        styles: [],
        defaultMilestoneDifficulty: 10,
        overallProgress: 0,
        mouse: {},
        connectionPointPositions: []
    };

    this._userData = {
        columnNames: [],
        milestones: [],
        styles: [],
        completeMilestones: [],
    }

    $(() => {
        var blob = localStorage.getItem('roadmap');

        this._mouseMove();
        this._onResize();
        
        if (blob) {
            this._userData = JSON.parse(blob);
            
            this.columns(this._userData.columnNames);
            this.milestones(this._userData.milestones);
            this.style(this._userData.styles);
            this.markComplete(this._userData.completeMilestones);
        }

        this._build();
    });
}

