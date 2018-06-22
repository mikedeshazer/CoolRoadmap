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

            roadmap.data[milestoneIdx].milestones[milestone.rank] = milestone;

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
                    roadmap.data[columnIdx].milestones[count] = {
                        spacer: true,
                        belongsToColumn: columnIdx + 1,
                        rank: count
                    }
                }

                count++;
            }

            roadmap.data[columnIdx].milestoneVersions = versionThis(roadmap.data[columnIdx].milestones, '2 decimals', 1);
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

    window.onresize = function() {
        roadmap.nodeWidth = -1;
        roadmap.nodeHeight = -1;
        roadmap.columnSpacing = -1;
        roadmap.nodeSpacing = -1;

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
            milstoneRanks.forEach(function(rank) {
                var milestone = columnData.milestones[rank];
                if (roadmap.nodeWidth === -1) {
                    // Dynamically get the width, height, and spacing of a node in a column
                    var fakeMilestoneElem = buildMilestone(milestone, idx);
                    var fakeColumn = columnElem.cloneNode(true);
                    fakeColumn.appendChild(fakeMilestoneElem);

                    var count = 1;
                    while (count <= roadmap.data.length) {
                        wrapper.appendChild(fakeColumn.cloneNode(true));
                        count++;
                    }

                    if (columnCount <= 5) {
                        container.classList += ' center';
                    }

                    container.appendChild(wrapper);
                    container.style.visibility = 'hidden';
                    roadmap.wrapperElement.appendChild(container);

                    var milestoneComputedStyle = getComputedStyle(
                        document.getElementsByClassName(roadmap.classNamePrefix + 'milestone')[0]
                    );
                    var columnComputedStyle = getComputedStyle(
                        document.getElementsByClassName(roadmap.classNamePrefix + 'column')[0]
                    );

                    roadmap.nodeWidth = document.getElementsByClassName('coolRoadmap-milestone')[0].offsetWidth + 4;
                    roadmap.nodeHeight = parseInt(milestoneComputedStyle.getPropertyValue('height').replace('px', '')) + 4;
                    roadmap.nodeSpacing = parseInt(milestoneComputedStyle.getPropertyValue('margin-bottom').replace('px', ''));
                    roadmap.columnSpacing = parseInt(columnComputedStyle.getPropertyValue('padding-right').replace('px', ''));
                    
                    wrapper.innerHTML = '';
                    container.innerHTML = '';
                    container.style.visibility = 'visible';
                    roadmap.wrapperElement.innerHTML = '';
                }

                var milestoneElem = buildMilestone(milestone, idx);
                columnElem.appendChild(milestoneElem);
            })

            wrapper.appendChild(columnElem);
        })

        // Add the wrapper to the container
        container.appendChild(wrapper);

        // Add the container to the parent
        roadmap.wrapperElement.appendChild(container);



        function buildColumn(columnData, columnIdx) {
            if (roadmap.milestoneCompleteData[columnIdx]) {
                var totalComplete = 0;
                var completedMilestones = [];

                roadmap.milestoneCompleteData[columnIdx].forEach(function(milestoneNum) {
                    totalComplete += columnData.milestones[milestoneNum].difficult || 0;
                    completedMilestones.push(milestoneNum);
                });

                columnData.milestones.forEach(function(milestone, idx) {
                    if (milestone.status === 'complete' && completedMilestones.indexOf(idx) === -1) {
                        totalComplete += milestone.difficult || 0;
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

        function buildMilestone(milestone, columnIdx) {
            var milstoneElem = document.createElement('div');

            if (milestone.title) {
                var title = document.createElement('div');
                var version = document.createElement('div');
                
                title.innerText = milestone.title;
                title.classList += roadmap.classNamePrefix + 'title';
                version.innerText = roadmap.data[columnIdx].milestoneVersions[milestone.rank];

                milstoneElem.appendChild(title);
                milstoneElem.appendChild(version);
            }

            milstoneElem.classList = roadmap.classNamePrefix + 'node ' + roadmap.classNamePrefix + 'milestone';

            if (milestone.spacer) {
                milstoneElem.classList += ' ' + roadmap.classNamePrefix + 'spacer'
            }

            if (roadmap.columnColors[columnIdx]  && milestone.status !== 'pending') {
                milstoneElem.style.borderColor = roadmap.columnColors[columnIdx];
                pseudoStyle(milstoneElem, 'after', 'background', roadmap.columnColors[columnIdx]);
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

                if (roadmap.columnColors[columnIdx] && milestone.status !== 'pending') {
                    startColor = roadmap.columnColors[columnIdx];
                }

                if (roadmap.columnColors[columnIdx + widthDiffIdx] && milestone.status !== 'pending') {
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

    function getMilestone(column, rank) {
        return roadmap.data[column].milestones[rank];
    }

    function versionThis(milestoneObjs, format, startingPoint) {
        if (typeof format != "string") {
            format = "2 decimals";
        }

        if (typeof startingPoint != "number") {
            startingPoint = "1";
        }

        startingPoint = startingPoint.toString();
    
        //all the milestone objects for a category are sent here, first to last
        var difficulty= 0;
        var responseSkeleton = ['0.10.0', '0.25.0', '0.40.0', '0.80.0', '0.90.0', '1.0.0'];

        for (i in milestoneObjs) {
            difficulty = difficulty + milestoneObjs[i]['difficulty'];
        }
    
        var lastGeneratedMilestoneNum = 0;
        var loopCount = 0;
        responseSkeleton=[];

        for (j in milestoneObjs) {
            var thisWeight = milestoneObjs[j]['difficulty'] / difficulty;
            thisMilestoneVersion = lastGeneratedMilestoneNum + thisWeight;
            lastGeneratedMilestoneNum = thisMilestoneVersion;
    
            if(format == "2 decimals"){
                if(loopCount >= milestoneObjs.length - 1){
                    var endingPoint = parseInt(startingPoint) + 1;
                    responseSkeleton.push(endingPoint.toString() + ".0.0");
                } else {
                    responseSkeleton.push(startingPoint.toString() + "" + lastGeneratedMilestoneNum.toFixed(2).toString().replace("0.", ".") + ".0"); 
                }
            } else {
                if (loopCount >= milestoneObjs.length-1) {
                    var endingPoint = parseInt(startingPoint) + 1;
                    responseSkeleton.push(endingPoint + ".0");
                } else{
                    responseSkeleton.push(startingPoint + "." + lastGeneratedMilestoneNum.toFixed(2).toString().replace("0.", ".")); 
                }
            }

            loopCount = loopCount + 1;
        }
    
        return responseSkeleton;
    }

    function pseudoStyle(hostElement, pseudoElement, prop, value){
        var _sheetId = "pseudoStyles";
        var _head = document.head || document.getElementsByTagName('head')[0];
        var _sheet = document.getElementById(_sheetId) || document.createElement('style');
        _sheet.id = _sheetId;
        var className = "pseudoStyle" + Math.floor(Math.random() * (999999999 + 1));
        
        hostElement.className +=  " " + className; 
        
        _sheet.innerHTML += "." + roadmap.classNamePrefix + "container ." + className + ":" + pseudoElement + "{" + prop + ":" + value + " !important}";
        _head.appendChild(_sheet);
    };

    return {
        columns: columns,
        milestones: milestones,
        style: style,
        markComplete: markComplete
    };
}