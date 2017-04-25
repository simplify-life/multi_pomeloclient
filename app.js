/**
 * Created by Ximena on 2017/4/25.
 */
"use strict";
const Client = require('./PomeloClient');
const gate= {
    host:'127.0.0.1',
    port:4010
};

const c1 = new Client();
const c2 = new Client();
const c3 = new Client();
const c4 = new Client();
const gateRoute = 'gate.gateHandler.queryEntry';
const pomeloConnect = (c,next) => {
    let msg = {cid:10086,uid:Math.ceil(Math.random()*20000)};
     c.pomelo.init(gate, () => {
       c.pomelo.request(gateRoute,msg,(data) => {
            c.pomelo.init(data,() => {
                console.log(msg.uid+'连接成功...');
                if(next) next();
            })
        })
    })
};

pomeloConnect(c1, () => {
   pomeloConnect(c2,()=>{
       pomeloConnect(c3,()=>{
           pomeloConnect(c4)
       })
   });
});
