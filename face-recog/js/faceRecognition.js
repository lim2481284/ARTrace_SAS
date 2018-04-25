var headers = {
    "app_id"          : "f85b9af0",
    "app_key"         : "ca64c4ea184e5e4ffed0349bf10922cb"
};

function faceReco(image){
    var payload  = {
        "image":image,
        "gallery_name":"whaddahack"
    }
    var url = "https://api.kairos.com/recognize";

    $.ajax(url, {
        headers  : headers,
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "json",
        contentType:"application/json"
    }).done(function(response){
        console.log(response);
        if (response.images[0].transaction.status=="success"){
            console.log("Face matches")
            var id=response.images[0].transaction.subject_id;
        }
        else{
            console.log("not match")
            faceEnroll(image)
        }
    });
}

function viewGallery(){
    var payload  = {
        "gallery_name":"whaddahack"
    };
    var url = "https://api.kairos.com/gallery/view";

    $.ajax(url, {
        headers  : headers,
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "json",
        contentType:"application/json"
    }).done(function(response){
        console.log(response)
    });
}


function faceEnroll(image,id=null){
    var url = "https://api.kairos.com/enroll";
    var payload={
        "image":image,
        "subject_id":id,
        "gallery_name":"whaddahack"
    }
    $.ajax(url, {
        headers  : headers,
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "json",
        contentType:"application/json"
    }).done(function(response){
        console.log(response)
        //Here need to bind the faceid to current
    });
}