var headers = {
    "app_id"          : "f85b9af0",
    "app_key"         : "ca64c4ea184e5e4ffed0349bf10922cb"
};

let subject = {
  id:null,
  face_id:"",
  profile:null,
  recommendation:"",
  emotion:[]
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
            subject.face_id=response.images[0].transaction.subject_id;

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
          subject.face_id=response.images[0].transaction.subject_id;
            //Here need to bind the faceid to current
          checkFace(subject.face_id).done(function(res){

            if(res.length>0){
              // Customer Exist
              console.log("Exist Respond : ",res);
              subject.id = res[0].id;
              subject.face_id = res[0].face_id;
              subject.profile = res[0].profile;
              updateInfo();
            }else{
              // New Customer add to Database
              addCustomer(subject.face_id).done(function(resp){
                console.log("Add Respond : ",resp);
                subject.id = resp.id;
                subject.face_id = resp.face_id;
                subject.profile = resp.profile;
                updateInfo();
              });
            }

          });
        }
    });
}

// Database API
let db_url = "http://localhost:3000"//"http://sas.windworkshop.my";

function addCustomer(face_id, profile = {
  "name":"New Customer",
  "house_loan":"2018-03-31 09:57:00",
  "car_loan":null,
  "acc_balance":20000.00,
  "CTOS":600,
  "income":5000,
  "age":51,
  "occupation":2,
  "spending_history":1
}, emotion = []){

  var payload = {
    face_id:face_id,
    profile:profile,
    emotion:emotion
  };

  return $.ajax(db_url+"/customer", {
    type:"POST",
    data:JSON.stringify(payload),
    dataType: "json",
    contentType:"application/json"
  })
}

function editCustomer(id = subject.id, face_id = subject.face_id,
  profile = subject.profile,emotion = subject.emotion){

  var payload = {
    face_id:face_id,
    profile:profile,
    emotion:emotion
  };

  return $.ajax(db_url+"/customer/"+id, {
    type:"PUT",
    data:JSON.stringify(payload),
    dataType: "json",
    contentType:"application/json"
  })
}

function getCustomer(id){
  return $.ajax(db_url+"/customer/"+id, {
    type:"GET",
    dataType: "json",
    contentType:"application/json"
  });
}

function checkFace(face_id){
  return $.ajax(db_url+"/customer?face_id_like="+face_id, {
    type:"GET",
    dataType: "json",
    contentType:"application/json"
  });
}

// Recommendation formula
function getRecommendation(){
}

function updateInfo(){
  $(".info_name").html(subject.profile.name);
  $(".info_age").html(subject.profile.age);
  //$(".info_name").html(subject.profile.name);
}
