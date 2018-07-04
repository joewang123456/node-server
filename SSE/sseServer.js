/**
 * SSE 服务端代码
 */
var express = require('express');
var app = express();
app.get('/chat', function (req, res) {
    var count = 3;
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": '*',
    });
    res.write("retry: 10000\n");
    // 如果不指定 event，其默认为 "message"，即客户端需要监听的事件名称
    res.write('event: init\n');
    res.write('data: 初始化成功...\n\n');
    res.flushHeaders();
    var interval = setInterval(function () {
        if (--count < 0) {
            res.write('event: close\n');
            res.write("data: end\n\n");
            res.flushHeaders();
        } else {
            var score = Math.floor(Math.random() * 10000);
            res.write('event: update\n');
            res.write('data: {"score":' + score + ',"count":' + count + '}\n\n');
            res.flushHeaders();
        }
    }, 1000);

    //当客户端调用EventSource 的close方法触发
    req.connection.addListener("close", function () {
        console.log('客户端已经断开连接...');
        clearInterval(interval);
    }, false);
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})