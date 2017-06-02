const Redis = require('ioredis');
const redis = new Redis({
    host: '127.0.0.1',//安装好的redis服务器地址
    port: 6379,　//端口
    // prefix: 'sam:',//存诸前缀
    ttl: 60 * 60 * 24,//过期时间
    db: 0
});

module.exports = function () {
    return redis;
}

// redis.set('foo', 'pong');
// redis.get('foo', function (err, result) {
//   console.log(result);
// });
// // Or using a promise if the last argument isn't a function
// redis.get('foo').then(function (result) {
//   console.log(result);
// });