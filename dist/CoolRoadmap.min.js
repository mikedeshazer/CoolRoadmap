function roadmap(wrapperDivID) {
    var roadmap = {
        classNamePrefix: 'coolRoadmap-',
        wrapperDivID: wrapperDivID,
        wrapperElement: document.getElementById(wrapperDivID),
        data: [],
        nodeWidth: 100,
        nodeHeight: 100,
        columnColors: []
    }

    function columns(columnNames) {
        columnNames.forEach(function (columnName) {
            roadmap.data.push({
                name: columnName,
                milestones: {}
            })
        })

        _build();
    } 

    function milestones(milestones) {
        milestones.forEach(function (milestone) {
            var milestoneIdx = milestone.belongsToColumn - 1;

            if (!roadmap.data[milestoneIdx]) {
                throw new Error('Milestone has invaid belongsToColumn');
            }

            if (!roadmap.data[milestoneIdx].milestones[milestone.rank]) {
                roadmap.data[milestoneIdx].milestones[milestone.rank] = [];
            }

            roadmap.data[milestoneIdx].milestones[milestone.rank].push(milestone);
        })

        _build();
    }

    function style(columnColors) {
        roadmap.columnColors = columnColors;

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
            var columnElem = buildColumn(columnData);

            var milstoneRanks = Object.keys(columnData.milestones).sort().reverse();
            var count = 0;
            milstoneRanks.forEach(function(rank) {
                columnData.milestones[rank].forEach(function(milestone) {
                    count++;
                    columnElem.appendChild(buildMilestone(milestone, count, idx));
                })
            })

            wrapper.appendChild(columnElem);
        })

        // clearfix after the columns
        var clearfix = document.createElement('div');
        clearfix.classList = roadmap.classNamePrefix + 'clearfix';
        wrapper.appendChild(clearfix);

        if (columnCount <= 5) {
            container.classList += ' center';
        }

        // Add the wrapper to the container
        container.appendChild(wrapper);

        // Add the container to the parent
        roadmap.wrapperElement.appendChild(container);



        function buildColumn(columnData) {
            var column = document.createElement('div');
            column.classList = roadmap.classNamePrefix + 'column';

            var header = document.createElement('div');
            
            header.innerText = columnData.name;
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

                if (roadmap.columnColors[columnIdx]) {
                    startColor = roadmap.columnColors[columnIdx];
                }

                var a = milestone.forwardConnect[1] - milestoneIdx;
                var b = milestone.forwardConnect[0] - milestone.belongsToColumn;
                // Determine the degrees that the other node is from this node
                var transformDegrees = Math.atan2(a, b) * 180 / Math.PI;
                // Determine the distance from the other node
                var distance = Math.sqrt((Math.pow(a * 150, 2)) + (Math.pow(b * 150, 2)))
                
                arrowElem.style.transform = "rotate(" + transformDegrees + "deg)";
                // The width is the distance minus a nodes width
                arrowElem.style.width = (distance) - 120 + 'px';

                if (b < 0) {
                    // If the arrow is pointing towards a column to the left of the node
                    arrowElem.style.left = '10px';
                    
                    if (roadmap.columnColors[columnIdx - 1]) {
                        endColor = roadmap.columnColors[columnIdx - 1];
                    }

                    arrowElem.classList += ' ' + roadmap.classNamePrefix + 'noEnd';
                } else if (b == 0) {
                    // If the arrow is pointing towards the same column of the node
                    arrowElem.style.left = '50%';
                    arrowElem.style.width = '20px';
                    endColor = startColor;
                } else {
                    // If the arrow is pointing towards a column to the right of the node
                    if (roadmap.columnColors[columnIdx + 1]) {
                        endColor = roadmap.columnColors[columnIdx + 1];
                    }

                    arrowElem.classList += ' ' + roadmap.classNamePrefix + 'noEnd';
                }

                if (a == 0) {
                    // If the arrow is pointing towards a node in the same rank
                    arrowElem.style.top = '50%'
                    arrowElem.style.width = (distance) - 96 + 'px';

                    if (b > 0) {
                        arrowElem.style.left = distance - 47 + 'px';
                    } else if (b < 0) {
                        arrowElem.style.left = '-3px';
                    }
                }

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
        style: style
    };
}