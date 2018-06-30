Roadmap.prototype._getVersions = function(milestoneObjs, format, startingPoint) {
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
    milestoneObjs = milestoneObjs.slice(0).reverse();

    milestoneObjs.forEach(function(milestoneObj) {
        if (!milestoneObj.spacer) {
            milestoneCount++;
            difficulty += milestoneObj.difficulty;
        }
    });

    var lastGeneratedMilestoneNum = 0;
    var loopCount = 0;
    responseSkeleton=[];
    
    milestoneObjs.forEach(function(milestoneObj) {
        if (!milestoneObj.spacer) {
            var thisWeight = milestoneObj.difficulty / difficulty;
            
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