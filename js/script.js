// JavaScript Document
window.fbAsyncInit = function () {
	FB.init({
		appId: '1437646656493417', 
		xfbml: true,
		version: 'v2.0'
	});
	FB.getLoginStatus(function (response) {
		if (response.status === 'connected') {
			var uid = response.authResponse.userID;
			var authToken = response.authResponse.accessToken;
			window.e = authToken;
			FB.api('/me', function (response) {
				//console.log(response);
				
			});
			FB.api('/me/picture?type=large', function(response) { // normal/large/squere 
					 var str="<img src="+ response.data.url +">";
					 //$('#preview1').append(str);
					$('#preview1').attr("src",response.data.url); //頁面1顯示
				});
		} else if (response.status === 'not_authorized') {
			console.log("this user is not authorizied your apps");			
			FB.login(function (response) {
				// FB.api('/me/feed', 'post', {message: 'I\'m started using FB API'});
				if (response.authResponse) { // if user login to your apps right after handle an event
				window.location.reload();
				};
			}, {
				scope: 'user_location,user_photos'
			});
		} else {
			console.log("this isn't logged in to Facebook.");
			FB.login(function (response) {
				if (response.authResponse) {
					window.location.reload();
				} else {
				//alertify.alert('An Error has Occurs,Please Reload your Pages');
				}
				});
			}
		});
		
	var ctx = document.getElementById('canvas').getContext('2d'); 
	ctx.font='20px "Arial"'; 
	ctx.fillText("Click here to start fill with Facebook Profile Picture", 40, 270); 
    var img = new Image(); 
    img.src = "img/overlay.png"; 
	var img2 = new Image(); 
	img2.src = "img/overlayback.png" 
	var img3 = new Image();
	img3.src = "img/typography.png"
	
    var canvas=document.getElementById("canvas"); 
    var ctx=canvas.getContext("2d"); 
    var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;
    var canvasWidth=canvas.width;
    var canvasHeight=canvas.height;
    var isDragging=false;

    function handleMouseDown(e){
		canMouseX=parseInt(e.clientX-offsetX);
		canMouseY=parseInt(e.clientY-offsetY);
		isDragging=true;
    }

    function handleMouseUp(e){
		canMouseX=parseInt(e.clientX-offsetX);
		canMouseY=parseInt(e.clientY-offsetY);
		isDragging=false;
    }

    function handleMouseOut(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
    }

    function handleMouseMove(e){
		canMouseX=parseInt(e.clientX-offsetX);
		canMouseY=parseInt(e.clientY-offsetY);
		if(isDragging){ 
          	ctx.clearRect(0,0,canvasWidth,canvasHeight); 
			var profileIMG = document.getElementById("preview1");
			profileIMG.crossOrigin = "Anonymous";  
			//canvas.width = profileIMG.width;
			//canvas.height = profileIMG.height;
			ctx.drawImage(profileIMG,0,0);
			ctx.drawImage(img3,canMouseX-128/2,canMouseY-120/2); 
			ctx.drawImage(img2,0,0); 
			var inputedText = $('#inputed').val();
			ctx.fillStyle = "black"; 
			ctx.font='20px "微軟正黑體"'; 
			ctx.fillText(inputedText, canMouseX-1/2,canMouseY-30/2); 
		}
    }
    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});
	}; //<<<<<<<<<<<<<<<init end

(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
		
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=320206518133001&version=v2.0";
	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
function PostImageToFacebook(authToken) {
	$('.info').append('<img src="img/loading.gif"/>')
    var canvas = document.getElementById("canvas");
    var imageData = canvas.toDataURL("image/png");
    try {
        blob = dataURItoBlob(imageData);
    } catch (e) {
        console.log(e);
    }
    var fd = new FormData();
    fd.append("access_token", authToken);//請思考accesstoken要怎麼傳到這function內
    fd.append("source", blob);
    fd.append("message", "這是HTML5 canvas和Facebook API結合教學");
    try {
        $.ajax({
            url: "https://graph.facebook.com/me/photos?access_token=" + authToken,//GraphAPI Call
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                console.log("success " + data);//成功log + photoID
                  $(".info").html("Posted Canvas Successfully. [<a href='http://www.facebook.com/" + data.id + " '>Go to Profile Picture</a>] "); //成功訊息並顯示連接
            },
            error: function (shr, status, data) {
                $(".info").html("error " + data + " Status " + shr.status);//如果錯誤把訊息傳到class info內
            },
            complete: function () {
                $(".info").append("Posted to facebook");//完成後把訊息傳到HTML的div內
            }
        });

    } catch (e) {
        console.log(e);//錯誤訊息的log
    }
}

// Convert a data URI to blob把影像載入轉換函數
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
}

