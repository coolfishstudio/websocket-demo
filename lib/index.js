'use strict';

var Server = require('./server');

var room = function (port) {
    var _this = this;

    // 存放客户端的容器
    _this.clients = new Map();
    // 已发送的数据
    _this.content = [];
    // 需要发送到其他客户端的数据
    _this.forward = [];

    // 启动服务
    _this.server = new Server(_this, (port || 8080));
    // 接受数据
    _this.pull = function (msg) {
        // 记录数据
        _this.content.push(msg);
        // 触发发送数据事件
        _this.push(msg);
    };
    // 发送数据
    _this.push = function (msg) {
        // 对每一个客户端进行发送数据
        _this.clients.forEach(function (conn, id) {
            // 发送数据
            conn.send(msg);
        });
    };
};

module.exports = room;