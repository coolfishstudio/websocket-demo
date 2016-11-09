'use strict'

var http = require('http'),
    WebSocketServer = require('websocket').server,
    count = 1;

var Server = function (room, port) {
    // 创建服务
    var server = http.createServer(function (request, response) {
        console.log((new Date()) + ' 收到来自[' + request.url + ']的请求');
        response.writeHead(404);
        response.end();
    });
    // 启动服务
    server.listen(port, function () {
        console.log((new Date()) + ' 服务器已启动，端口号为 ' + port);
    });
    // 监听请求
    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false // 是否自动开启自动连接
    });
    wsServer.on('request', function (request) {
        // 获取连接
        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' 接受连接');
        // 记录到客户端容器内
        room.clients.set(count++, connection);
        // 监听数据
        connection.on('message', function (msg) {
            var data = '';
            // 处理数据
            if (msg.type === 'utf8') {
                console.log('收到的信息:' + msg.utf8Data);
                data = msg.utf8Data;
            } else if (msg.type === 'binary') {
                // 二进制
                console.log('接收二进制消息长度 ' + msg.binaryData.length);
                data = msg.binaryData;
            }
            // 发送数据
            room.pull(data);
        });
        // 监听关闭
        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' 有人离开 ' + connection.remoteAddress);
        });
    });
    return wsServer;
};

module.exports = Server;