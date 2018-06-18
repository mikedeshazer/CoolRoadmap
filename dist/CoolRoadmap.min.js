function roadmap(wrapperDivID) {
    var roadmap = {
        classNamePrefix: 'coolRoadmap-',
        wrapperDivID: wrapperDivID,
        wrapperElement: document.getElementById(wrapperDivID),
        data: [],
        nodeWidth: 100,
        nodeHeight: 100
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

    function _build() {
        // Empty the wrapper element
        roadmap.wrapperElement.innerHTML = '';

        // Create our wrapper
        var wrapper = document.createElement('div');
        wrapper.classList = roadmap.classNamePrefix + 'wrapper';

        // build and add the columns and milestone nodes
        roadmap.data.forEach(function (columnData) {
            var columnElem = buildColumn(columnData);

            var milstoneRanks = Object.keys(columnData.milestones).sort().reverse();
            var count = 0;
            milstoneRanks.forEach(function(rank) {
                columnData.milestones[rank].forEach(function(milestone) {
                    count++;
                    columnElem.appendChild(buildMilestone(milestone, count));
                })
            })

            wrapper.appendChild(columnElem);
        })

        // clearfix after the columns
        var clearfix = document.createElement('div');
        clearfix.classList = roadmap.classNamePrefix + 'clearfix';
        wrapper.appendChild(clearfix);

        // Add the container to the parent
        roadmap.wrapperElement.appendChild(wrapper);



        function buildColumn(columnData) {
            var column = document.createElement('div');
            column.classList = roadmap.classNamePrefix + 'column';

            var header = document.createElement('div');
            
            header.innerText = columnData.name;
            header.classList = roadmap.classNamePrefix + 'node ' + roadmap.classNamePrefix + 'header';
            column.appendChild(header);

            return column;
        }

        function buildMilestone(milestone, milestoneIdx) {
            var milstoneElem = document.createElement('div');

            if (milestone.title) {
                milstoneElem.innerText = milestone.title;
            }

            milstoneElem.classList = roadmap.classNamePrefix + 'node ' + roadmap.classNamePrefix + 'milestone';

            if (milestone.spacer) {
                milstoneElem.classList += ' ' + roadmap.classNamePrefix + 'spacer'
            }

            if (milestone.forwardConnect) {
                var arrowElem = document.createElement('div');
                
                arrowElem.classList = roadmap.classNamePrefix + 'arrow';

                var a = milestone.forwardConnect[1] - milestoneIdx;
                var b = milestone.forwardConnect[0] - milestone.belongsToColumn;
                // Determine the degrees that the other node is from this node
                var transformDegrees = Math.atan2(a, b) * 180 / Math.PI;
                // Determine the distance from the other node
                var distance = Math.sqrt((Math.pow(a * 150, 2)) + (Math.pow(b * 150, 2)))
                
                arrowElem.style.transform = "rotate(" + transformDegrees + "deg)";
                // The width is the distance minus a nodes width
                arrowElem.style.width = (distance) - 110 + 'px';

                if (b < 0) {
                    // If the arrow is pointing towards a column to the left of the node
                    arrowElem.style.left = '-5px';
                    arrowElem.style.width = (distance) - 160 + 'px'; 
                } else if (b == 0) {
                    // If the arrow is pointing towards the same column of the node
                    arrowElem.style.left = '50%';
                    arrowElem.style.width = '15px';
                } else {
                    // If the arrow is pointing towards a column to the right of the node
                    arrowElem.style.width = (distance) - 160 + 'px'; 
                }

                if (a == 0) {
                    // If the arrow is pointing towards a node in the same rank
                    arrowElem.style.top = '50%'
                    arrowElem.style.width = (distance) - 110 + 'px';
                }

                milstoneElem.appendChild(arrowElem);
            }

            return milstoneElem;
        }
    }

    return {
        columns: columns,
        milestones: milestones
    };
}