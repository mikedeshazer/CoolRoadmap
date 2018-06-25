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
        defaultMilestoneDifficulty: 10,
        milestoneCompleteData: [],
        userData: {
            columnNames: [],
            milestones: []
        }
    }

    function _processUserData() {
        roadmap.data = [];

        _processColumns();
        _processMilestones();
    }

    function columns(columnNames) {
        roadmap.userData.columnNames = columnNames;
        
        _processUserData();
        _build();
    } 

    function milestones(milestones) {
        roadmap.userData.milestones = milestones;
        
        _processUserData();
        _build();
    }

    function _processColumns() {
        roadmap.userData.columnNames.forEach(function(columnName) {
            roadmap.data.push({
                name: columnName,
                progressComplete: 0,
                totalDifficulty: 0,
                milestones: []
            })
        })
    }

    function _processMilestones() {
        var milestones = roadmap.userData.milestones;
        var milestoneRankMax = 0;
        var milestoneRankMin = 99999999;

        roadmap.data.forEach(function(column, idx) {
            roadmap.data[idx].milestones = [];
        })

        milestones.forEach(function(milestone, idx) {
            if (!milestone.belongsToColumn) {
                milestone.belongsToColumn = 1;
            }

            var columnIdx = milestone.belongsToColumn - 1;

            if (!roadmap.data[columnIdx]) {
                if (roadmap.userData.columnNames.length > 0) {
                    console.log(milestone);
                    console.warn('Milestone has invaid belongsToColumn');
                }

                return;
            }

            if (!milestone.rank) {
                milestone.rank = roadmap.data[columnIdx].milestones.length;
            }

            milestone.rank = parseFloat(milestone.rank);

            if (milestone.rank < 0) {
                console.log(milestone);
                throw new Error('Milestone has invaid rank - Ranks must be non-negative numbers');
            }

            if (milestone.rank % 1 !== 0) {
                console.log(milestone);
                throw new Error('Milestone has invaid rank - Ranks must be whole numbers');
            }

            milestone.rank = parseInt(milestone.rank);
            
            if (roadmap.data[columnIdx].milestones[milestone.rank]) {
                console.log(milestone);
                throw new Error('Milestone has invaid rank - A milestone with that rank is already defined');
            }

            if (!milestone.difficulty) {
                milestone.difficulty = roadmap.defaultMilestoneDifficulty;
            }

            milestone.difficulty = parseInt(milestone.difficulty);

            roadmap.data[columnIdx].milestones[milestone.rank] = milestone;

            roadmap.data[columnIdx].totalDifficulty += milestone.difficulty;

            if (milestone.rank > milestoneRankMax) {
                milestoneRankMax = milestone.rank;
            }

            if (milestone.rank < milestoneRankMin) {
                milestoneRankMin = milestone.rank;
            }
        })

        roadmap.data.forEach(function(column, columnIdx) {
            var count = milestoneRankMin;

            if (column.milestones.length > 0 && column.milestones[column.milestones.length - 1].rank !== milestoneRankMax) {
                var replacingRank = column.milestones.length - 1;

                roadmap.data[columnIdx].milestones[milestoneRankMax] = column.milestones[replacingRank];
                roadmap.data[columnIdx].milestones[milestoneRankMax].rank = milestoneRankMax;
                roadmap.data[columnIdx].milestones[replacingRank] = null;
            }

            while (count <= milestoneRankMax && count >= milestoneRankMin) {
                if (!column.milestones[count]) {
                    roadmap.data[columnIdx].milestones[count] = {
                        spacer: true,
                        belongsToColumn: columnIdx + 1, 
                        rank: count
                    }
                }

                var nextBelow = getNextBelowMilestone(columnIdx, count);
                if (!roadmap.data[columnIdx].milestones[count].status || 
                    (nextBelow && nextBelow.status === 'pending')
                ) {
                    roadmap.data[columnIdx].milestones[count].status = 'pending';
                }

                count++;
            }

            count = milestoneRankMax;
            while (count >= milestoneRankMin) {
                if (!roadmap.data[columnIdx].milestones[count].spacer) {
                    var nextAbove = null;
                    var innerCount = count + 0;

                    while (nextAbove === null) {
                        innerCount++;

                        if (!roadmap.data[columnIdx].milestones[innerCount]) {
                            nextAbove = false;
                        } else if (!roadmap.data[columnIdx].milestones[innerCount].spacer) {
                            nextAbove = innerCount;
                        }
                    }

                    if (roadmap.data[columnIdx].milestones[count].forwardConnect && typeof roadmap.data[columnIdx].milestones[count].forwardConnect[0] !== "object") {
                        roadmap.data[columnIdx].milestones[count].forwardConnect = [
                            [
                                roadmap.data[columnIdx].milestones[count].forwardConnect[0],
                                roadmap.data[columnIdx].milestones[count].forwardConnect[1]
                            ]
                        ];
                    } else if (!roadmap.data[columnIdx].milestones[count].forwardConnect) {
                        roadmap.data[columnIdx].milestones[count].forwardConnect = [];
                    }

                    if (nextAbove && !hasNextAboveForwardConnect(roadmap.data[columnIdx].milestones[count].forwardConnect)) {
                        roadmap.data[columnIdx].milestones[count].forwardConnect.push([
                            columnIdx + 1, nextAbove
                        ])
                    }

                    function hasNextAboveForwardConnect(forwardConnect) {
                        var hasIt = false;

                        roadmap.data[columnIdx].milestones[count].forwardConnect.forEach(function(innerForwardConnect) {
                            if (innerForwardConnect[0] === columnIdx + 1 && innerForwardConnect[1] === nextAbove) {
                                hasIt = true;
                            }
                        })

                        return hasIt;
                    }
                }

                count--;
            }

            roadmap.data[columnIdx].milestoneVersions = versionThis(roadmap.data[columnIdx].milestones, '2 decimals', 1);
        })
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
        if (roadmap.data.length <= 5) {
            roadmap.nodeWidth = -1;
            roadmap.nodeHeight = -1;
            roadmap.columnSpacing = -1;
            roadmap.nodeSpacing = -1;

            _build();
        }
    }

    function _build() {
        var columnCount = 0;

        // Empty the wrapper element
        roadmap.wrapperElement.innerHTML = '';

        // Create our container
        var container = document.createElement('div');
        container.classList = roadmap.classNamePrefix + 'container';

        var overallProgress = document.createElement('div');
        var overallProgressInner = document.createElement('div');
        var overallProgressContent = document.createElement('div');
        overallProgressInner.classList = roadmap.classNamePrefix + 'progressBar';
        overallProgress.classList = roadmap.classNamePrefix + 'overallProgress';
        overallProgressContent.classList = roadmap.classNamePrefix + 'progressContent';
                    
        if (roadmap.data.length <= 5) {
            container.classList += ' center';
        }

        // Create our wrapper
        var wrapper = document.createElement('div');
        wrapper.classList = roadmap.classNamePrefix + 'wrapper';

        // build and add the columns and milestone nodes
        roadmap.data.forEach(function(columnData, idx) {
            columnCount++;
            var columnElem = buildColumn(columnData, idx);

            var milstoneRanks = Object.keys(columnData.milestones).sort(function(a, b) {return a - b;}).reverse();
            var milestoneCount = 0;
            milstoneRanks.forEach(function(rank) {
                var milestone = columnData.milestones[rank];
                if (roadmap.nodeWidth === -1) {
                    // Dynamically get the width, height, and spacing of a node in a column
                    var fakeMilestoneElem = buildMilestone(milestone, idx, milestoneCount);
                    var fakeColumn = columnElem.cloneNode(true);
                    fakeColumn.appendChild(fakeMilestoneElem);

                    var count = 1;
                    while (count <= roadmap.data.length) {
                        wrapper.appendChild(fakeColumn.cloneNode(true));
                        count++;
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

                var milestoneElem = buildMilestone(milestone, idx, milestoneCount);
                columnElem.appendChild(milestoneElem);
                milestoneCount++;
            })

            wrapper.appendChild(columnElem);
        })

        var totalPercent = 0;

        roadmap.data.forEach(function(columnData) {
            totalPercent += parseInt(columnData.progressComplete);
        })

        totalPercent /= roadmap.data.length;
        
        overallProgressInner.style.width = totalPercent + '%';
        overallProgressContent.innerText = totalPercent + '% Complete';
        overallProgress.appendChild(overallProgressInner);
        overallProgress.appendChild(overallProgressContent);

        // Add the overall progress to the parent
        roadmap.wrapperElement.appendChild(overallProgress);

        // Add the wrapper to the container
        container.appendChild(wrapper);

        // Add the container to the parent
        roadmap.wrapperElement.appendChild(container);



        function buildColumn(columnData, columnIdx) {
            var totalComplete = 0;
            var completedMilestones = [];

            if (roadmap.milestoneCompleteData[columnIdx]) {
                roadmap.milestoneCompleteData[columnIdx].sort().forEach(function(milestoneNum) {
                    if (getNextBelowMilestone(columnIdx, milestoneNum).status !== 'pending' && roadmap.data[columnIdx].milestones[milestoneNum] && !roadmap.data[columnIdx].milestones[milestoneNum].spacer) {
                        roadmap.data[columnIdx].milestones[milestoneNum].status = 'complete';
                        totalComplete += columnData.milestones[milestoneNum].difficulty;
                        completedMilestones.push(milestoneNum);
                    }
                });
            }

            columnData.milestones.forEach(function(milestone, idx) {
                if (!milestone.spacer && milestone.status === 'complete' && completedMilestones.indexOf(idx) === -1) {
                    totalComplete += milestone.difficulty;
                    completedMilestones.push(idx);
                }
            })
            
            roadmap.data[columnIdx].progressComplete = ((totalComplete / columnData.totalDifficulty) * 100).toFixed(0);

            if (isNaN(roadmap.data[columnIdx].progressComplete)) {
                roadmap.data[columnIdx].progressComplete = 100;
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
            header.onclick = lightbox.bind(this, columnData, null, true);
            header.appendChild(headerProgressBar);
            header.classList = roadmap.classNamePrefix + 'node ' + roadmap.classNamePrefix + 'header';

            column.appendChild(header);

            return column;
        }

        function buildMilestone(milestone, columnIdx, milestoneCount) {
            var milstoneElem = document.createElement('div');

            if (milestone.title) {
                var title = document.createElement('div');
                var version = document.createElement('div');
                
                title.innerText = milestone.title;
                title.classList += roadmap.classNamePrefix + 'title';
                version.innerText = roadmap.data[columnIdx].milestoneVersions[milestoneCount];

                milstoneElem.appendChild(title);
                milstoneElem.appendChild(version);
            }
            
            milstoneElem.onclick = lightbox.bind(this, milestone, columnIdx, false);
            milstoneElem.classList = roadmap.classNamePrefix + 'node ' + roadmap.classNamePrefix + 'milestone';
            milstoneElem.style.zIndex = milestone.rank;

            if (milestone.spacer) {
                milstoneElem.classList += ' ' + roadmap.classNamePrefix + 'spacer'
            }

            if (milestone.status === 'complete') {
                if (roadmap.columnColors[columnIdx]) {
                    milstoneElem.style.borderColor = roadmap.columnColors[columnIdx];
                    pseudoStyle(milstoneElem, 'after', 'background', roadmap.columnColors[columnIdx]);
                }

                milstoneElem.classList += ' ' + roadmap.classNamePrefix + 'complete';
            }

            if (milestone.forwardConnect) {
                milestone.forwardConnect.forEach(function(forwardConnect) {
                    var startColor = '#2e3148';
                    var endColor = '#2e3148';
                    var arrowElem = document.createElement('div');
                    
                    arrowElem.classList = roadmap.classNamePrefix + 'arrow';

                    var heightDiffIdx = milestone.rank - forwardConnect[1];
                    var widthDiffIdx = forwardConnect[0] - milestone.belongsToColumn;

                    var heightDiff = heightDiffIdx * (roadmap.nodeHeight + roadmap.nodeSpacing);
                    var widthDiff = widthDiffIdx * (roadmap.nodeWidth + roadmap.columnSpacing);
                    var isNoEnd = true;

                    var paddingAndArrow = 12 + (4 * Math.abs(heightDiffIdx));

                    if (milestone.status === 'complete') {
                        startColor = roadmap.columnColors[columnIdx];
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
                    if (startColor) {
                        arrowElem.style.backgroundImage = 'linear-gradient(to right, ' + startColor + ', ' + endColor + ')';
                        pseudoStyle(arrowElem, 'before', 'border-color', endColor);
                    }

                    milstoneElem.appendChild(arrowElem);
                });
            }

            return milstoneElem;
        }
    }

    function lightbox(milestone, columnIdx, isColumn) {
        var lightboxElement = document.createElement('div');
        var modalElement = document.createElement('div');
        var titleElement = document.createElement('div');
        var versionElement = document.createElement('span');
        var statusElement = document.createElement('div');
        var footerElement = document.createElement('div');

        lightboxElement.classList = roadmap.classNamePrefix + 'lightbox';
        modalElement.classList = roadmap.classNamePrefix + 'modal';
        titleElement.classList = roadmap.classNamePrefix + 'title';
        versionElement.classList = roadmap.classNamePrefix + 'version';
        statusElement.classList = roadmap.classNamePrefix + 'status';
        footerElement.classList = roadmap.classNamePrefix + 'footer';

        if (!isColumn) {
            titleElement.innerText = milestone.title;
        } else {
            titleElement.innerText = milestone.name;
        }

        if (!isColumn) {
            versionElement.innerText = roadmap.data[columnIdx].milestoneVersions[milestone.rank];
            titleElement.appendChild(versionElement);
        }

        modalElement.appendChild(titleElement);

        if (!isColumn) {
            if (milestone.status !== 'pending' && (!milestone.descriptionHTML || milestone.descriptionHTML === '')) {
                modalElement.innerHTML += 'To Be Announced';
            } else {
                modalElement.innerHTML += milestone.descriptionHTML;
            }
        } else {
            modalElement.innerHTML += 'Final version of ' + milestone.name + ' before we launch. Features are frozen';
        }

        statusElement.classList += ' ' + roadmap.classNamePrefix + 'inProgress';
        statusElement.innerText = 'In Progress';
        
        if (!isColumn && milestone.status === 'complete') {
            statusElement.classList += ' ' + roadmap.classNamePrefix + 'complete';

            if (milestone.released) {
                statusElement.innerText = 'Released ' + milestone.released;
            } else {
                statusElement.innerText = '';
            }
        } else if (isColumn && milestone.progressComplete === '100') {
            statusElement.classList += ' ' + roadmap.classNamePrefix + 'complete';
            statusElement.innerText = 'Released';
        }

        footerElement.appendChild(statusElement);

        if (milestone.moreInfoURL) {
            var detailsButton = document.createElement('div');
            detailsButton.classList = roadmap.classNamePrefix + 'detailsButton';

            detailsButton.innerText = 'Details';
            detailsButton.onclick = function() {
                window.open(milestone.moreInfoURL, '_blank');
            }

            footerElement.appendChild(detailsButton);
        }

        modalElement.appendChild(footerElement);
        lightboxElement.appendChild(modalElement);
        lightboxElement.onclick = close;
        document.body.appendChild(lightboxElement);

        function close() {
            lightboxElement.remove();
        }
    }

    function getNextAboveMilestone(column, rank) {
        var nextAbove = null;
        var innerCount = rank + 0;

        while (nextAbove === null) {
            innerCount++;

            if (!roadmap.data[column].milestones[innerCount]) {
                nextAbove = false;
            } else if (!roadmap.data[column].milestones[innerCount].spacer) {
                nextAbove = roadmap.data[column].milestones[innerCount];
            }
        }

        return nextAbove;
    }

    function getNextBelowMilestone(column, rank) {
        var nextBelow = null;
        var innerCount = rank + 0;

        while (nextBelow === null) {
            innerCount--;

            if (!roadmap.data[column].milestones[innerCount]) {
                nextBelow = false;
            } else if (!roadmap.data[column].milestones[innerCount].spacer) {
                nextBelow = roadmap.data[column].milestones[innerCount];
            }
        }

        return nextBelow;
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
        var milestoneCount = 0;
        var milstoneRanks = Object.keys(milestoneObjs).sort(function(a, b) {return a - b;});

        milstoneRanks.forEach(function(i) {
            if (!milestoneObjs[i].spacer) {
                milestoneCount++;
                difficulty += milestoneObjs[i].difficulty;
            }
        });
    
        var lastGeneratedMilestoneNum = 0;
        var loopCount = 0;
        responseSkeleton=[];
        
        milstoneRanks.forEach(function(i) {
            if (!milestoneObjs[i].spacer) {
                var thisWeight = milestoneObjs[i].difficulty / difficulty;
                
                lastGeneratedMilestoneNum += thisWeight;
        
                if(format == "2 decimals"){
                    if(loopCount >= milestoneCount - 1){
                        var endingPoint = parseInt(startingPoint) + 1;
                        responseSkeleton.push(endingPoint.toString() + ".0.0");
                    } else {
                        responseSkeleton.push(startingPoint.toString() + "" + lastGeneratedMilestoneNum.toFixed(2).toString().replace("0.", ".") + ".0"); 
                    }
                } else {
                    if (loopCount >= milestoneCount - 1) {
                        var endingPoint = parseInt(startingPoint) + 1;
                        responseSkeleton.push(endingPoint + ".0");
                    } else{
                        responseSkeleton.push(startingPoint + "." + lastGeneratedMilestoneNum.toFixed(2).toString().replace("0.", ".")); 
                    }
                }

                loopCount = loopCount + 1;
            } else {
                responseSkeleton.push("");
            }
        });
        
        return responseSkeleton.reverse();
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