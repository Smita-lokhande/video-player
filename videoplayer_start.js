var ENVCALURL = "";
// var ENVCALURL = "https://dev.calendaree.com:55000"
const https = require('https');
var busboy = require('connect-busboy');
const http = require('http');
const mysql = require('mysql');
const express = require('express');//manage servers and routes
var bodyParser = require('body-parser');
const crypto = require ("crypto");
const session = require('express-session');
const { Console, info, error } = require('console');
const { query } = require('express');
const app=express();
// app.use(bodyParser.json());
var up = bodyParser.urlencoded({ extended: false });
const oneDay = 1000 * 60 * 60 * 24;
const {v4 : uuidv4, validate} = require('uuid');
const multer = require("multer");
const fs = require('fs');
const QRCode = require('qrcode');
const base64ToImage = require('base64-to-image');
const base64ToFile = require('base64-to-file');
const { func } = require('assert-plus');
const { resolve } = require('path');
const { execFileSync } = require('child_process');
const { bashCompletionSpecFromOptions } = require('dashdash');
app.use("/static", express.static("static"));
//app.use(fileUpload());
const port = 55000;
const host = 'localhost';
var stats = ""
app.set('views', './views');
app.set('view engine', 'pug');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const csvtojson = require('csvtojson');

// export const isAuthenticated = async (req, res, next) => {
//     res.set('isAuth', true);
//     next();
// }


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay}
  }))

  app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
}));

//   secret - a random unique string key used to authenticate a session. It is stored in an environment variable and can’t be exposed to the public. The key is usually long and randomly generated in a production environment.

// resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request. This can result in a race situation in case a client makes two parallel requests to the server. Thus modification made on the session of the first request may be overwritten when the second request ends. The default value is true. However, this may change at some point. false is a better alternative.

// saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.

// cookie: { maxAge: oneDay } - this sets the cookie expiry time. The browser will delete the cookie after the set duration elapses. The cookie will not be attached to any of the requests in the future. In this case, we’ve set the maxAge to a single day as computed by the following arithmetic.

app.get("/1/login",function(req, res){
    req.session.destroy();
    res.render("login.pug")
})
const tempdocstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./userdata/tempfiles");
    },
    onError : function(err, next) {
        console.log('error', err);
        next(err);
    },    
    filename: (req, file, cb) => {
        const fileExtension = file.originalname
        req.session.filename = fileExtension
        // console.log(req.session.sessionid+ ' file upload ' + req.session.userid)
        cb(null, req.session.userid+"."+fileExtension.split(".").pop());
    },
})
const uploadtemp = multer({
    storage: tempdocstorage,
    limits: { fileSize: 209715200000}
})

app.get('/getattendanceuser/:filename', (req, res) => {
    fname = "./userdata/download/"+ req.params.filename
    //console.log(fname +" Address")

    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res); 
    }
 });
app.post("/1/fileoperations",uploadtemp.single('image'), async (req,res)=>{

//   app.post("/1/fileoperations",uploadtemp.single('video'), async (req,res)=>{
    if(!req.session.userid){
        res.send("sessionexpired")
    }else if(req.body.action == 'savefile'){
        console.log("save file -")
        res.send("ok")
    }else if(req.body.action == 'retriveimage'){
        console.log("retriv file -")
        retrivefile(req,res)
    }else if(req.body.action == 'replacefile'){
        console.log("replacefile file -")
        replacefile(req,res)
    }else if(req.body.action == 'deletefile'){
        console.log("delete file -")
        deletefile(req,res)
    }
    else{
        console.log("Wrong Choice")
    }
})

//image trtriv
function retrivefile(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        console.log(sql + " retrive query 123")
        //console.log(result)
        if(err) console.log(err)
        else if(result.length>0){
            if (fs.existsSync("./userdata1/" + nameoftempfol)){
                
            }else{
                fs.mkdir("./userdata1/"+nameoftempfol,{ recursive: true }, function(err){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("New directory successfully created.")
                    }
                })
            }
            try {
                let path = "./userdata1/" + nameoftempfol+"/"
                console.log(path+" retrivefile path")
                let filename1 = result[0].filename
                console.log(filename1 +"122")
                let filename = filename1.split(".")
                //  console.log(filename[0])
                //  console.log(filename[1] )
                var optionalObj = {'fileName': filename[0], 'type': filename[1]};
                base64ToImage(result[0].file,path,optionalObj);
                successfun(filename1)
                console.log(filename1)     
            } catch (error){
                successfun("error")
            }
        }else{
            successfun("No Image")
        }
    })
}
//retrivefile1

function retrivefile1(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    // console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        if(err){
            console.log(err)
        }else if(result.length>0){
            var arr=[];
        arr.push(result[0].filename)
        arr.push(result[0].file)
        arr.push(result[0].file.length)
        successfun(arr);
        }else{
            console.log("file not found")
            successfun("File not Found")
        }
    })
}
// video retriv
// function retrivefile(req,res,fileid1,path1,orgid,successfun){
//     //console.log("123456")
//     var fileid = fileid1
//    // console.log(fileid +"  fileid")
//     var nameoftempfol = path1
//     //console.log(nameoftempfol +" nameoftempfol")
//     let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
//     fcon.query(sql,function(err,result){
//        // console.log(sql)
//         //console.log(result)
//         if(err) console.log(err)
//         else if(result.length>0){
//             if (fs.existsSync("./userdata/" + nameoftempfol)){
                
