## web-socket

使用方式
node test/test.js

在控制台执行
```
var client = new WebSocket('ws://127.0.0.1:8800', 'echo-protocol');
client.onmessage = function (ret) {
    console.log("msg in: %s", ret.data);
}
```

发送数据
```
client.send('内容')
```