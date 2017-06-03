const APIError = require('../rest').APIError;
const {
    query
} = require('../mysql.cfg.js');
const decodeLoginkey = require('../decodeloginkey.js');
const redis = require('../redis')();

var editcontent = async(ctx, next) => {
    var loginKey = ctx.request.body.loginKey || '';
    var tittle = ctx.request.body.tittle || '';
    var content = ctx.request.body.content || '';
    console.log('come in editcontent API')
    async function insertNote(a, b, c) {
        let searchSql = `insert into note_info_tab (mid,tittle,content) values (${a},${b},${c});`;
        let dataList = await query(searchSql);
        return dataList;
    }
    async function respData() {
        if (loginKey == '') {
            ctx.rest({
                code: 10005,
                msg: '缺少loginKey,请先登录。'
            })
        } else {
            var mid = JSON.parse(decodeLoginkey(loginKey)).mid;
            var isLegal = false;
            async function redisGet() {
                return redis.get(mid)
            }
            var getter = await redisGet();
            if (getter) {
                if (JSON.parse(getter).loginKey == loginKey) {
                    isLegal = true;
                } else {
                    isLegal = false;
                }
            } else {
                ctx.rest({
                    code: 10006,
                    msg: '本次登录不合法，请重新登录',
                })
            }
            if (isLegal) {
                let data = await insertNote(mid, tittle, content);
                console.log('done')
                ctx.rest({
                    code: 10001,
                    msg: 'SUCCESS'
                });
            } else {
                ctx.rest({
                    code: 10006,
                    msg: '本次登录不合法，请重新登录',
                })
            }
        }
    }
    await respData();
};

module.exports = {
    'POST /note/editcontent': editcontent
};