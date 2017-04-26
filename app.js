/**
 * Created by Ximena on 2017/4/25.
 */
"use strict";
const async = require('async');
const Client = require('./PomeloClient');
const gate= {
    host:'127.0.0.1',
    port:4010
};

const c1 = new Client();
c1.uid = 10001;
const c2 = new Client();
c2.uid = 10002;
const c3 = new Client();
c3.uid = 10003;
const c4 = new Client();
c4.uid = 10004;

const gateRoute = 'gate.gateHandler.queryEntry';
const loginRoute = 'connector.entryHandler.entry';

const pomeloConnect = (c,cb) => {
     c.pomelo.on('io-error',(e)=>{
         console.log(`${c.uid} connection io-error...`);
     });
     c.pomelo.on('close',(e)=>{
         console.log(`${c.uid} connection closed...`);
     });
     async.waterfall([
         (next)=>{
            c.pomelo.init(gate,()=>{
                next(null,gateRoute,{cid:10086,uid:c.uid});
            });
         },
         (rout,msg,next)=>{
            c.pomelo.request(rout,msg,(data)=>{
                next(null,data);
            });
         },
         (data,next)=>{
            c.pomelo.init(data,()=>{
                next(null,{data:data,uid:c.uid});
            })
         }
     ], (err,res) => {
         if(err){
             cb(err,c.uid);
             console.log(`${c.uid}连接失败...`);
             return 0;
         }
         console.log(`${c.uid}连接成功...`);
         login(c);
         cb(err,res);
     });

};

const  login = (c)=>{
    c.pomelo.request(loginRoute,c.uid,(data)=>{
        if(data.code===200){
            console.log(`${c.uid}登录成功...进入${data.msg.deskId}号桌`);
        }else{
            console.log(`${c.uid}登录失败:${data.msg}`);
        }
    });
};


async.series({
    c1:(cb)=>{pomeloConnect(c1,cb)},
    c2:(cb)=>{pomeloConnect(c2,cb)},
    c3:(cb)=>{pomeloConnect(c3,cb)},
    c4:(cb)=>{pomeloConnect(c4,cb)}
},(err,res) =>{
    if(err){
        console.log(err);
        return 0;
    }
    // console.log(`${res.c1.uid}连接到${res.c1.data.host}:${res.c1.data.port}成功...`);
    // console.log(`${res.c2.uid}连接到${res.c2.data.host}:${res.c2.data.port}成功...`);
    // console.log(`${res.c3.uid}连接到${res.c3.data.host}:${res.c3.data.port}成功...`);
    // console.log(`${res.c4.uid}连接到${res.c4.data.host}:${res.c4.data.port}成功...`);
    // login(c1);
    // login(c2);
    // login(c3);
    // login(c4);
});
