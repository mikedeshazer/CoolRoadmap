Roadmap.prototype._buildMilestone = function(milestoneData) {
    const milestone = $('<div>', {
        class: this._data.classnamePrefix + 'node ' + this._data.classnamePrefix + 'milestone'
    });

    const id = Math.floor(Math.random() * (999999999 + 1));
    milestone.attr('id', this._data.classnamePrefix + 'milestone-' + id);
    milestoneData.id = id;

    if (milestoneData.spacer || milestoneData.dropTarget) {
        if (milestoneData.spacer) {
            milestone.addClass(this._data.classnamePrefix + 'spacer');

            if (this._data.isEditMode) {
                const title = $('<div>', {
                    class: this._data.classnamePrefix + 'title'
                });
                const version = $('<div>');
        
                title.html("&plus;");
                version.text("Add Milestone");

                milestone.append(title);
                milestone.append(version);

                milestone.click((e) => {
                    this._userData.milestones.push({
                        belongsToColumn: milestoneData.belongsToColumn,
                        rank: milestoneData.rank,
                        title: 'New Milestone'
                    })

                    this.milestones(this._userData.milestones);
                })
            }
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
                    let draggedId = $(ui.draggable).attr('id');

                    const targetElem = $('#' + event.target.id);
                    const sourceElem = $('#' + draggedId);

                    const targetMilestoneData = targetElem.data('milestoneData');
                    const sourceMilestoneData = sourceElem.data('milestoneData');

                    console.log(targetMilestoneData, sourceMilestoneData);

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

                    console.log(sourceMilestoneData);

                    this._userData.milestones.push(sourceMilestoneData);

                    this.milestones(this._userData.milestones);
                }
            });
        }
    } else {
        if (this._data.isEditMode) {
            const removeIcon = $('<div>', {
                class: this._data.classnamePrefix + 'remove'
            });
            removeIcon.css('background-color', this._data.columns[milestoneData.belongsToColumnIdx].color);
        
            removeIcon.text('X');

            removeIcon.click(() => {
                if (milestoneData.rank === 0) {
                    const columnMilestones = this._getMilestones(milestoneData.belongsToColumnIdx);
                    let shouldSubtract = false;

                    columnMilestones.reverse().forEach((milestone) => {
                        console.log(milestone);
                        if (milestone.spacer) {
                            return;
                        } else if (milestone.userDataIdx === milestoneData.userDataIdx) {
                            shouldSubtract = true;
                        } else if (shouldSubtract) {
                            this._userData.milestones[milestone.userDataIdx].rank--;
                        }
                    });
                }

                this._userData.milestones.splice(milestoneData.userDataIdx, 1);
                this.milestones(this._userData.milestones);
            })

            milestone.append(removeIcon);
            milestone.draggable({
                revert: 'invalid',
                start: () => {
                    $('.' + this._data.classnamePrefix + 'container').addClass(this._data.classnamePrefix + 'isDragging');
                },
                stop: () => {
                    $('.' + this._data.classnamePrefix + 'container').removeClass(this._data.classnamePrefix + 'isDragging');
                }
            });

            const lightboxActivateOverlay = $('<div>', {
                class: this._data.classnamePrefix + 'lightboxActivateOverlay'
            })
            lightboxActivateOverlay.click(() => {
                this._showLightbox(milestoneData, -1, false);
            })
            milestone.append(lightboxActivateOverlay);
        } else {
            milestone.click(() => {
                this._showLightbox(milestoneData, -1, false);
            })
        }

        const title = $('<div>', {
            class: this._data.classnamePrefix + 'title'
        });
        const version = $('<div>');

        title.text(milestoneData.title);
        version.text(milestoneData.version);
        
        if (this._data.isEditMode) {
            title.dblclick((e) => {
                var elem = $(e.target);
                var isEditable = elem.is('.editable');
                elem.prop('contenteditable', !isEditable).toggleClass('editable');
                elem.focus();
                document.execCommand('selectAll', false, null);

                elem.keypress(function(e) {
                    if(e.which == 13) {
                        e.preventDefault();
                        elem.blur();
                    }
                });

                elem.one('blur', (e) => {
                    var elem = $(e.target);
                    var isEditable = elem.is('.editable');
                    elem.prop('contenteditable', !isEditable).toggleClass('editable');

                    var parent = $('#' + e.target.parentElement.id);
                    var milestoneData = parent.data('milestoneData');
                    this._userData.milestones[milestoneData.userDataIdx].title = elem.text();

                    this.milestones(this._userData.milestones);
                })
            })
        }

        milestone.append(title);
        milestone.append(version);
        milestone.css('z-index', milestoneData.rank);

        if (milestoneData.status === 'complete') {
            if (this._data.columns[milestoneData.belongsToColumnIdx].color) {
                this._pseudoStyle(milestone, 'after', 'background-color', this._data.columns[milestoneData.belongsToColumnIdx].color + ' !important')
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
        
        this._data.connectionPointPositions = [
            //top
            [-10, this._data.nodeSizes.width / 4, 0],
            [-10, (this._data.nodeSizes.width / 4) * 2, 0],
            [-10, (this._data.nodeSizes.width / 4) * 3, 0],
            //right
            [(this._data.nodeSizes.height / 2) - 5, this._data.nodeSizes.width - 1, 90],
            //bottom
            [this._data.nodeSizes.height - 3, this._data.nodeSizes.width / 4, 0],
            [this._data.nodeSizes.height - 3, (this._data.nodeSizes.width / 4) * 2, 0],
            [this._data.nodeSizes.height - 3, (this._data.nodeSizes.width / 4) * 3, 0],
            //left
            [(this._data.nodeSizes.height / 2) - 5, -9, 270],
        ];

        const connectionPointPositions = this._data.connectionPointPositions.slice(0);
        if (milestoneData.rank === this._data.highestRank) {
            connectionPointPositions[0] = null;
            connectionPointPositions[1] = null;
            connectionPointPositions[2] = null;
        }
        if (milestoneData.belongToColumn === this._data.columns.length) {
            connectionPointPositions[3] = null;
        }
        if (milestoneData.rank === 0) {
            connectionPointPositions[4] = null;
            connectionPointPositions[5] = null;
            connectionPointPositions[6] = null;
        }
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

                    connectionPoint.click(() => {
                        if (!this._data.connecting) {
                            this._data.connecting = {
                                milestoneData: milestoneData,
                                startPoint: Object.assign({}, this._data.mouse)
                            }

                            const connection = $('<div>', {
                                class: this._data.classnamePrefix + 'arrow'
                            });

                            connection.css('left', this._data.mouse.x);
                            connection.css('top', this._data.mouse.y);
                            connection.addClass(this._data.classnamePrefix + 'noEnd');
                            connection.attr('id', this._data.classnamePrefix + 'connectingArrow');

                            $('body').append(connection);
                        } else {
                            $('#' + this._data.classnamePrefix + 'connectingArrow').remove();

                            if (milestoneData.rank >= this._data.connecting.milestoneData.rank) {
                                this._userData.milestones[this._data.connecting.milestoneData.userDataIdx].connections.push(
                                    [milestoneData.belongsToColumn, milestoneData.rank]
                                );
                            } else {
                                this._userData.milestones[milestoneData.userDataIdx].connections.push(
                                    [this._data.connecting.milestoneData.belongsToColumn, this._data.connecting.milestoneData.rank]
                                );
                            }

                            this._data.connecting = false;
                            this.milestones(this._userData.milestones);
                        }
                    })

                    milestone.append(connectionPoint);
                }
            });
        }
    }

    milestone.data('milestoneData', milestoneData);
    return milestone;
}