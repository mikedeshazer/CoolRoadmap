function renderRoadmapTest(data, type){

    if(type=="category"){
        catObj =  $.parseJSON($('#catJSON').val());
        catObj.push(data);
        $('#catJSON').val(JSON.stringify(catObj));


        setTimeout(function(){
             mObj =  $.parseJSON($('#milesJSON').val());
           
            mObj['belongsToColumn'] = parseInt(mObj['belongsToColumn']);
            for(i in mObj){
                mObj[i]['belongsToColumn'] = parseInt(mObj[i]['belongsToColumn']);
            }

                    roadmapRender($.parseJSON($('#catJSON').val()), mObj );

        }, 100)
    }
    else{
             mObj =  $.parseJSON($('#milesJSON').val());
            mObj.push(data);
            for(i in mObj){
                mObj[i]['belongsToColumn'] = parseInt(mObj[i]['belongsToColumn']);
            }
            
            $('#milesJSON').val(JSON.stringify(mObj));

            setTimeout(function(){
                    roadmapRender($.parseJSON($('#catJSON').val()), mObj );

             }, 100)
    }

    
   
}

function roadmapRender(catData, milesData){

    roadmap1 = new roadmap('renderingBox');
    roadmap1.columns(catData);
    roadmap1.milestones(milesData);

}

function addCategory(){

    var newCatData = $('#title').val();
    renderRoadmapTest(newCatData, "category");
}


function addMilestone(){

    newMileData = $('#milesForm').serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {})
    renderRoadmapTest(newMileData, "milestone");
}



/*


Categories:



milestones:


title
description
status
release Note
ingegratesWith:
difficulty

*/