//             }else{
//                 fs.mkdir("./userdata/"+nameoftempfol,{ recursive: true }, function(err){
//                     if (err) {
//                         console.log(err)
//                     } else {
//                         console.log("New directory successfully created.")
//                     }
//                 })
//             }
//             try {
//                 let path = "./userdata/" + nameoftempfol+"/"
//                 // console.log(path+" retrivefile path")
//                 let filename1 = result[0].filename
//                 let filename = filename1.split(".")
//                 //console.log(filename[0] +"")
//                 //console.log(filename[1] +"3333")
//                 var optionalObj = {'fileName': filename[0], 'type': filename[1]};
//                 //console.log(optionalObj.fileName + " " + optionalObj.type +" optionalObj")
//                 // base64ToImage(result[0].file,path,optionalObj);
//                 let obj1 = result[0].file.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
//                 obj1 = obj1.replace(/ /g, '+'); // <--- this is important
//                 fs.writeFile(path+filename1, obj1, 'base64', function(err) {
//                    // console.log(err);
//                 });
//                 //  base64ToFile(result[0].file, path, optionalObj);
//                 // base64ToVideo(result[0].file,path,optionalObj);
//                 successfun(filename1)
//                 //console.log(filename1 +"   *filename1")     
//             } catch (error){
//                 console.log(error)
//                 successfun("error")
//             }
//         }else{
//             successfun("No Image")
//         }
//     })
// }

//---------------------------Update Quote Savefiledb, replace file,deletefile,retrivefile---------------------------
function savefiledb(req,res,orgid,successfun){
    let fileid = uuidv4(); 
    console.log(fileid +" --fileid")
    let success = fileid
    // console.log( success +" succ....")
    // console.log(req.session.filename +"  ..filename")
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error while uploading");
    }
    let fileExtension = req.session.filename.split(".").pop()
   console.log( fileExtension +" ...fileExtension")
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    // console.log(file + " - file ***")
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        // console.log(" - bitmap ***")
        let png = "data:image/"+fileExtension+";base64,"
        // console.log(png + " - png ***")
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
    //    console.log(file +"file -" + png+ +"-png")
        if (!file){
            console.log(" - !file ***")
           return successfun("Please upload a file.");
        }
        var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"','"+req.session.filename+"','"+png+"',now())"
        try{
            fcon.query(sql,function(err,result){
                // console.log(  "......"+sql +" .. fcon  1234567890")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                  return successfun(success);
                }else{
                    return successfun("error while uploading");
                }
            }) 
        } catch (error) {
            return successfun("error while uploading");
        }       
    } 
    else{
       return successfun("error while uploading")
    }
}

function savefiledb1(filename,filecontent, orgid, successfun) {
    let fileid = uuidv4();
    console.log(fileid + " --fileid");
    
    let fileExtension = filename.split(".").pop();
    console.log(fileExtension + " ...fileExtension");

    // Convert file content to base64
    let fileBase64 = filecontent.toString('base64');
    let fileurl = "data:image/" + fileExtension + ";base64," + fileBase64;
    // let fileurl = "data:image/" + fileExtension + ";base64,"; 
    var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"', '"+filename+"', '"+fileurl+"', now())";
    try {
      fcon.query(sql,function (err, result) {
        // console.log("......" + sql + " .. fcon");
        if (err) {
          console.log(err);
          return successfun("error while uploading");
        } else if (result.affectedRows > 0) {
          return successfun(fileid); 
        } else {
          return successfun("error while uploading");
        }
      });
    } catch (error) {
      return successfun("error while uploading");
    }
}


function replacefile(req,res,orgid,fileid,successfun){
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error");
    }    
    let fileExtension = req.session.filename.split(".").pop()
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        let png = "data:image/"+fileExtension+";base64,"
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
        if (!file) {
           successfun("Please upload a file.");
        }
        var sql = "update uploadfile set filename='"+req.session.filename+"', file='"+png+"', date=now() where fileid like'"+fileid+"' and orgid like'"+orgid+"'";
        fcon.query(sql,function(err,result){
            //console.log(sql)
            //console.log(result)
            if(err) console.log(err)
            else if(result.affectedRows>0){
                successfun("Updated")
            }else{
                successfun("error")
            }
        })            
    } 
    else{
        successfun("error")
    }
}

function deletefile(req,res,fileid,orgid,successfun){
    if(fileid == null || fileid == undefined || fileid == '' || fileid === 'undefined' || fileid === 'null'){
        successfun("Please send fileid")
    }else{
        var sql ="delete from uploadfile where orgid like'"+orgid+"' and fileid like '"+fileid+"'";
        fcon.query(sql,function(err,result){
            console.log(sql +" file db delet function")
            if(err) {
                console.log(err)
                successfun("err")
            }else if(result.affectedRows>0){
                successfun("file Deleted")
            }else{
                successfun("File Not Existed")
            }
        })
    }
}

