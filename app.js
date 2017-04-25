/**
 * Created by Ximena on 2017/4/25.
 */

Client = require('./PomeloClient');

var gate= {
    host:'127.0.0.1',
    port:4010
};

var c1 = new Client();
var c2 = new Client();
var gateRoute = 'gate.gateHandler.queryEntry';

c1.pomelo.init(gate,function () {
   c1.pomelo.request(gateRoute,{cid:10086,uid:10000},function (data) {
       console.log(data);
       c1.pomelo.init(data,function () {
           console.log('c1连接成功...');
            c2.pomelo.init(gate,function () {
                c2.pomelo.request(gateRoute,{cid:10086,uid:10001},function (data) {
                    c2.pomelo.init(data,function () {
                        console.log('c2连接成功...');
                    });
                })
            });
       })
   });
});
