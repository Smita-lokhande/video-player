function subscribe(){
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'subscribe',
            moduleid: '20',
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function subscribe(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if (res === "Saved") {
                    alert("Your trial period of 3 days is started.")
                    window.location.replace('/1/menu')
                }
                else if(res==="used"){
                    alert("Please buy subscription of 1 year, You already used your trial period")
                }
            }
        }
    })
}
function orginfo(){
    document.getElementById("orgnibtn").style.display= "none";
    document.getElementById("org").style.display= "block";
}
function saveorginfo(){
    //alert("hello")
    if($("#nameorg").val()===''){
        return alert("Enter the oraganiztion name")
    }
    if($("#orgaddress").val()===''){
        return alert("Enter the address name")
    }
    if($("#orgcity").val()===''){
        return alert("Enter the city name")
    }
    if($("#orgstate").val()===''){
        return alert("Enter the state name")
    }
    if($("#orgemail").val()===''){
        return alert("Enter the email name")
    }
    if($("#phoneno").val()===''){
        return alert("Enter the mobile number ")
    }
    //document.getElementById("loader2").style.visibility="visible";
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'saveorginfo',
                nameorg:  $("#orgname").val(),
                orgaddress:  $("#orgaddress").val(),
                orgaddress2:  $("#orgaddress1").val(),
                orgcity:  $("#orgcity").val(),
                orgstate:  $("#orgstate").val(),
                orgemail:  $("#orgemail").val(),
                phoneno: $("#phoneno").val(),
            },
            //contentType: "text/plain; charset=utf-8",
            cache: false,
            success: function user(res) {
                alert(res);
                cancelorgdb();
                window.location.replace('/1/menu')
            }
        })
}
function cancelorgdb(){
    document.getElementById("mainmenu").style.display="block";
    document.getElementById("org").style.display="none";
    window.location.replace('/1/menu')
}
function closeplayvideopage(){
    document.getElementById("mainmenu").style.display="block";
    document.getElementById("videoplayermainpage").style.display="none";
}
async function updateorginfo(){
    document.getElementById("updateorgnization").style.display="block";
    document.getElementById("mainmenu").style.display="none";
    await retriveorginfo();
}
async function managestaffinfo(){
    document.getElementById("managestaff").style.display="block";
    document.getElementById("mainmenu").style.display="none";
    showstaffreport();
}
function sendmessage1(){
    let rtext = "https://wa.me/91" + 8009936009;
    window.open(rtext, 'xyz');
}
function sendmessage2(){
    let rtext = "https://wa.me/91" + 8009926009
    window.open(rtext, 'xyz');
}
function retriveorginfo(){
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'retriveorginfo',
        },
        cache: false,
        success: function user(res) {
            //alert (res);
            document.getElementById("orgname1").value=res[0];
            document.getElementById("phoneno1").value=res[1];
            document.getElementById("uaddress").value=res[2];
            document.getElementById("uaddress2").value=res[3];
            document.getElementById("ucity").value=res[4];
            document.getElementById("ustate").value=res[5];
            document.getElementById("uemail").value=res[6];
        }
    })
}
function updateorg(){
    if($("#orgname1").val()===''){
        return alert("Enter the oraganiztion name")
    }
    if($("#uaddress").val()===''){
        return alert("Enter the address name")
    }
    if($("#ustate").val()===''){
        return alert("Enter the state name")
    }
    if($("#ucity").val()===''){
        return alert("Enter the city name")
    }
    if($("#uemail").val()===''){
        return alert("Enter the email name")
    }
    if($("#phoneno1").val()===''){
        return alert("Enter the mobile name")
    }
     //document.getElementById("loader2").style.visibility="visible";
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'updateorg',
            nameorg:  $("#orgname1").val(),
            phoneno: $("#phoneno1").val(),
            uaddress: $("#uaddress").val(),
            uaddress2: $("#uaddress2").val(),
            ucity: $("#ucity").val(),
            ustate: $("#ustate").val(),
            uemail: $("#uemail").val()
        },
        cache: false,
        success: function user(res) {
            alert (res);
        }

    })
}
function orgcolorvideoplayer(){
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'orgcolorvideoplayer',
            csscolor:  $("#csscolor").val(),
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
            
            alert("updated successfully");
            window.location.replace("/1/menu");
            }
        }

    })

}


