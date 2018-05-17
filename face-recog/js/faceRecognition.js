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
        recognizing = false;
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
let db_url = "http://sas.windworkshop.my"//"http://localhost:3000";

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
}){

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

function addMeeting(){

  var payload = {
    customer_id:subject.id,
    timelength: 0,
    timestamp:Math.round(new Date()/1000)
  };

  return $.ajax(db_url+"/meetings", {
    type:"POST",
    data:JSON.stringify(payload),
    dataType: "json",
    contentType:"application/json"
  })
}

function editMeeting(timelength){

  var payload = {
    customer_id:currentMeeting.customer_id,
    timelength: timelength,
    timestamp:currentMeeting.timestamp
  };

  return $.ajax(db_url+"/meetings", {
    type:"PUT",
    data:JSON.stringify(payload),
    dataType: "json",
    contentType:"application/json"
  })
}

function addEmotion(meeting_id, score){

  var payload = {
    meeting_id:meeting_id,
    score:score,
    timestamp:Math.round(new Date()/1000)
  };

  return $.ajax(db_url+"/emotions", {
    type:"POST",
    data:JSON.stringify(payload),
    dataType: "json",
    contentType:"application/json"
  })
}

function getEmotions(meeting_id){
  return $.ajax(db_url+"/emotions?meeting_id_like="+meeting_id, {
    type:"GET",
    dataType: "json",
    contentType:"application/json"
  });
}

function getCustomerMeetings(){
  return $.ajax(db_url+"/meetings?customer_id_likes="+subject.id, {
    type:"GET",
    dataType: "json",
    contentType:"application/json"
  });
}

// Recommendation formula
function recommendationAlgorithm(accountBalance,ctos,income,age,occupation,spendingHistory){
	/*
		l= loan
		fd= fixed deposit
		f= funds
		cc= credit cards
		i= insurance
	*/
	var l=0,fd=0,f=0,cc=0,i=0;

	if (accountBalance>=10000){
		f+=3;
		fd+=2
		cc+=2
	}

	else if (accountBalance<3000){
		l+=3;
	}

	//ctos is between 300 to 850
	if (ctos>697 && (houseLoan===null || carLoan===null)){
		cc+=3;
		l+=5;
	}

	else if (ctos<650){
		fd+=2;
		cc+=1
	}

	if (income>=5000){
		if (ctos<650){
			cc+=2;
		}

		if (accountBalance<=10000){
			fd+=2;
			f+=3;
			i+=3
		}
	}

	if (age<=25 || age>=40){
		i+=3

		if (age<=25){
			f+=1;
		}

		if (age>=40 && accountBalance>10000){
			fd+=2;
		}
	}

	switch (occupation){
		case 1:
			break;
		case 2:
			i+=1;
		case 3:
			i+=2;
		case 4:
			i+=3;
		case 5:
			i+=4;
	}


	if (spendingHistory===0){
		cc+=3
	}

  /*
		l= loan
		fd= fixed deposit
		f= funds
		cc= credit cards
		i= insurance
	*/
  var sort = [{name:"Loan",val:l},{name:"Fixed Deposit",val:fd},{name:"Funds",val:f},
    {name:"Credit Cards",val:cc},{name:"Insurance",val:i}].sort(function(a, b){
    return b.val - a.val;
  })

  return (sort[0]);

}

function updateInfo(){
  $(".info_name").html(subject.profile.name);
  $(".info_age").html(subject.profile.age);
  $(".info_occupation").html(subject.profile.occupation);
  $(".info_income").html("RM "+subject.profile.income);
  $(".info_account_balance").html("RM "+subject.profile.acc_balance);
  $(".info_ctos").html(subject.profile.CTOS);
  $(".info_spending_history").html(subject.profile.spending_history?"YES":"NO");
  //$(".info_name").html(subject.profile.name);
  var recommendation = recommendationAlgorithm( subject.profile.acc_balance, subject.profile.CTOS,
    subject.profile.income, subject.profile.age, subject.profile.occupation, subject.profile.spending_history);
  $(".info_recommendation").html(recommendation.name);

  addMeeting().done(function(resp){
    currentMeeting_id = resp.id;
    currentMeeting = resp;
  });

  $(".infoDisplay_1").addClass("swipeDown");
}
