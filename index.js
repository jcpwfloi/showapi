var conf = require('./conf.json');

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getSortFun(order, sortBy) {
    var ordAlpah = (order == 'asc') ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    return sortFun;
}


exports.api = function(url, querystring, callback) {
    var str = '';
    querystring.push({
        'key': 'showapi_timestamp',
        'value': new Date().Format('yyyyMMddhhmmss')
    });
    querystring.push({
        'key': 'showapi_appid',
        'value': conf.appid
    });
    querystring.sort(getSortFun('asc', 'key'));
    for (var i = 0; i < querystring.length; ++ i)
        if (querystring[i].value)
            str += querystring[i].key + querystring[i].value;
    str = str + conf.secret;
    str = (new Buffer(str)).toString('binary');
    str = require('crypto').createHash('md5').update(str).digest('hex');
    var qs = {};
    for (var i = 0; i < querystring.length; ++ i)
        qs[querystring[i].key] = querystring[i].value;
    qs['showapi_sign'] = str;
    require('request')({
        url: url,
        qs: qs,
        method: 'POST',
    }, function(err, res, body) {
        if (body) callback(err, JSON.parse(body));
        else callback(err, {});
    });
}

