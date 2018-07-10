Roadmap.prototype._build = function() {
    const wrapper = $('#' + this._data.wrapperDivId);
    const container = $('<div>', {
        class: this._data.classnamePrefix + 'container'
    });
    const innerWrapper = $('<div>', {
        class: this._data.classnamePrefix + 'wrapper'
    });

    if (this._data.columns.length <= 5) {
        container.addClass(this._data.classnamePrefix + 'center');
    }

    wrapper.empty();
    this._data.nodeSizes.width = -1;
    this._data.columns.forEach((columnData, idx) => {
        let column = this._buildColumn(columnData);

        if (this._data.nodeSizes.width === -1) {
            const milestone = this._buildMilestone({
                rank: 0,
                belongsToColumn: 1,
                belongsToColumnIdx: 0,
                title: 'Spacer Test',
                connections: [],
            });
            const milestone2 = this._buildMilestone({
                rank: 0,
                belongsToColumn: 1,
                belongsToColumnIdx: 0,
                title: 'Spacer Test',
                connections: [],
            });

            column.append(milestone);
            column.append(milestone2);
            this._data.columns.forEach((columnData) => {
                innerWrapper.append(column.clone());
            });
            if (this._data.isEditMode) {   
                innerWrapper.append(column.clone());
            }
            container.append(innerWrapper);
            wrapper.append(container);

            this._data.nodeSizes.width = $($('.' + this._data.classnamePrefix + 'milestone')[0]).width() + (parseInt($($('.' + this._data.classnamePrefix + 'milestone')[0]).css('border-width').replace('px', '')) * 2);
            this._data.nodeSizes.height = $($('.' + this._data.classnamePrefix + 'milestone')[0]).height() + (parseInt($($('.' + this._data.classnamePrefix + 'milestone')[0]).css('border-width').replace('px', '')) * 2);
            this._data.nodeSizes.spacing = {
                bottom: parseInt($($('.' + this._data.classnamePrefix + 'milestone')[0]).css('margin-bottom').replace('px', '')),
                right: parseInt($($('.' + this._data.classnamePrefix + 'column')[0]).css('margin-right').replace('px', ''))
            }
            
            wrapper.empty();
            innerWrapper.empty();
            container.empty();
            column = this._buildColumn(columnData);
        }

        const columnMilestones = this._getMilestones(idx);
        const columnMilestoneVersions = this._getVersions(columnMilestones, '2 decimals', 1);

        columnMilestones.forEach((milestoneData, idx) => {
            if (this._data.isEditMode && !milestoneData.spacer && (idx === 0 || !columnMilestones[idx - 1].spacer)) {
                const milestoneDropTarget = this._buildMilestone({
                    dropTarget: true,
                    connections: []
                });
                milestoneDropTarget.data('milestoneData', {
                    dropTarget: true,
                    connections: [],
                    rank: milestoneData.rank,
                    belongsToColumn: milestoneData.belongsToColumn,
                    belongsToColumnIdx: milestoneData.belongsToColumnIdx
                });

                column.append(milestoneDropTarget);
            }

            milestoneData.version = columnMilestoneVersions[idx];
            const nextBelow = this._getNextBelowMilestone(milestoneData.belongsToColumnIdx, milestoneData.rank);

            if (nextBelow && nextBelow.status !== 'complete' && milestoneData.status === 'complete') {
                milestoneData.status = 'pending';
            }

            const milestone = this._buildMilestone(milestoneData);

            if (milestoneData.connections) {
                milestoneData.connections.forEach((connectionData) => {
                    const connection = this._buildConnection(milestoneData, connectionData, milestone);

                    milestone.append(connection);
                })
            }

            column.append(milestone);
        });

        innerWrapper.append(column);
    })

    if (this._data.isEditMode) {
        const column = this._buildColumn({
            empty: true
        });
        innerWrapper.append(column);
        
        container.addClass(this._data.classnamePrefix + 'editMode');
    }

    var overallProgress = $('<div>', {
        class: this._data.classnamePrefix + 'overallProgress'
    });
    var overallProgressInner = $('<div>', {
        class: this._data.classnamePrefix + 'progressBar'
    });
    var overallProgressContent = $('<div>', {
        class: this._data.classnamePrefix + 'progressContent'
    });

    overallProgressInner.css('width', this._data.overallProgress + '%');
    overallProgressContent.text((isNaN(this._data.overallProgress) ? 0 : this._data.overallProgress) + '% Complete');
    overallProgress.append(overallProgressInner);
    overallProgress.append(overallProgressContent);

    var editModeSwitch = $('<div>', {
        class: this._data.classnamePrefix + 'editModeSwitch'
    });
    var checked = '';

    if (this._data.isEditMode) {
        editModeSwitch.addClass(this._data.classnamePrefix + 'editModeOn');
        checked = 'checked=""';
    } else {
        editModeSwitch.addClass(this._data.classnamePrefix + 'editModeOff');
    }
    
    editModeSwitch.html('<div class="toggle-group"><input type="checkbox" name="on-off-switch" id="on-off-switch" ' + checked + ' tabindex="1"><label for="on-off-switch"></label><div class="onoffswitch pull-right" aria-hidden="true"><div class="onoffswitch-label"><div class="onoffswitch-inner"></div><div class="onoffswitch-switch"></div></div></div></div>');
    editModeSwitch.click(() => {
        this._data.isEditMode = !this._data.isEditMode;
        this._editorJSON();
        this.milestones(this._userData.milestones);
    })

    const editModeHints = $('<div>', {
        class: this._data.classnamePrefix + 'editModeHints'
    });

    editModeSwitch.append(editModeHints);
    wrapper.append(overallProgress);
    
    if ($(location).attr('host') === '') {
        // local dev only
        wrapper.append(editModeSwitch);
    }

    container.append(innerWrapper);
    wrapper.append(container);

    if (this._data.isEditMode) {
        this._editorJSON();
    } else {
        $('#' + this._data.classnamePrefix + 'editorJSON').remove();
    }

    if (this._data.scrollPos) {
        $(document).scrollTop(this._data.scrollPos);
    }
    
    if (this._data.wrapperScrollPos) {
        $('#' + this._data.wrapperDivId).scrollTop(this._data.wrapperScrollPos);
    }

    this._updateStorage();
}