function cancelupdateorginfo(){
    document.getElementById("updateorgnization").style.display="none";
    document.getElementById("mainmenu").style.display="block";
}
function videoplayerpage(){
    initVideoList();
document.getElementById("mainmenu").style.display="none";
document.getElementById("videoplayermainpage").style.display="block";
retrivevideol();
}
function videoadded(){
    document.getElementById("videoadd").style.display="block";
    document.getElementById("favdialogvideo").style.display="block";
}
function secondsToMinutes(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.round(seconds % 60);
    return minutes + " minutes " + remainingSeconds + " seconds";
}
function videoupload() {
    playlistid = $("#showvideo").val();
    if(playlistid=='Play List'){
        alert("Please Select Play List")
        return
    }
    var filename;
    var uploadimg = document.getElementById("uploadVideo");
    if (!uploadimg.files[0]) {
        return alert("Please select a file first");
    }
    var size = uploadimg.files[0].size / 2024 /2024;
   // alert(size +" size")
    var fileext = uploadimg.files[0].name.split(".").pop();
    if (fileext !== 'mp4' && fileext !== 'mov' && fileext !== 'jpeg'){
        return alert("Please select 'mp4' or 'mov' video extension");
    }
    if(size > 10){
        return alert("please select file less than 10 mb");
    }
    var conf = confirm("Do you want to upload this video?");
    if (conf === true) {
            var filestore = uploadimg.files[0];
            var video = document.createElement('video');
            video.src = URL.createObjectURL(filestore);
            video.addEventListener('loadedmetadata', function(){
                var durationInSeconds = video.duration;
                var durationInSecondsRounded = Math.round(durationInSeconds); // Round to the nearest second
                //console.log("Duration: " + durationInSecondsRounded + " seconds");
        
                var formdata = new FormData();
                formdata.append('video', filestore);
                formdata.append('action', 'savefile');
                formdata.append('duration', durationInSecondsRounded); // Store the duration in seconds
                //alert(durationInSecondsRounded + " seconds duration");
            fetch('/1/fileoperations', { method: "POST", body: formdata })
                .then(response => response.text())
                .then(data => {
                    $.ajax({
                        url: "/1/videoplayer",
                        type: 'POST',
                        data: {
                            action: 'videoupload',
                            uploaddata: fileext,
                            duration: durationInSecondsRounded ,
                            playvideol:playlistid,
                            size:size,
                            videoname: uploadimg.files[0].name.split('\\').pop().split('/').pop()
                        },
                        cache: false,
                        success: function savecaller(res) {
                            initVideoList();
                            videolist();
                            if (res === 'error') {
                                alert(res)
                                alert("Error while uploading video, try again later");
                            } else {
                                alert(res)
                                uploadVideo.value = '';
                               // alert("Video uploaded Successfully");
                            }
                        }
                    });
                });
        });
    }
}
function retrivvideoplayer(){
   // alert("hello")
   document.getElementById("videoidHidden").value = videoid;
   alert(videoid)
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'retrivvideoplayer' ,
            videoid:videoid
        },
        cache: false,
        success: function user(res) {
            if(res == 'error' || res =='No Image'){
            }else{
                alert(res)
                document.getElementById("retrivvideo").innerHTML="<img src='/getvideoplayer/"+res+"'>"
               
            }
        }
    })
}

