function roadmap(wrapperDivID) {
    var roadmap = {
        classNamePrefix: 'coolRoadmap-',
        wrapperDivID: wrapperDivID,
        wrapperElement: document.getElementById(wrapperDivID),
        data: [],
        nodeWidth: -1,
        nodeHeight: -1,
        columnSpacing: -1,
        nodeSpacing: -1,
        columnColors: [],
        milestoneCompleteData: []
    }

    function columns(columnNames) {
        columnNames.forEach(function(columnName) {
            roadmap.data.push({
                name: columnName,
                progressComplete: 0,
                totalDifficult: 0,
                milestones: []
            })
        })

        _build();
    } 

    function milestones(milestones) {
        var milestoneRankMax = 0;

        milestones.forEach(function(milestone) {
            var milestoneIdx = milestone.belongsToColumn - 1;

            if (!roadmap.data[milestoneIdx]) {
                throw new Error('Milestone has invaid belongsToColumn');
            }

            if (!roadmap.data[milestoneIdx].milestones[milestone.rank]) {
                roadmap.data[milestoneIdx].milestones[milestone.rank] = [];
            }

            roadmap.data[milestoneIdx].milestones[milestone.rank].push(milestone);

            if (milestone.difficult) {
                roadmap.data[milestoneIdx].totalDifficult += milestone.difficult;
            }

            if (milestone.rank > milestoneRankMax) {
                milestoneRankMax = milestone.rank;
            }
        })

        roadmap.data.forEach(function(column, columnIdx) {
            var count = 0;

            while (count <= milestoneRankMax) {
                if (!column.milestones[count]) {
                    roadmap.data[columnIdx].milestones[count] = [
                        {
                            spacer: true,
                            belongsToColumn: columnIdx + 1,
                            rank: count
                        }
                    ]
                }

                count++;
            }
        })

        _build();
    }

    function style(columnColors) {
        roadmap.columnColors = columnColors;

        _build();
    }
    
    function markComplete(milestoneCompleteData) {
        roadmap.milestoneCompleteData = milestoneCompleteData;

        _build();
    }

    function _build() {
        var columnCount = 0;

        // Empty the wrapper element
        roadmap.wrapperElement.innerHTML = '';

        // Create our container
        var container = document.createElement('div');
        container.classList = roadmap.classNamePrefix + 'container';

        // Create our wrapper
        var wrapper = document.createElement('div');
        wrapper.classList = roadmap.classNamePrefix + 'wrapper';

        // build and add the columns and milestone nodes
        roadmap.data.forEach(function(columnData, idx) {
            columnCount++;
            var columnElem = buildColumn(columnData, idx);

            var milstoneRanks = Object.keys(columnData.milestones).sort().reverse();
            var count = 0;
            milstoneRanks.forEach(function(rank) {
                columnData.milestones[rank].forEach(function(milestone) {
                    count++;

                    if (roadmap.nodeWidth === -1) {
                        // Dynamically get the width, height, and spacing of a node in a column
                        var fakeMilestoneElem = buildMilestone(milestone, count, idx);
                        var fakeColumn = columnElem.cloneNode(true);
                        fakeColumn.appendChild(fakeMilestoneElem);

                        wrapper.appendChild(fakeColumn.cloneNode(true));
                        wrapper.appendChild(fakeColumn.cloneNode(true));
                        container.appendChild(wrapper);
                        container.style.visibility = 'hidden';
                        roadmap.wrapperElement.appendChild(container);

                        var milestoneComputedStyle = getComputedStyle(
                            document.getElementsByClassName(roadmap.classNamePrefix + 'milestone')[0]
                        );
                        var columnComputedStyle = getComputedStyle(
                            document.getElementsByClassName(roadmap.classNamePrefix + 'column')[0]
                        );

                        roadmap.nodeWidth = parseInt(milestoneComputedStyle.getPropertyValue('width').replace('px', '')) + 4;
                        roadmap.nodeHeight = parseInt(milestoneComputedStyle.getPropertyValue('height').replace('px', '')) + 4;
                        roadmap.nodeSpacing = parseInt(milestoneComputedStyle.getPropertyValue('margin-bottom').replace('px', ''));
                        roadmap.columnSpacing = parseInt(columnComputedStyle.getPropertyValue('margin-right').replace('px', ''));
                        
                        wrapper.innerHTML = '';
                        container.innerHTML = '';
                        container.style.visibility = 'visible';
                        roadmap.wrapperElement.innerHTML = '';
                    }

                    var milestoneElem = buildMilestone(milestone, count, idx);
                    columnElem.appendChild(milestoneElem);
                })
            })

            wrapper.appendChild(columnElem);
        })

        if (columnCount <= 5) {
            container.classList += ' center';
        }

        // Add the wrapper to the container
        container.appendChild(wrapper);

        // Add the container to the parent
        roadmap.wrapperElement.appendChild(container);



        function buildColumn(columnData, columnIdx) {
            if (roadmap.milestoneCompleteData[columnIdx]) {
                var totalComplete = 0;
                var completedMilestones = [];

                roadmap.milestoneCompleteData[columnIdx].forEach(function(milestoneNum) {
                    totalComplete += columnData.milestones[milestoneNum][0].difficult || 0;
                    completedMilestones.push(milestoneNum);
                });

                columnData.milestones.forEach(function(milestones, idx) {
                    if (milestones[0].status === 'complete' && completedMilestones.indexOf(idx) === -1) {
                        totalComplete += milestones[0].difficult || 0;
                    }
                })

                columnData.progressComplete = ((totalComplete / columnData.totalDifficult) * 100).toFixed(0);
            }

            var column = document.createElement('div');
            column.classList = roadmap.classNamePrefix + 'column';

            var header = document.createElement('div');
            var headerProgressBar = document.createElement('div');
            var headerProgressBarInner = document.createElement('div');
            var headerProgressBarContent = document.createElement('div');

            headerProgressBarInner.style.width = columnData.progressComplete + '%';
            headerProgressBarInner.classList = roadmap.classNamePrefix + 'progressBar';
            if (roadmap.columnColors[columnIdx]) {
                headerProgressBarInner.style.backgroundColor = roadmap.columnColors[columnIdx];
            }

            headerProgressBar.classList = roadmap.classNamePrefix + 'progress';

            headerProgressBarContent.innerText = columnData.progressComplete + '% Complete';
            headerProgressBarContent.classList = roadmap.classNamePrefix + 'progressContent';

            headerProgressBar.appendChild(headerProgressBarInner);
            headerProgressBar.appendChild(headerProgressBarContent);
            
            header.innerText = columnData.name;
            header.appendChild(headerProgressBar);
            header.classList = roadmap.classNamePrefix + 'node ' + roadmap.classNamePrefix + 'header';

            column.appendChild(header);

            return column;
        }

        function buildMilestone(milestone, milestoneIdx, columnIdx) {
            var milstoneElem = document.createElement('div');

            if (milestone.title) {
                milstoneElem.innerText = milestone.title;
            }

            milstoneElem.classList = roadmap.classNamePrefix + 'node ' + roadmap.classNamePrefix + 'milestone';

            if (milestone.spacer) {
                milstoneElem.classList += ' ' + roadmap.classNamePrefix + 'spacer'
            }

            if (roadmap.columnColors[columnIdx]) {
                milstoneElem.style.borderColor = roadmap.columnColors[columnIdx];
            }

            if (milestone.forwardConnect) {
                var startColor = '#2e3148';
                var endColor = '#2e3148';
                var arrowElem = document.createElement('div');
                
                arrowElem.classList = roadmap.classNamePrefix + 'arrow';

                var heightDiffIdx = milestone.rank - milestone.forwardConnect[1];
                var widthDiffIdx = milestone.forwardConnect[0] - milestone.belongsToColumn;

                var heightDiff = heightDiffIdx * (roadmap.nodeHeight + roadmap.nodeSpacing);
                var widthDiff = widthDiffIdx * (roadmap.nodeWidth + roadmap.columnSpacing);
                var isNoEnd = true;

                var paddingAndArrow = 12 + (2 * Math.abs(heightDiffIdx));

                if (roadmap.columnColors[columnIdx]) {
                    startColor = roadmap.columnColors[columnIdx];
                }

                if (roadmap.columnColors[columnIdx + widthDiffIdx]) {
                    endColor = roadmap.columnColors[columnIdx + widthDiffIdx];
                }

                if (widthDiffIdx === 0 && heightDiffIdx < 0) {
                    // Arrow is pointing N
                    arrowElem.style.left = '50%';
                    heightDiff += roadmap.nodeHeight + paddingAndArrow;
                    isNoEnd = false;
                } else if (widthDiffIdx > 0 && heightDiffIdx < 0) {
                    // Arrow is poining NE
                    widthDiff -= ((roadmap.nodeWidth / 4) * 3);
                    heightDiff += roadmap.nodeHeight + (2 * Math.abs(heightDiffIdx));
                } else if (widthDiffIdx > 0 && heightDiffIdx === 0) {
                    // Arrow is pointing E
                    arrowElem.style.top = '50%'
                    widthDiff -= roadmap.nodeWidth + (14 * Math.abs(widthDiffIdx));
                } else if (widthDiffIdx > 0 && heightDiffIdx > 0) {
                    // Arrow is pointing SE
                    arrowElem.style.top = '100%'
                    widthDiff -= ((roadmap.nodeWidth / 4) * 3);
                    heightDiff -= roadmap.nodeHeight + (2 * Math.abs(heightDiffIdx));
                } else if (widthDiffIdx === 0 && heightDiffIdx > 0) {
                    // Arrow is pointing S
                    arrowElem.style.left = '50%';
                    arrowElem.style.top = roadmap.nodeHeight + 5;
                    heightDiff -= roadmap.nodeHeight + paddingAndArrow;
                    isNoEnd = false;
                } else if (widthDiffIdx < 0 && heightDiffIdx > 0) {
                    // Arrow is pointing SW
                    arrowElem.style.left = '-3px';
                    arrowElem.style.top = '100%'
                    widthDiff += ((roadmap.nodeWidth / 4) * 3);
                    heightDiff -= roadmap.nodeHeight + (2 * Math.abs(heightDiffIdx));
                } else if (widthDiffIdx < 0 && heightDiffIdx === 0) {
                    // Arrow is pointing W
                    arrowElem.style.left = '-3px';
                    arrowElem.style.top = '50%'
                    widthDiff += roadmap.nodeWidth + (8 * Math.abs(heightDiffIdx));
                } else if (widthDiffIdx < 0 && heightDiffIdx < 0) {
                    // Arrow is pointing NW
                    arrowElem.style.left = '25%';
                    widthDiff += ((roadmap.nodeWidth / 4) * 2);
                    heightDiff += roadmap.nodeHeight + 10;
                }

                // Determine the degrees that the other node is from this node
                var transformDegrees = Math.atan2(heightDiff, widthDiff) * 180 / Math.PI;
                // Determine the distance from the other node
                var distance = Math.hypot(heightDiff, widthDiff);
                
                if (isNoEnd) {                    
                    arrowElem.classList += ' ' + roadmap.classNamePrefix + 'noEnd';
                }

                arrowElem.style.transform = "rotate(" + transformDegrees + "deg)";
                arrowElem.style.width = distance;
                arrowElem.style.backgroundImage = 'linear-gradient(to right, ' + startColor + ', ' + endColor + ')';
                pseudoStyle(arrowElem, 'before', 'border-color', endColor);

                milstoneElem.appendChild(arrowElem);
            }

            return milstoneElem;
        }
    }

    function pseudoStyle(hostElement, pseudoElement, prop, value){
        var _sheetId = "pseudoStyles";
        var _head = document.head || document.getElementsByTagName('head')[0];
        var _sheet = document.getElementById(_sheetId) || document.createElement('style');
        _sheet.id = _sheetId;
        var className = "pseudoStyle" + Math.floor(Math.random() * (999999999 + 1));
        
        hostElement.className +=  " " + className; 
        
        _sheet.innerHTML += "." + roadmap.classNamePrefix + "container ." + className + ":" + pseudoElement + "{" + prop + ":" + value + "}";
        _head.appendChild(_sheet);
    };

    return {
        columns: columns,
        milestones: milestones,
        style: style,
        markComplete: markComplete
    };
}