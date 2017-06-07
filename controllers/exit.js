const APIError = require('../rest').APIError;
const {
    query
} = require('../mysql.cfg.js');
const decodeLoginkey = require('../decodeloginkey.js');
const redis = require('../redis')();


var exit = async(ctx, next) => {
    const loginKey = ctx.request.body.loginKey || '';
    console.log('come in exit API')
    async function respData() {
        var mid = JSON.parse(decodeLoginkey(loginKey)).mid;
        async function redisGet() {
            return redis.set(mid, '');
        }
        var getter = await redisGet();
        ctx.rest({
            code: 10001,
            msg: 'SUCCESS',
        })
        console.log('exit succ');
    }
    await respData();
};

module.exports = {
    'POST /note/exit': exit
};