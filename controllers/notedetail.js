const APIError = require('../rest').APIError;
const {query} = require('../mysql.cfg.js');
const decodeLoginkey = require('../decodeloginkey.js');
const redis = require('../redis')();

var noteDetail = async (ctx, next) => {
    var loginKey = ctx.request.body.loginKey || '';
    var nid = ctx.request.body.nid || '';
    console.log('come in noteDetail API')
    async function searchNotelist(mid, nid) {
        let searchSql = `select * from note_info_tab where mid = ${mid} and nid = ${nid}`;
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
            if (nid == '') {
                ctx.rest({
                    code: 10011,
                    msg: '缺少nid,前端需要传过来nid。'
                })
            } else {
                var mid = JSON.parse(decodeLoginkey(loginKey)).mid;
                console.log(mid);
                console.log(nid);

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
                    console.log(getter)
                } else {
                    APIError();
                }
                if (isLegal) {
                    let dataList = await searchNotelist(mid, nid);
                    console.log(dataList);
                    if (dataList.length >= 0) {
                        var resp = {};
                        resp.tittle = dataList[0].tittle;
                        resp.content = dataList[0].content;

                        ctx.rest({
                            code: 10001,
                            msg: 'SUCCESS',
                            result: resp
                        })
                    } else {
                        APIError();
                    }
                } else {
                    ctx.rest({
                        code: 10006,
                        msg: '本次登录不合法，请重新登录',
                    })
                }
            }
        }
    }
    await respData();
};

module.exports = {
    'POST /note/notedetail': noteDetail
};