// Call this function to initialize the video list
function initVideoList() {
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'getvideolist'
        },
        cache: false,
        success: function (res) {
            // Display the video list in the table
            $('#videoTable').html(res);
        }
    });
}
function videolist(){
    playlistid = $("#showvideo").val();
    if(playlistid=='Play List'){
        alert("Please Select Play List  ")
        return
    }
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'videolist',
            playlistid:playlistid,
        },
        cache: false,
        success: function (res) {
            document.getElementById("videolist").innerHTML=res;
            //$('#videoTable').html(res);
        }
    });
}
function showvideolist(){
    document.getElementById("videoPlayerContainer").style.display="block";
    videolist();
}
function closeshowvpage(){
    document.getElementById("videoplayermainpage").style.display="block";
    document.getElementById("showv").style.display="none";
    window.location.replace('/1/videoplayer')
    }
    var currentVideoWindow = null;
function playVideo(videoid, duration) {
    //alert(videoid)
    playlistid = $("#showvideo").val();
    var hiddenbox = document.getElementById('videoid');
    hiddenbox.value = videoid;
    document.getElementById("loader").style.visibility = "visible";
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'playVideo',
            videoid: videoid,
            playlistid: playlistid
        },
        cache: false,
        success: function (res) {
            document.getElementById("loader").style.visibility = "hidden";
            showvideotime(videoid);
            if (!currentVideoWindow || currentVideoWindow.closed) {
                currentVideoWindow = window.open('', '_blank');
                currentVideoWindow.document.write("<video controls style='width: 100%; height: 100%;' id='fullscreenVideo'></video>");
            }
            var fullscreenVideo = currentVideoWindow.document.getElementById('fullscreenVideo');
            fullscreenVideo.src = '/getvideoplayer/' + res;
            fullscreenVideo.play().then(() => {
                if (fullscreenVideo.requestFullscreen){
                    fullscreenVideo.requestFullscreen();
                } else if (fullscreenVideo.mozRequestFullScreen){
                    fullscreenVideo.mozRequestFullScreen();
                } else if (fullscreenVideo.webkitRequestFullscreen){
                    fullscreenVideo.webkitRequestFullscreen();
                }
                fullscreenVideo.addEventListener('ended', function () {
                });    
            });
        }
    });
}       
function playallvideo(){
    playlistid = $("#showvideo").val();
    if(playlistid=='Play List'){
        alert("Please Select Play List  ")
        return
    }
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'playallvideo',
            playlistid: playlistid,
        },
        cache: false,
        success: function (res) {
            //alert("Server Response: " + res.videos);
            var videos = res.videos;
            playVideoLoopSequentially(0, videos, res.orgid);
        }
    });
}
function playVideoLoopSequentially(index, videos, orgid) {
    if (index < videos.length) {
        var videoid = videos[index];
        var loopCount = videos.filter(video => video === videoid).length;
        playVideoLoopR(videoid, loopCount, function () {
            playVideoLoopSequentially(index + loopCount, videos, orgid);
            //console.log(videoid  +  playVideoLoopSequentially )
        });
    } else {
       // alert ("All videos have been played")
        playallvideo();
    }
}
function playVideoLoopR(videoid, loopCount, callback) {
    videoduration(videoid, function (duration) {
        if (loopCount > 0) {
            playVideo(videoid, duration);
            setTimeout(function () {
                playVideoLoopR(videoid, loopCount - 1, callback);
            },duration* 1000);
        } else {
            setTimeout(callback, duration * 200);
        }
    });
}
//playallvideo();

