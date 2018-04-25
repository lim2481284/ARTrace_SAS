var headers = {
    "app_id"          : "f85b9af0",
    "app_key"         : "ca64c4ea184e5e4ffed0349bf10922cb"
};

let subject = {
  id:null,
  face_id:"",
  profile:null
}

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
            subject.face_id=response.images[0].transaction.face_id;

            checkFace(subject.face_id).done(function(res){

              if(res.length>0){
                // Customer Exist
                subject.id = res[0].id;
                subject.face_id = res[0].face_id;
                subject.profile = res[0].profile;
              }else{
                addCustomer(subject.face_id).done(function(resp){
                  subject.id = resp.id;
                  subject.face_id = resp.face_id;
                  subject.profile = resp.profile;
                });
              }
            });

            faceEnroll(image, subject.face_id);
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

        if(response.face_id){
          subject.face_id=response.face_id;
            //Here need to bind the faceid to current
          checkFace(subject.face_id).done(function(res){

            if(res.length>0){
              // Customer Exist
              subject.id = res[0].id;
              subject.face_id = res[0].face_id;
              subject.profile = res[0].profile;
            }else{
              // New Customer add to Database
              addCustomer(subject.face_id).done(function(resp){
                subject.id = resp.id;
                subject.face_id = resp.face_id;
                subject.profile = resp.profile;
              });
            }

          });
        }
    });
}

// Database API
function addCustomer(face_id, profile = {}){
  var payload = {
    face_id:face_id,
    profile:profile
  };

  return $.ajax("http://sas.windworkshop.my/customer", {
    type:"POST",
    data:JSON.stringify(payload),
    dataType: "json",
    contentType:"application/json"
  })
}

function editCustomer(id, face_id, profile = {}){
  var payload = {
    face_id:face_id,
    profile:profile
  };

  return $.ajax("http://sas.windworkshop.my/customer/"+id, {
    type:"PUT",
    data:JSON.stringify(payload),
    dataType: "json",
    contentType:"application/json"
  })
}

function getCustomer(id){
  return $.ajax("http://sas.windworkshop.my/customer/"+id, {
    type:"GET",
    dataType: "json",
    contentType:"application/json"
  });
}

function checkFace(face_id){
  return $.ajax("http://sas.windworkshop.my/post?face_id_like="+id, {
    type:"GET",
    dataType: "json",
    contentType:"application/json"
  });
}
