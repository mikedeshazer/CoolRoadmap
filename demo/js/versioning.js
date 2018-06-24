
//example input
/*
versionThis(
    [
        {"name":"1 milestone name", "difficulty":5},{"name":"2 milestone name", "difficulty":2}, {"name":" 3 milestone name", "difficulty":20}
        ],
    "2 decimals",
    1
  )



  // returns:
  // ["0.19.0", "0.26.0", "1.0.0"]
  
  */

function versionThis(milestoneObjs, format, startingPoint){

    if(typeof format !="string"){
        format = "2 decimals";
    }
    if(typeof startingPoint !="number"){
        startingPoint="1";
    }
    startingPoint= startingPoint.toString();

    //all the milestone objects for a category are sent here, first to last
    var difficulty= 0;

    var responseSkeleton = ['0.10.0', '0.25.0', '0.40.0', '0.80.0', '0.90.0', '1.0.0']
    for( i in milestoneObjs){
        difficulty= difficulty+ milestoneObjs[i]['difficulty'];

    }


    var lastGeneratedMilestoneNum = 0;
    var loopCount = 0;
    responseSkeleton=[];
    for (j in milestoneObjs){
        var thisWeight = milestoneObjs[j]['difficulty']/difficulty;
        thisMilestoneVersion = lastGeneratedMilestoneNum+ thisWeight;
        lastGeneratedMilestoneNum = thisMilestoneVersion;

        if(format == "2 decimals"){

            if(loopCount >=milestoneObjs.length-1){
                var endingPoint = parseInt(startingPoint)+1;
                responseSkeleton.push(endingPoint.toString()+".0.0");
            }
            else{
               responseSkeleton.push(startingPoint.toString()+""+lastGeneratedMilestoneNum.toFixed(2).toString().replace("0.", ".")+".0"); 
            }
            
        }


        else{

            if(loopCount >=milestoneObjs.length-1){
                var endingPoint = parseInt(startingPoint)+1;
                responseSkeleton.push(endingPoint+".0");
            }
             else{
               responseSkeleton.push(startingPoint+"."+lastGeneratedMilestoneNum.toFixed(2).toString().replace("0.", ".")); 
            }

        }



        loopCount=loopCount+1;
    }

    return responseSkeleton;
}

