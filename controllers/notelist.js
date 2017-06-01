const APIError = require('../rest').APIError;
const {query} = require('../mysql.cfg.js');
const decodeLoginkey = require('../decodeloginkey.js');

var notelist = async (ctx, next) => {
    var loginKey = ctx.request.body.loginKey || '';
console.log('come in notelist API')
    async function searchNotelist(mid) {
        let searchSql = `select * from note_info_tab where mid = ${mid}`;
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
            let dataList = await searchNotelist(mid);
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
        }
    }
    await respData();
};

module.exports = {
    'POST /note/notelist': notelist
};