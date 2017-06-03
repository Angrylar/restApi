const APIError = require('../rest').APIError;
const { query } = require('../mysql.cfg.js');
const decodeLoginkey = require('../decodeloginkey.js');
const redis = require('../redis')();

var refreshcontent = async (ctx, next) => {
    var loginKey = ctx.request.body.loginKey || '';
    var nid = ctx.request.body.nid || '';
    var tittle = ctx.request.body.tittle || '';
    var reqContent = ctx.request.body.content || '';
    
    console.log('come in refreshcontent API');

    async function refreshNote(ti, con, mid, nid) {
        let refreshSql = `update note_info_tab set tittle='${ti}' , content='${con}' where mid='${mid}' and nId='${nid}';`;
        console.log(refreshSql);
        let dataList = await query(refreshSql);
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
                APIError();
            }
            if (isLegal) {
                let data = await refreshNote(tittle, reqContent, mid, nid);
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
    'POST /note/refreshcontent': refreshcontent
};