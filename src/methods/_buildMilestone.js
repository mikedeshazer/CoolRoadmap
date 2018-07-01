Roadmap.prototype._buildMilestone = function(milestoneData) {
    const milestone = $('<div>', {
        class: this._data.classnamePrefix + 'node ' + this._data.classnamePrefix + 'milestone'
    });

    milestone.attr('id', this._data.classnamePrefix + 'milestone-' + Math.floor(Math.random() * (999999999 + 1)));

    if (milestoneData.spacer || milestoneData.dropTarget) {
        if (milestoneData.spacer) {
            milestone.addClass(this._data.classnamePrefix + 'spacer');
        } else {
            milestone.addClass(this._data.classnamePrefix + 'dropTarget');
        }

        if (this._data.isEditMode) {
            milestone.addClass(this._data.classnamePrefix + 'droppable');
            milestone.droppable({
                classes: {
                "ui-droppable-active": this._data.classnamePrefix + 'active',
                "ui-droppable-hover": this._data.classnamePrefix + 'hover'
                },
                drop: (event, ui) => {
                    let draggedId = event.originalEvent.target.id;

                    if (!draggedId) {
                        draggedId = event.originalEvent.target.parentElement.id;
                    }

                    const targetElem = $('#' + event.target.id);
                    const sourceElem = $('#' + draggedId);

                    const targetMilestoneData = targetElem.data('milestoneData');
                    const sourceMilestoneData = sourceElem.data('milestoneData');

                    if (!targetMilestoneData.spacer) {
                        const columnMilestones = this._getMilestones(targetMilestoneData.belongsToColumnIdx);
                        let keepSwapping = true;

                        columnMilestones.forEach((milestoneDataInner, idx) => {
                            if (milestoneDataInner.rank <= targetMilestoneData.rank && keepSwapping) {
                                if (milestoneDataInner.spacer || milestoneDataInner.rank === sourceMilestoneData.rank) {
                                    keepSwapping = false;
                                } else {
                                    this._userData.milestones[milestoneDataInner.userDataIdx].rank -= 1;
                                }
                            }
                        })
                    }

                    this._userData.milestones.splice(sourceMilestoneData.userDataIdx, 1);
                        
                    delete sourceMilestoneData.userDataIdx;
                    delete sourceMilestoneData.belongsToColumnIdx;
                    
                    sourceMilestoneData.belongsToColumn = targetMilestoneData.belongsToColumn;
                    sourceMilestoneData.rank = targetMilestoneData.rank;
                    sourceMilestoneData.connections = [];

                    this._userData.milestones.push(sourceMilestoneData);

                    this.milestones(this._userData.milestones);
                }
            });
        }
    } else {
        if (this._data.isEditMode) {
            milestone.draggable({
                revert: 'invalid',
                start: () => {
                    $('.' + this._data.classnamePrefix + 'container').addClass(this._data.classnamePrefix + 'isDragging');
                },
                stop: () => {
                    $('.' + this._data.classnamePrefix + 'container').removeClass(this._data.classnamePrefix + 'isDragging');
                }
            });
        } else {
            milestone.click(() => {
                console.log('d');
                this._showLightbox(milestoneData, -1, false);
            })
        }

        const title = $('<div>', {
            class: this._data.classnamePrefix + 'title'
        });
        const version = $('<div>');

        title.text(milestoneData.title);
        version.text(milestoneData.version);

        milestone.append(title);
        milestone.append(version);
        milestone.css('z-index', milestoneData.rank);

        if (milestoneData.status === 'complete') {
            if (this._data.columns[milestoneData.belongsToColumnIdx].color) {
                this._pseudoStyle(milestone, 'after', 'background-color', this._data.columns[milestoneData.belongsToColumnIdx].color)
                milestone.css('border-color', this._data.columns[milestoneData.belongsToColumnIdx].color);
            }

            milestone.addClass(this._data.classnamePrefix + 'complete')
        }

        const nextAbove = this._getNextAboveMilestone(milestoneData.belongsToColumnIdx, milestoneData.rank);
        let hasNextAboveConnection = false;
        
        milestoneData.connections.forEach(connection => {
            if (nextAbove && connection[0] === nextAbove.belongsToColumn && connection[1] === nextAbove.rank) {
                hasNextAboveConnection = true;
            }
        })

        if (!hasNextAboveConnection && nextAbove) {
            milestoneData.connections.push([nextAbove.belongsToColumn, nextAbove.rank]);
        }

        const connectionPointPositions = [
            //top
            [-10, this._data.nodeSizes.width / 6, 0],
            [-10, (this._data.nodeSizes.width / 6) * 3, 0],
            [-10, (this._data.nodeSizes.width / 6) * 5, 0],
            //right
            [(this._data.nodeSizes.height / 2) - 5, this._data.nodeSizes.width, 90],
            //bottom
            [this._data.nodeSizes.height - 3, this._data.nodeSizes.width / 6, 180],
            [this._data.nodeSizes.height - 3, (this._data.nodeSizes.width / 6) * 3, 180],
            [this._data.nodeSizes.height - 3, (this._data.nodeSizes.width / 6) * 5, 180],
            //left
            [(this._data.nodeSizes.height / 2) - 5, -9, 270],
        ];

        if (milestoneData.rank === this._data.highestRank) {
            connectionPointPositions[0] = null;
            connectionPointPositions[1] = null;
            connectionPointPositions[2] = null;
        }
        if (milestoneData.belongToColumn === this._data.columns.length) {
            connectionPointPositions[3] = null;
        }
        // if (milestoneData.rank === 0) {
            connectionPointPositions[4] = null;
            connectionPointPositions[5] = null;
            connectionPointPositions[6] = null;
        // }
        if (milestoneData.belongToColumnIdx === 0) {
            connectionPointPositions[7] = null;
        }

        milestone.data('connectionPointPositions', connectionPointPositions);

        if (this._data.isEditMode) {
            connectionPointPositions.forEach((connecitonPointPosition) => {
                if (connecitonPointPosition !== null) {
                    const connectionPoint = $('<div>', {
                        class: this._data.classnamePrefix + 'connectionPoint'
                    });
            
                    connectionPoint.css('top', connecitonPointPosition[0] + 'px');
                    connectionPoint.css('left', connecitonPointPosition[1] + 'px');
                    connectionPoint.css('transform', 'rotate(' + connecitonPointPosition[2] + 'deg)');
                    
                    if (milestoneData.status === 'complete' && this._data.columns[milestoneData.belongsToColumnIdx].color) {
                        connectionPoint.css('background-color', this._data.columns[milestoneData.belongsToColumnIdx].color);
                    }
            
                    milestone.append(connectionPoint);
                }
            });
        }
    }

    return milestone;
}