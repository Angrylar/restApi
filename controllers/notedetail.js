const APIError = require('../rest').APIError;
const {query} = require('../mysql.cfg.js');
const decodeLoginkey = require('../decodeloginkey.js');
const Redis = require('ioredis');
const redis = new Redis({
    host: '127.0.0.1',//安装好的redis服务器地址
    port: 6379,　//端口
    // prefix: 'sam:',//存诸前缀
    ttl: 60 * 60 * 24,//过期时间
    db: 0
});
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
                let dataList = await searchNotelist(mid, nid);
                console.log(dataList);
                if (dataList.length >= 0) {
                    var resp = {};
                        resp.tittle =  dataList[0].tittle;
                        resp.content = dataList[0].content;

                        redis.get('foo').then(function (result) {
  console.log(result);
});
                    ctx.rest({
                        code: 10001,
                        msg: 'SUCCESS',
                        result: resp
                    })
                } else {
                    APIError();
                }
            }
        }
    }
    await respData();
};

module.exports = {
    'POST /note/notedetail': noteDetail
};