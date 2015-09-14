# ShowAPI NodeJS SDK 使用方法

## 安装
    npm install sdk-showapi

## 配置
在node\_module下找到sdk-showapi，修改index.js中的conf。

    var conf = {
        appid: '这里填写您的appid',
        secret: '这里填写您的secret'
    };

## 使用
其中res返回的是showapi服务器返回的json
    require('showapi').api(url, [
                {key: '', value: ''},
                {key: '', value: ''}
            ], function(err, res) {
            });
