const APIError = require('../rest').APIError;
const {query} = require('../mysql.cfg.js');
const decodeLoginkey = require('../decodeloginkey.js');
const redis = require('../redis')();


var notelist = async (ctx, next) => {
    const loginKey = ctx.request.body.loginKey || '';
    const page = ctx.request.body.page || 1;
    console.log('come in notelist API')
    async function searchNotelist(mid, page) {
        let searchSql = `select * from note_info_tab where mid = ${mid} order by modify_time desc limit ${(page-1)*15},15`;
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
            async function redisGet () {
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
                ctx.rest({
                    code: 10006,
                    msg: '本次登录不合法，请重新登录',
                })
            }
            if (isLegal) {
                let dataList = await searchNotelist(mid, page);
                console.log(dataList);
                if (dataList.length >= 0) {
                    let result = [];
                    for (let i = 0; i < dataList.length; i++) {
                        let tempObj = {};
                        tempObj.tittle = dataList[i].tittle;
                        let respTime = new Date(dataList[i].modify_time);
                        tempObj.time = `${respTime.getFullYear()}-${parseInt(respTime.getMonth()) + 1}-${respTime.getDay()} `;
                        tempObj.nid = dataList[i].nId;
                        result.push(tempObj);
                    }
                    ctx.rest({
                        code: 10001,
                        msg: 'SUCCESS',
                        resultList: result
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
    await respData();
};

module.exports = {
    'POST /note/notelist': notelist
};