app.post("/1/login",up,(req,res)=>{
    if(req.body.action==="loginbutton"){ 
        // console.log("hello")
        var mobileno=req.body.mobileno;
        var password =req.body.password;
        var sql = "select * from usermaster_t.users where mobile like '"+mobileno+"' and password like '"+password+"'"
        //   console.log(sql)
        mcon.query(sql,function(error, results){
        // console.log(sql+"............")     
        st1 = [];
              if (error) {
                console.log(error)
            } else if (results.length > 0) {
                st1.push(results.name)
                //  console.log(st1)
                req.session.userid = results[0].userid;
                //  console.log(req.session.userid +" userid")
                req.session.username = results[0].name;
                req.session.mobileno = results[0].mobileno;
                req.session.password = results[0].password;
                req.session.email = results[0].email;
                req.session.save();
                res.send("yes")
                // console.log(req.session.userid)
                // console.log(req.session.mobileno +"  mobile n")
                // console.log("save")
            }  else {
                 res.send("Invalid username or password.")
             }
        })
    }else if(req.body.action==="saveregister"){
        var username=req.body.username;
        var mobileno=req.body.mobileno;
        var email=req.body.email;
        var password=req.body.password;
        // var compassword=req.body.compassword;
        var userid=uuidv4();
        var sql = "select * from usermaster_t.users where mobile = '"+mobileno+"'";
        var sql1 = "insert into usermaster_t.users(userid,name,password,mobile,email) values('"+userid+"','"+username+"','"+password+"','"+mobileno+"','"+email+"')"
        mcon.query(sql,function(err,result1){
            //   console.log(sql+"register")
            if(err)console.log(err)
            else if(result1.length>0){
                //console.log(res)
                res.send("User Already Exist")
            }
             else{
                mcon.query(sql1,function(err,result){
                    if(err)console.log(err)
                    else if(result.length>0){
                        //  console.log("not")
                        res.send("error")
                    }else{
                        res.send("save")
                         }
                })
            }
        }) 
    }
})
// app.get("/1/menu", (req, res) => {
//     // console.log("here menu page.....")
//     if(!req.session.userid){
//         // confirm.log("asmi")
//         res.redirect("/1/login")
//     }else if(req.session.userid) {
//         username = req.session.username
//         email = req.session.email
//         mobileno = req.session.mobileno
//         console.log(req.session.mobileno + " - req.session.mobileno")
//         // console.log("showing menu for "+username+" "+email+" "+mobileno+"")
//         //mcon.query("select * from modules where is visible like 'yes'")
//         console.log("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//         res.render("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//     }
// });
app.get("/1/menu", (req, res) => {
    if(!req.session.userid){
        res.redirect("/1/login")
    }
    if(req.session.userid) {
        username = req.session.username
        email = req.session.email
        mobile = req.session.mobile
        // console.log("showing menu for "+username+" "+email+" "+mobile)
        mcon.query("select * from modules where isvisible like 'yes'")
        res.render("menu.pug",{user: req.session.userid, username: username});
    }
});
app.get("/1/Calendareemainpage",function(req, res){
    req.session.destroy();
    res.render("Calendareemainpage.pug")
})
app.post("/1/Calendareemainpage",up,async (req,res)=>{
    // if(!req.session.userid){
    //     res.send("sessionexpired")
    //     //res.redirect("/1/login")
    // }
})

//--------------------------------My New Project------------------------------------

//task register
const ucon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pranalimu$24',
    database: 'user',
    port: 3306
 });

 const fcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'filesdb_t',
    port: 45203
});

const vcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'videoplayer_t',
    port: 45203
})
const nmcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'mlm_t',
    port: 45203
})

const mcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'usermaster_t',
    port: 45203
});

app.get('/getvideoplayer/:filename', (req, res) => {
    fname = "./userdata/videoplay/"+req.session.orgid+"/"+req.params.filename
    //console.log(fname +"  fname")
    if (fs.existsSync(fname)){
        var readStream = fs.createReadStream(fname);
        readStream.pipe(res);
    } else {
        res.status(404).send("File not found");
    }
});
function gettotalsize2(subid,orgid,successfun){
    let sql ="SELECT orgid, sum(LENGTH(file)) / 1024 / 1024 as 'Size' FROM uploadfile where orgid = '"+orgid+"';"
    fcon.query(sql,function(err,result){
        // console.log(sql +"  gettotalsizee2")
        if(err) console.log(err)
        else{
            let filesize= parseFloat(result[0].Size).toFixed(2);
            // console.log(filesize +" filesize")
            var sql1 ="update subscriptions set usedquota="+filesize+" where subscriptionid like'"+subid+"'";
            mcon.query(sql1, function(err,result){
                console.log(sql1 +"   mcon update ")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                    successfun("Successful")                  
                }else{
                    successfun("Failed")
                }
            })
        }
    })
}
///////////////////// video palyer project  //////////////////////
app.get("/1/videoplayer",async(req, res) => {
    if(!req.session.userid){
         res.redirect("/1/login")
    }else{
        var admin = 0;
        var started = 0;
        var Player = 0;
        var substatus = 0;
        var orgcolor="";
        var sqla="select * from usermaster_t.subscriptions where userid='"+req.session.userid+"' and moduleid='20'";
        // console.log("sqla     "+sqla)
        mcon.query(sqla,(err,result)=>{
        if(err) console.log(err)
            else if(result.length>0){
                admin = 1;
                req.session.admin = admin
                req.session.subid = result[0].subscriptionid;
            }else{
                admin= 0;
            }
                var sql="select * from videoplayer_t.orginfo where subscriptionid='"+req.session.subid+"' ";
                //console.log("sql......."+sql)
                ncon.query(sql, (err, result)=>{
                if(err) console.log(err)
                else if (result.length>0) {
                    //console.log("one")
                    started = 1;                     
                    req.session.orgid = result[0].orgid;
                    //console.log(req.session.orgid +"orgid")
                } else {
                    started = 0;
                    //console.log("two")
                }
                    var sql3="select videoplayer_t.staff.orgid,videoplayer_t.orginfo.orgname from videoplayer_t.staff join videoplayer_t.orginfo on videoplayer_t.staff.orgid =  videoplayer_t.orginfo.orgid where  videoplayer_t.staff.userid ='"+req.session.userid+"' and position = 'Player'";
                    //console.log(sql3)
                    vcon.query(sql3, (err,result)=>{
                    if(err) console.log(err)
                    else if (result.length>0) {
                        Player = 1;
                        req.session.Player = Player;                     
                        req.session.orgid = result[0].orgid;
                        req.session.orgname = result[0].orgname;
                        console.log(req.session.Player + "Player")
                    } else {
                        Player = 0;
                    }
                    mcon.query("select enddate,subscriptionid from usermaster_t.subscriptions where subscriptionid in(select orginfo.subscriptionid from videoplayer_t.orginfo where orgid like '"+req.session.orgid+"')",function(err,result){
                        if(err)console.log(err)
                        else if(result.length>0){
                            var enddate = result[0].enddate
                            let date1 = new Date()
                            const diffTime = enddate.getTime() - date1.getTime();
                            const diffDays = diffTime / (1000 * 60 * 60 * 24);
                            if(diffDays>0){
                                    substatus = 1;
                            }else{
                                    substatus = 0;    
                                } 
                            }  
                            var sql="select * from videoplayer_t.orginfo where orgid='"+req.session.orgid+"' ";
                                    //console.log("sql......."+sql)
                                    vcon.query(sql, (err, result)=>{
                                        if(err) console.log(err)
                                        else if (result.length>0) {
                                            //console.log("one")
                                            req.session.orgcolor = result[0].csscolor;;                     
                                            orgcolor=req.session.orgcolor;
                                            //console.log(req.session.orgid +"orgid")
                                        } else {
                                            orgcolor = 0;
                                            //console.log("two")
                                        } 
                                res.render("videoplayer.pug",{userid: req.session.userid,username: req.session.username,admin:admin,started:started,substatus:substatus,Player:Player,orgcolor:orgcolor});
                                console.log("videoplayer.pug",{userid:req.session.userid,username: req.session.username,admin:admin,started:started,substatus:substatus,Player:Player,orgcolor:orgcolor});
                            })            
                        })
                    })
                }) 
            })
        }
    });