function videoduration(videoid,callback){
   // alert("ccc"+videoid)
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'videoduration',
            videoid: videoid,
            //valuestyle: selected
        },
        cache: false,
        success: function (res) {
           //alert(res)
           var duration = parsedurationtoseconds(res); 
           callback(duration);
        }
    });
}
function parsedurationtoseconds(duration) {
    var timeParts = duration.split(":");
    var hours = parseInt(timeParts[0], 10) || 0;
    var minutes = parseInt(timeParts[1], 10) || 0;
    var seconds = parseInt(timeParts[2], 10) || 0;

    return hours * 3600 + minutes * 60 + seconds;
}
function videouparrow(videoid){
    //alert(videoid +"vid")
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'videouparrow',
            videoid:videoid,
        },
        cache: false,
        success: function user(res) {
            videolist();
           alert(res)
        }
    })
}
function downarrow(videoid){
   // alert(videoid +"vid")
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'downarrow',
            videoid:videoid,
        },
        cache: false,
        success: function user(res) {
            videolist();
           alert(res)
        }
    })
}
function searchstaff(){
    if($("#staffmobilenumber").val()==='' ){
         alert("Please enter mobile number or name")
         return
    }
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
            action: 'searchstaff',
            mobileno:$("#staffmobilenumber").val(),
        },
        cache: false,
        success: function user(res) {
                if (res === 'sessionexpired') {
                    alert("Session Expired, Please login Again");
                    window.location.replace("/1/login");
                } else if (Array.isArray(res)) {
                    // User is registered, update HTML elements
                    document.getElementById("staffname").value = res[1];
                    document.getElementById("staffmail").value = res[2];
                } else {
                    // User is not registered or another error occurred
                    alert(res);
                }  
        }
    })
}
function assignstaff(){
     $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
                action: 'assignstaff',
                addposition:$("#addposition").val(),
                usermobilenumber:$("#staffmobilenumber").val(),
                username:$("#staffname").val(),
                useremail:$("#staffmail").val(),
            },
            cache: false,
            success: function user(res) {
            //document.getElementById("loader2").style.visibility='hidden'
        if (res === 'sessionexpired') {
            alert("Session Expired, Please login Again");
            window.location.replace("/1/login");
        } else {
            if (res === 'Assing staff') {
                addposition.value = '';
                staffmobilenumber.value = '';
                staffname.value = '';
                staffmail.value = '';
                alert ("Staff Save Successfully");
                showstaffreport();
            } else {
                addposition.value = '';
                staffmobilenumber.value = '';
                staffname.value = '';
                staffmail.value = '';
                showstaffreport();
                alert(res);
            }
           }
            }
        })
    }
    function showstaffreport(){
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'showstaffreportv', 
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res != 'No Record') {
                        
                        document.getElementById("staffreport").innerHTML=res;   
                        
                    }else{
                        document.getElementById("staffreport").innerHTML=res;   
                    } 
                }  
                    //alert(res);
                    
                    
            }
        })
    }  
    function deletestaffinfo(userid){
        var ans = confirm("Do You Want TO Deleted This Staff")
        if(ans==true){
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'deletestaffinfo',
                userid:userid,
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res==='Staff Deleted'){
                        showstaffreport();
                    }else{
                        //alert(res)
                    }
                }
            }
        })
        }
    }
       
    function closestaffbtn(){
        document.getElementById("managestaff").style.display="none";
        document.getElementById("mainmenu").style.display="block";
    }
    function updatevideoinfo(videoid){
        document.getElementById("updatevideoinfo1").style.display="block";
        document.getElementById("favdialogsetloop").style.display="block";
        retrivloopvalue(videoid);
    }
    function setvideoloop(videoid){
    $.ajax({
        url: "/1/videoplayer",
        type: 'POST',
        data: {
                action: 'setvideoloop',
                addposition:$("#addposition").val(),
                usermobilenumber:$("#staffmobilenumber").val(),
                username:$("#staffname").val(),
                useremail:$("#staffmail").val(),
            },
            cache: false,
            success: function user(res) {
            }
        })
}    
    function closesettime(){
    document.getElementById("updatevideoinfo1").style.display="none";
}
function setvideotime(videoid){
    //alert(videoid+" videoid")
    showvideotime(videoid)
    document.getElementById("settimevid").style.display="block";
    document.getElementById("videoidHidden").value = videoid;
    document.getElementById("favdialogsettime").style.display="block";
       // const favDialog = document.getElementById('favdialogsettime');
        // if (typeof favDialog.showModal === "function") {
        //     favDialog.showModal();
        //document.getElementById("timev").innerHTML=res;
// }else{
//         return alert("Sorry, the <dialog> API is not supported by this browser.") 
//     }
    }
    function showvideotime(videoid){
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'showvideotime',
                videoid:videoid,
            },
            cache: false,
            success: function user(res) {
                    if (res === 'sessionexpired') {
                        alert("Session Expired, Please login Again");
                        window.location.replace("/1/login");
                    } else if (Array.isArray(res)) {
                        // User is registered, update HTML elements
                        document.getElementById("pvtime").value = res[0];
                    } else {
                        // User is not registered or another error occurred
                        alert(res);
                    }  
            }
        })
    }
    function closesettime1(){
        document.getElementById("settimevid").style.display="none";
    }
    function convertTimeToSeconds(time) {
        var timeArray = time.split(':');
        var hours = parseInt(timeArray[0], 10) || 0;
        var minutes = parseInt(timeArray[1], 10) || 0;
        var seconds = parseInt(timeArray[2], 10) || 0;
        
        return hours * 3600 + minutes * 60 + seconds;
    }
    var chatInterval = setInterval('', 1000);
    function clearIntervalFunction() {
        clearInterval(chatInterval);
    }
    function playVideoOnTime(){
        var videoid = document.getElementById("videoidHidden").value;
        alert(videoid +"vid")
        var setPlaytime = document.getElementById("setplaytime").value;
        clearIntervalFunction();
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'playvideoontime',
                videoid: videoid,
                setPlaytime: setPlaytime,
            },
            cache: false,
            success: function user(res) {
                alert(res)
                var targetTime = convertTimeToSeconds(setPlaytime);
                alert(targetTime +"targetTime")
                chatInterval = setInterval(function () {
                    var currentTime = new Date().getTime() / 1000;
                    if (currentTime >= targetTime) {
                        clearIntervalFunction();
                        var video = document.getElementById(videoid);
                        alert(video + "  ,,,,,")
                        if (video) {
                            video.pause();
                            video.currentTime = targetTime;
                            video.play();
                        }
                    }
                });
            }
        });
    }
    
    function formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var seconds = seconds % 60;
    
        return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    }
    // Function to pad single-digit numbers with leading zeros
    function pad(num) {
        return num < 10 ? "0" + num : num;
    }
    // seting function //
    function settinginfo(){
        retriveplaylist();
        document.getElementById("setting").style.display="block";
        document.getElementById("mainmenu").style.display="none";
        }
        function closesetting(){
            document.getElementById("setting").style.display="none";
        document.getElementById("mainmenu").style.display="block";
        }
    function playlistadd(){
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'playlistadd',
                playlistname:$("#newplaylist").val(),
            },
            cache: false,
            success: function user(res) {
               alert(res)
               retriveplaylist();
            }
        })  
    }   
    function retriveplaylist(){
        // alert("hello")
        $.ajax({
            url:"/1/videoplayer",
            type: 'POST',
            data: {
                action: 'retriveplaylist',
            },
            cache: false,
            async: false,
            success: function savecaller(res) {
                //alert(res)
                var slsn1 = document.getElementById("showplaylistname")
                
                if(slsn1!=null){
                    slsn1.length = 0
                    // slsn1[slsn1.length] = new Option('Status')
                    for (i = 0; i < res.length; i++) {
                        var myOption = document.createElement("option");
                        try{
                            var x=JSON.parse(res[i]);
                            myOption.text = x.playlistname;
                            myOption.value = x.playlistid;
                            slsn1.add(myOption);
                        }catch(err)
                        {
                            
                        }
                    }
                }      
            }
        })
        } 
    function retrivevideol(){
        // alert("hello")
        $.ajax({
            url:"/1/videoplayer",
            type: 'POST',
            data: {
                action: 'retrivevideol',
            },
            cache: false,
            async: false,
            success: function savecaller(res) {
                var slsn1 = document.getElementById("showvideo")
                if(slsn1!=null){
                    slsn1.length = 0
                    slsn1[slsn1.length] = new Option('Play List')
                    for (i = 0; i < res.length; i++) {
                        var myOption = document.createElement("option");
                        try{
                            var x=JSON.parse(res[i]);
                            myOption.text = x.playlistname;
                            myOption.value = x.playlistid;
                            slsn1.add(myOption);
                        }catch(err)
                        {   
                        }
                    }
                }      
            }
        })



        }
        function setVideoId(videoid) {
            var hidden = document.getElementById('videoid');
            hidden.value = videoid;
            //debounce();
        }
        function updatevideoinformation(){
            var hidden = document.getElementById('videoid');
           var videoid = hidden.value;
           //alert(videoid +"vidooo")
            //var videoid = document.getElementById("videoidHidden").value;
            //alert(videoid +"vid")
            $.ajax({
                url: "/1/videoplayer",
                type: 'POST',
                data: {
                    action: 'updatevideoinformation',
                    playloopnumber:$("#settimeloop").val(),
                    playvideotime:$("#setplaytime").val(),
                    videoid:videoid
                },
                cache: false,
                success: function user(res) {
                   alert(res)
                   closesettime();
                   videolist();
                }
            })  
        }
        function retrivloopvalue(videoid){
            //alert(videoid)
            $.ajax({
                url: "/1/videoplayer",
                type: 'POST',
                data: {
                    action: 'retrivloopvalue',
                    videoid:videoid,
                },
                cache: false,
                success: function user(res) {
                //   alert (res);
                    document.getElementById("settimeloop").value=res[0];
                }
            })
        }
        function videoplayfillscreen(){
            playlistid = $("#showvideo").val();
            $.ajax({
                url: "/1/videoplayer",
                type: 'POST',
                data: {
                    action: 'videoplayfillscreen',
                    playlistid:playlistid,
                },
                cache: false,
                success: function user(res) {
                   alert(res)
                }
            })  
        }

     // Account Status 
     function acountstatusvideo(){
        getaccountdetailsvideo();
        document.getElementById("mainmenu").style.display='none';
        document.getElementById("acountstatusinfovideo").style.display='block';
    }
    function cancelaccountstatuspagevideo(){
        document.getElementById("acountstatusinfovideo").style.display='none';
        document.getElementById("mainmenu").style.display='block'
    }
    function getaccountdetailsvideo(){
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'getaccountdetailsvideo',
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res === "error"){
                        alert("Please check internet connection if the problem persists, contact us")
                    }else{
                        var stdate = new Date(res[2]);
                        var edate = new Date(res[3]);
                        edate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2);
                        stdate = stdate.getFullYear() + '-' + ('0' + (stdate.getMonth() + 1)).slice(-2) + '-' + ('0' + stdate.getDate()).slice(-2);
                        document.getElementById("state").value = res[0];
                        document.getElementById("valid").value = res[1];
                        document.getElementById("stdate").value = stdate;
                        document.getElementById("eddate").value = edate;    
                       // document.getElementById("usedquota").value = res[4]+"MB";
                        if (res[4] === "" || res[4] === undefined || res[4] === null || res[4] === "null") {
                            document.getElementById("usedquota").value = "0 MB";
                        }else{
                            document.getElementById("usedquota").value= res[4]+"MB"  
                        }
                        if (res[5] === "" || res[5] === undefined || res[5] === null || res[5] === "null") {
                            document.getElementById("quota").value = "0 MB";
                        }else{
                            document.getElementById("quota").value= res[5]+"MB"  
                        }
                    }
                }       
            }
        })
    }

    // delete  
    function deleteplaylist(){
        showplaylistname = $("#showplaylistname").val();
        //alert( showplaylistname +" - showplaylistname")
        var ans = confirm("Do You Want TO Deleted This Status")
        if(ans==true){
        $.ajax({
            url: "/1/videoplayer",
            type: 'POST',
            data: {
                action: 'deleteplaylist',
                showplaylistname:showplaylistname,
                
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res==='Delete status name and associated tasks'){
                        retriveplaylist();
                        //alert("Status Deleted")
                    }else{
                        retriveplaylist();
                        alert(res)
                      
                    }
                }
                }
        })
    }
}