app.post("/1/videoplayer",up,async (req,res)=>{
    if(!req.session.userid){
        res.send("sessionexpired")
        // res.redirect("/1/login")
    }else if(req.body.action==="subscribe"){
        var startdate = new Date();
        var subscribeidnew = uuidv4();
        var currentdate = startdate.getFullYear()+'-'+("0" + (startdate.getMonth() + 1)).slice(-2)+'-'+("0" + startdate.getDate()).slice(-2) +" "+startdate.getHours()+':'+startdate.getMinutes()+':'+startdate.getSeconds();
        let days =3;
        let newDate = new Date(Date.now()+days*24*60*60*1000);
        let ndate = ("0" + newDate.getDate()).slice(-2);
        let nmonth = ("0" + (newDate.getMonth() + 1)).slice(-2);
        let nyear = newDate.getFullYear();   
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        let seconds = newDate.getSeconds();       
        let nextdate = nyear+'-'+nmonth+'-'+ndate +" "+hours+':'+minutes+':'+seconds 
        var sql1="select * from subscriptions where userid='"+req.session.userid+"' and moduleid=20 ";
        // console.log(sql1)
        mcon.query (sql1, function(err, result){
        //console.log(result +"  result")
            if(err) console.log(err)
            else if(result.length>0){
                res.send("used")
            }else{
                var sql2 = "insert into subscriptions(userid, subscriptionid, moduleid, startdate, enddate,isprimary ) values('"+req.session.userid+"','"+subscribeidnew+"',20,'"+currentdate+"','"+nextdate+"','yes')"
                    mcon.query(sql2, function(err, data){
                        if (err) throw err;
                        res.send("Saved")
                });  
            }
        })
    }
    else if(req.body.action==="saveorginfo"){
        var orgid = uuidv4();
        var nameorg = req.body.nameorg
        var phoneno = req.body.phoneno
        var orgaddress = req.body.orgaddress
        var orgaddress2 = req.body.orgaddress2
        var orgcity = req.body.orgcity
        var orgstate = req.body.orgstate
        var orgemail = req.body.orgemail
        var currentdate = new Date();
        currentdate = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2)
        var sql = "insert into videoplayer_t.orginfo(orgid, subscriptionid,orgname, mobileno,address1,address2,city,state,email,modifiedby,modifieddate,cardstatus) values('"+orgid+"','"+req.session.subid+"','"+nameorg+"', '"+phoneno+"','"+orgaddress+"','"+orgaddress2+"','"+orgcity+"','"+orgstate+"','"+orgemail+"','"+req.session.userid+"','"+currentdate+"','Active')"
        vcon.query(sql,function(err,result1){
            //  console.log(sql)
            if(err)console.log(err)
                else if (result1.affectedrows>0)
                {
                    res.send("Information saved successfully")
                }else{
                    res.send("Information saved successfully")
                }  
        })
    }
    else if(req.body.action==="retriveorginfo"){
        var sql="select * from orginfo where subscriptionid='"+req.session.subid+"'";
        // console.log(sql)
        vcon.query(sql,function (err,result){
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].orgname)
                arr.push(result[0].mobileno)
                arr.push(result[0].address1)
                arr.push(result[0].address2)
                arr.push(result[0].city)
                arr.push(result[0].state)
                arr.push(result[0].email)
                res.send(arr)
            }else{
                console.log("Orginfo error")
            }
        })
    }
    else if(req.body.action==="updateorg"){
        var nameorg = req.body.nameorg
        var phoneno = req.body.phoneno
        var uaddress = req.body.uaddress
        var uaddress2 = req.body.uaddress2
        var ucity = req.body.ucity
        var ustate = req.body.ustate
        var uemail = req.body.uemail
        var sql = "update orginfo set orgname='"+nameorg+"',mobileno='"+phoneno+"',address1='"+uaddress+"',address2='"+uaddress2+"',city='"+ucity+"',state='"+ustate+"',email='"+uemail+"'  where subscriptionid='"+req.session.subid+"'";
        vcon.query(sql,function(err,result){
            if(err)console.log(err)
            else if(result.affectedRows>0){
               res.send("updated successfully")
            }else{
                res.send("error")
            }
        })
    }
    else if(req.body.action==="orgcolorvideoplayer"){
        var csscolor = req.body.csscolor
        var sql = "update videoplayer_t.orginfo set csscolor='"+csscolor+"'  where subscriptionid='"+req.session.subid+"'";
        vcon.query(sql,function(err,result){
        //    console.log(sql  +  ">>>>")
            if(err)console.log(err)
            else if(result.affectedRows>0){
               res.send("updated successfully")
            }else{
                res.send("orginfo error")
            }
        })
    }
    else if (req.body.action === 'videoupload') {
        var size = req.body.size;
        var sql = "select subscriptions.quota, subscriptions.usedquota from subscriptions where subscriptionid like '" + req.session.subid + "'";
        mcon.query(sql, function (err, result) {
            //console.log(sql + "   .....")
            if (err) console.log(err)
            else if (result.length > 0) {
                let quota = 0, usedquota = 0;
                if (result[0].quota == null || result[0].quota == undefined || result[0].quota == "") {
                    quota = 0
                    console.log(quota + "  111111 quota")
                } else {
                    quota = result[0].quota;
                }
                if (result[0].usedquota == null || result[0].usedquota == undefined || result[0].usedquota == "") {
                    usedquota = 0
                } else {
                    usedquota = result[0].usedquota;
                }
                if (usedquota > quota) {
                    //console.log(usedquota >= quota + "  111 usedquota")
                    res.send("You have reached the maximum limit of file upload")
                } else if (size > quota) {
                    res.send("File size exceeds the allowed quota. Max size: " + quota)
                } else {
                    return new Promise((resolve, reject) => {
                        savefiledb(req,res,req.session.orgid,(successfun) => {
                            resolve(successfun);
                        });
                    }).then((data) => {
                        var videoname = req.body.videoname;
                        var playvideol = req.body.playvideol;
                        var duration = req.body.duration;
                        var formattedDuration = formatDuration(duration);
                        var currentDate = new Date();
                        currentDate = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2)
                        var sql = "INSERT INTO programs(orgid, videoid, createdby, timecount, creatdate, videoname, seq,playlistid,playloop) VALUES('" + req.session.orgid + "','" + data + "','" + req.session.userid + "','" + formattedDuration + "','" + currentDate + "','" + videoname + "','1000','" + playvideol + "','1');";
                        vcon.query(sql, function (err, result) {
                            console.log(sql +" file upload")
                            if (err) console.log(err);
                            else if (result.affectedRows > 0) {
                                return new Promise((resolve, reject) => {
                                    gettotalsize2(req.session.subid, req.session.orgid, (successfun) => {
                                        resolve(successfun)
                                    });
                                }).then((data) => {
                                    res.send('Video uploaded Successfully')
                                })
                            } else {
                                console.log("something went wrong, please try after sometime.....");
                            }
                        });
                    });
                }
            }
        })
    }
    else if(req.body.action === 'retrivvideoplayer'){
        var videoid=req.body.videoid
        let path ="videoplay/"+req.session.orgid+"/"+videoid
        var sql="select videoid from programs where orgid like'"+req.session.orgid+"' and videoid='"+videoid+"' ";
        vcon.query(sql,function(err,result){
            console.log(sql +"  retriv video")
            if(err) console.log(err)
            else if(result.length>0){
                let fileid = result[0].videoid
                return new Promise((resolve, reject) => {
                    retrivefile(req,res,result[0].videoid,path,req.session.orgid,(successfun) => {
                        resolve(successfun);
                    });
                }).then((data)=>{
                  //  console.log(data +" data123")
                    res.send(data)
                })
    
            }else{
                res.send("no file")
            }
        })    
    }
    else if (req.body.action === 'playVideo') {
        var videoid = req.body.videoid;
        var playlistid=req.body.playlistid;
        console.log(playlistid +" playlistid")
        let path = "videoplay/" + req.session.orgid;
        var sql = "select * from programs where orgid like'" + req.session.orgid + "' and videoid='" + videoid + "' and playlistid='"+playlistid+"'";
        vcon.query(sql, function (err, result) {
            console.log(sql +"playvideo")
            if (err) {
                console.log(err);
                res.send('error');
            } else if (result.length > 0) {
                // Check if video file exists in the specified path
                let videoFilePath = path + "/" + result[0].videoid;
                fs.access(videoFilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        // Video file doesn't exist, retrieve it
                        return new Promise((resolve, reject) => {
                            retrivefile(req, res, result[0].videoid, path, req.session.orgid, (successfun) => {
                                resolve(successfun);
                            });
                        }).then((data) => {
                            res.send(data);
                        });
                    } else {
                        // Video file exists, directly play it
                        res.send('Video already exists, playing...');
                    }
                });
            } else {
                res.send('No Video');
            }
        });
    }
    else if (req.body.action === 'getvideolist'){
        var tbltext = '';
        var sql = "select videoid,videoname from programs where orgid like'" + req.session.orgid + "'";
        vcon.query(sql, function (err, result) {
            console.log(sql +" getvideolist")
            if (err) console.log(err)
            else if (result.length > 0){
                tbltext = "<table><tr><th>Video Name</th><th>Action</th></tr>";
                for (var i = 0; i < result.length; i++) {
                    var videoid = result[i].videoid;
                    var videoname=result[i].videoname;
                    tbltext = tbltext + "<tr><td>" + videoname + "</td><td><button onclick='retrivvideoplayer(\"" + videoid + "\");'>Retriv</button> <button onclick='playVideo(\"" + videoid + "\");'>Play</button></td></tr>";
                }
                tbltext += "</table>";
                res.send(tbltext);
            } else {
                res.send("no file");
            }
        });
    }
    else if (req.body.action === 'videolist'){
        var playlistid = req.body.playlistid;
        var tbltext = '';
        var sql = "SELECT videoid,playloop, videoname, seq FROM programs WHERE orgid LIKE '" + req.session.orgid + "' and playlistid='"+playlistid+"' ORDER BY seq DESC;"
        vcon.query(sql, function (err, result) {
        console.log(sql +"list")
            if (err) console.log(err)
            else if (result.length > 0){
                tbltext = "<table id='report' ><tr><th>Video Name</th><th>Loop</th><th colspan='5'>Action</th></tr>";
                for (var i = 0; i < result.length; i++){
                    var videoid = result[i].videoid;
                    var videoname=result[i].videoname;
                    var playloop=result[i].playloop;
                    tbltext = tbltext + "<tr><td>" + videoname + "</td><td>"+playloop+"</td><td><button title='play Video'  class='videolistbutton' onclick='playVideo(\"" + videoid + "\");'><img src='/static/image/playvideo.png' style='height:20px; width:20px;'/></button><button title='Change Video Position Up Side' class='videolistbutton' onclick='videouparrow(\"" + videoid + "\");'><img src='/static/image/uparrow.png' style='height:20px; width:20px;'/></button><button title='Change Video Position Down Side' class='videolistbutton' onclick='downarrow(\"" + videoid + "\");'><img src='/static/image/downarrow.png' style='height:20px; width:20px;'/></button><button title='Update Video Loop Value' class='videolistbutton' onclick=\"updatevideoinfo('" + videoid + "'); setVideoId('" + videoid + "');\"><img src='/static/image/updatev.png' style='height:20px; width:20px;'/></button><input type='hidden' id='videoidHidden' value='" + videoid + "'></td></tr>";
                }
                tbltext += "</table>";
                res.send(tbltext);
            } else {
                res.send("no file");
            }
        });
    }
    else if (req.body.action ==='videouparrow'){
        var videoid=req.body.videoid
        var sql="update programs set seq=seq+1 where orgid = '"+req.session.orgid+"'and videoid='"+videoid+"'";             
        vcon.query(sql, function (err, result) {
        console.log(sql +" -update up row")
            if (err) console.log(err)
            if(err)console.log(err)
                else if (result.affectedRows>0)
                {
                    res.send("Update Successfully")
                }else{
                    res.send("down error")
                }    
        })   
    }
    else if (req.body.action ==='downarrow'){
        var videoid=req.body.videoid
        var sql="update programs set seq=seq-1 where orgid = '"+req.session.orgid+"'and videoid='"+videoid+"'";             
        vcon.query(sql, function (err, result) {
            console.log(sql +"-update down row")
            if (err) console.log(err)
            if(err)console.log(err)
            else if (result.affectedRows>0)
            {
                res.send("Update Successfully")
            }else{
                res.send("down error")
            }    
        })   
    }
    else if (req.body.action === "playallvideo"){
        var playlistid = req.body.playlistid;
        var sql = "SELECT * FROM programs WHERE orgid='" + req.session.orgid + "' and playlistid='" + playlistid + "' ORDER BY seq DESC ";
        vcon.query(sql, function (err, result) {
            //console.log(sql + "   play ");
            if (err) console.log(err);
            else if (result.length > 0) {
                var videosToPlay = [];
                // Iterate through the result array
                result.forEach(video => {
                    // Get the loop count for each video
                    var loopCount = video.playloop;
                    var timecount=result[0].timecount;
                    // Add the video to the playlist array based on its loop count
                    for (var i = 0; i < loopCount; i++) {
                        videosToPlay.push(video.videoid);
                    }
                });
                res.send({ videos: videosToPlay, orgid: req.session.orgid ,});
            } else {
                console.log("error");
                res.send("");
            }
        });
    }
    else if(req.body.action ==="videoduration") {
        var videoid=req.body.videoid;
        var sql = "select * from programs where orgid='" + req.session.orgid + "' and videoid='"+videoid+"'";
        vcon.query(sql, function (err, result) {
            console.log(sql + "   play ");
            if (err) console.log(err);
            else if (result.length > 0) {
                    var timecount=result[0].timecount
                    //console.log(valuestyle)
                    //console.log(playloop)
                    //console.log(timecount)
                res.send(timecount);
            } else {
                console.log("error");
                res.send("");
            }
        });
    }
   else if(req.body.action === "playvideoloop") {
        var videoid = req.body.videoid;
        let path = "videoplay/"+req.session.orgid;
        var sql = "select * from programs where orgid like'" + req.session.orgid + "' and videoid='" + videoid + "'";
        vcon.query(sql, function (err, result) {
           // console.log(sql +"sql")
            if (err) {
                console.log(err);
                res.send('error');
            } else if (result.length > 0) {
                return new Promise((resolve, reject) => {
                    retrivefile(req,res,result[0].videoid,path,req.session.orgid,(successfun) => {
                        resolve(successfun);
                    });
                }).then((data)=>{
                    res.send(data)
                })
            } else {
                res.send('No Video');
            }
        });
    }
    else if(req.body.action==="searchstaff"){
        var mobileno = req.body.mobileno
        var sql="select * from usermaster_t.users where mobile='"+mobileno+"'";
        mcon.query(sql,function(err,result){
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].mobileno)
                arr.push(result[0].name)
                arr.push(result[0].email)
                arr.push(result[0].userid)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("User is not registered") 
            }
        })
    }
    else if (req.body.action === "assignstaff") {
        var addposition = req.body.addposition;
        var username = req.body.username;
        var useremail = req.body.useremail;
        var contactno = req.body.usermobilenumber;
    
        if (!username || !useremail || !contactno || addposition === 'select' || addposition === 'null' || !addposition) {
            var missingField;
    
            if (!contactno) missingField = "Mobile number";
            else if (!username) missingField = "User Name";
            else if (!useremail) missingField = "User Email";
            else if (!addposition) missingField = "Position";
            else if (addposition) missingField = "Position";
    
            res.send("Please fill the " + missingField + " field.");
            return;
        } else {
            mcon.query("SELECT * FROM users WHERE mobile = '" + contactno + "'", function (err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length > 0) {
                    var userid = result[0].userid;
                    vcon.query("SELECT * FROM staff WHERE userid='" + userid + "' AND orgid <> '" + req.session.orgid + "'", function (err, existingUserResult) {
                        if (err) {
                            console.log(err);
                        } else if (existingUserResult.length > 0) {
                            res.send("User already exists in another organization");
                        } else {
                            mcon.query("SELECT * FROM subscriptions WHERE userid='" + userid + "' AND moduleid=20", function (err, results) {
                                if (err) {
                                    console.log(err);
                                } else if (results.length > 0) {
                                    res.send("User Has Subscription For This Module");
                                } else {
                                    var sql1 = "SELECT * FROM usermaster_t.users WHERE mobile='" + req.body.usermobilenumber + "'";
                                    mcon.query(sql1, function (err, result1) {
                                        if (err) {
                                            console.log(err);
                                        } else if (result1.length > 0) {
                                            var userid = result1[0].userid;
                                            //var userProjectsQuery = "SELECT projectid, position FROM orgusers WHERE userid = '" + userid + "'";
                                            //trcon.query(userProjectsQuery, function (err, userProjectsResult) {
                                                // if (err) {
                                                //     console.log(err);
                                                // } else {
                                                //     var userAlreadyAdded = false;
                                                //     for (var i = 0; i < userProjectsResult.length; i++) {
                                                //         var existingProjectId = userProjectsResult[i].projectid;
                                                //         var existingPosition = userProjectsResult[i].position;
    
                                                //         if (existingProjectId != projectid && existingPosition != addposition) {
                                                //             // User is already added to a different project with a different position
                                                //             userAlreadyAdded = true;
                                                //             break;
                                                //         }
                                                //     }
                                                    // if (userAlreadyAdded) {
                                                    //     res.send("User already assigned to another project with a different position");
                                                    // } else {
                                                        vcon.query("SELECT * FROM staff WHERE userid='" + userid + "' AND orgid = '" + req.session.orgid + "' AND position = '" + addposition + "'", function (err, duplicateCheckResult) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else if (duplicateCheckResult.length > 0) {
                                                                res.send("User is already assigned to this position in the organization");
                                                            } else {
                                                                // Proceed with the insertion since no duplicate is found
                                                                var sql = "INSERT INTO staff (orgid,userid, position,uname ,uemail,ucontactno) VALUES('" + req.session.orgid + "','" + userid + "','" + addposition + "','" + username + "','" + useremail + "','" + contactno + "')";
                                                                vcon.query(sql, function (err, result) {
                                                                    //console.log(sql);
                                                                    if (err) {
                                                                        console.log(err);
                                                                    } else if (result.affectedRows > 0) {
                                                                        res.send("Assign staff");
                                                                    } else {
                                                                        res.send("Assign staff");
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        
                                                   // }
                                               // }
                                          //  });
                                        } else {
                                            res.send("user is already added with a different position");
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.send("Number is not registered in calendaree.com");
                }
            });
        }
    }
    else if(req.body.action==="showstaffreportv"){
        var tbltext = ""
        var sql="select * from videoplayer_t.staff where orgid='"+req.session.orgid+"'";
        vcon.query(sql,function (err,result){
            //console.log(sql)
            if(err)console.log(err)
            else if(result.length>0){ 
                 tbltext = "<table id='report'><tr><th style='width:150px'>Name</th><th style='width:150px'>Contact No</th><th style='width:150px'>Position</th><th>Delete Staff</th></tr>"
                for(var i=0;i<result.length;i++){
                        var name =result[i].uname;
                        var contactno = result[i].ucontactno;
                        var position = result[i].position;
                        tbltext=tbltext+"<tr><td>"+name+"</td><td>"+contactno+"</td><td>"+position+"</td><td button class='qbt' onclick=deletestaffinfo('"+result[i].userid+"');><img src='/static/image/trash.png' style='width:22px;'/></button></td></tr>"
                    }
                    tbltext=tbltext+"</table>"
                    
                    res.send(tbltext)
                }else{
                    res.send("No Record")
                }
        })

    } 
    else if(req.body.action==="deletestaffinfo"){
        var userid = req.body.userid;
        var sql = "DELETE FROM videoplayer_t.staff WHERE userid ='"+userid+"' and orgid='"+req.session.orgid+"';"
        vcon.query(sql,function(err,result1){
            //console.log(sql)
               if(err) console.log(err)
               else{
                       res.send("Staff Deleted")
               }
           })    
       }  
    else if(req.body.action==="retrivloopvalue"){
        var videoid=req.body.videoid;
        var sql="select * from programs where videoid='"+videoid+"';"
        vcon.query(sql,function (err,result){
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].playloop)
                //console.log(arr)
                res.send(arr)
            }
        })
    }    
    else if(req.body.action==="showvideotime"){
        var videoid = req.body.videoid
        var sql="select * from videoplayer_t.programs where videoid='"+videoid+"'";
        vcon.query(sql,function(err,result){
            //console.log(sql)
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].timecount)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("User is not registered") 
            }
        })
    }
    else if (req.body.action === "playvideoontime") {
        var videoid = req.body.videoid;
        var setPlaytime = req.body.setPlaytime;
        let path = "videoplay/" + req.session.orgid;
        var sql = "SELECT * FROM videoplayer_t.programs WHERE videoid='" + videoid + "'";
        vcon.query(sql, function (err, result) {
            if (err) {
            console.log(err);
            res.send('error');
            }else if (result.length > 0) {
                return new Promise((resolve, reject) => {
                    retrivefile(req,res,result[0].videoid,path,req.session.orgid,(successfun) => {
                        resolve(successfun);
                    });
                }).then((data)=>{
                    res.send(data)
                    //console.log(data +"mmm")
                })
            } else {
            res.send('No Video');
            }
        });
    }
 // video setting 
    else if (req.body.action === 'playlistadd') {
        var playlistname = req.body.playlistname;
        var playlistid = uuidv4();
        if (!playlistname || playlistname.trim() === '') {
            res.send("Play List name cannot be null or empty.");
            return;
        }
        var checkDuplicateSql = "SELECT COUNT(*) AS playlistname_count FROM playlist WHERE orgid = '" + req.session.orgid + "' AND playlistname = '" + playlistname + "'";
        vcon.query(checkDuplicateSql, function (err, result) {
            //console.log(checkDuplicateSql)
            if (err) {
            console.log(err);
            res.send("An error occurred.");
            } else {
            if (result[0].playlistname_count > 0) {
                res.send("Duplicate playlist name. playlist name already exists.");
                }else {
                    var insertSql = "INSERT INTO playlist(playlistid,orgid, playlistname) VALUES('" +playlistid+ "','"+req.session.orgid+"', '" + playlistname + "')";
                    vcon.query(insertSql, function (err, result) {
                    //console.log(insertSql)
                    if (err) {
                        console.log(err);
                        res.send("An error occurred while inserting the status.");
                        } else if (result.affectedRows > 0) {
                            res.send("Play List Added");
                        } else {
                            res.send("Insert failed.");
                        }
                    })
                }
            }
        })
    }
    else if(req.body.action==='retriveplaylist'){
        var sql="select * from playlist where orgid = '"+req.session.orgid+"';"
        vcon.query(sql,function(err,result){
            if(err)console.log(err,req)
            else if(result.length>0){
                r = []
                for(i=0;i<result.length;i++){
                    r.push('{"playlistname":"'+result[i].playlistname+'","playlistid":"'+result[i].playlistid+'"}')
                }
            // console.log(r)
                res.send(r)
            }else{
                res.send("retrive status error")
            }
        })
    }
    else if (req.body.action === 'retrivevideol') {
        var sql = "SELECT * FROM playlist WHERE orgid = '" + req.session.orgid + "'";
        vcon.query(sql, function(err, result) {
            if (err) console.log(err, req);
            else if (result.length > 0){
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"playlistname":"' + result[i].playlistname + '","playlistid":"' + result[i].playlistid + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    else if (req.body.action ==='updatevideoinformation'){
        var videoid=req.body.videoid;
        var playloopnumber =req.body.playloopnumber;
        var playvideotime =req.body.playvideotime;
        var sql="update programs set playloop='"+playloopnumber+"',playtime='"+playvideotime+"' where orgid = '"+req.session.orgid+"'and videoid='"+videoid+"'";             
        vcon.query(sql, function (err, result) {
        // console.log(sql)
            if (err) console.log(err)
            if(err)console.log(err)
                else if (result.affectedRows>0)
                {
                    res.send("Update Successfully")
                }else{
                    res.send("down error")
                }    
        })   
    }
    // account status video player
    else if(req.body.action === "getaccountdetailsvideo"){
        var sql ="select * from subscriptions where userid='" + req.session.userid + "' and moduleid=20";
        console.log(sql +" -Account status ") 
        mcon.query(sql, function(err, results){
            if(err) console.log(err) 
            
            else{
                var date_ob = new Date();
                let acc=[];
                let date = new Date(results[0].enddate)
                var diff = date.getTime() - date_ob.getTime()  
                var daydiff = diff / (1000 * 60 * 60 * 24)
                if(daydiff>0){
                    acc.push("Active")
                    let days = Math.round(daydiff)
                    acc.push(days)
                }
                else{
                    acc.push("deactive")
                    let days = 0
                    acc.push(days)
                }
                acc.push(results[0].startdate);
                acc.push(results[0].enddate);
                acc.push(results[0].usedquota);
                acc.push(results[0].quota)
                res.send(acc);
            }       
        })
    }
// delete 
    else if (req.body.action === "deleteplaylist") {
    console.log( "hello ")
        var playlistid = req.body.showplaylistname;
        var sql = "DELETE FROM videoplayer_t.playlist WHERE orgid='" + req.session.orgid + "' AND playlistid='" + playlistid + "'";
        vcon.query(sql, function (err, resultStatus) {
            console.log(sql +" - delete")
            if (err) {
                console.log(err);
            } else {
                res.send(" Play List Deleted")
            }
        });
    }
});
function convertTimeToSeconds(timeString) {
    var [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
function formatDuration(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = Math.round(seconds % 60);
    return (
        (hours < 10 ? '0' : '') + hours +
        ':' +
        (minutes < 10 ? '0' : '') + minutes +
        ':' +
        (remainingSeconds < 10 ? '0' : '') + remainingSeconds
    );
}

app.listen(port,()=>{
    console.log('Server started at  port ${port}')
})


// const optionsssl = {
//     key: fs.readFileSync("/home/cal100/certs/25feb23/cal25feb23.pem"),
//     cert: fs.readFileSync("/home/cal100/certs/25feb23/hostgator.crt"),
// };
// app.listen(55556, () => {
//      console.log(`Server started at  port ${55000}`);
// })
// https.createServer(optionsssl, app).listen(port);

