// var respObj;
const APIError = require('../rest').APIError;
// const respJson = require('../common.js');
const {query} = require('../mysql.cfg.js');

const encodeLoginkey = require('../encodeloginkey');

var login = async (ctx, next) => {
    var
        accountNo = ctx.request.body.accountNo || '',
        password = ctx.request.body.password || '';

    console.log(`signin with name: ${accountNo}, password: ${password}`);

    async function selectPerson() {
        // let searchSql = 'select * from user_info_tab where account_no = "' + accountNo + '"';
        let searchSql = `select * from user_info_tab where account_no = ${accountNo}`;
        let dataList = await query(searchSql)
        return dataList
    }
    async function getData() {
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(accountNo))) {
            ctx.rest({
                code: 10010,
                msg: '用户名不合法，请输入正确的用户名！'
            })
        } else {
            let dataList = await selectPerson();
            console.log(dataList);
            if (dataList.length > 0) {
                if (accountNo == dataList[0].account_no && password == dataList[0].password) {
                    // respObj.code = '10001';
                    // respObj.msg = 'SUCCESS';
                    // respObj = respJson('10001', 'SUCCESS');
                    // let obj = {'mid':decodeLoginkey(dataList[0].mid)};
                    let beforeLoginKey = {};
                    let mid = dataList[0].mid;
                        beforeLoginKey.mid = JSON.stringify(mid);
                    var loginKey = encodeLoginkey(JSON.stringify(beforeLoginKey));
                    // var loginKey = encodeLoginkey(mid.toString());
                    ctx.rest({
                        code: 10001,
                        msg: 'SUCCESS',
                        result: {
                            loginKey: loginKey
                        }
                    });
                } else {
                    // respObj.code = '10002';
                    // respObj.msg = '用户名或密码错误，请检查后重新输入';
                    // respObj = respJson('10002', '用户名或密码错误，请检查后重新输入');
                    ctx.rest({
                        code: 10002,
                        msg: '用户名或密码错误，请检查后重新输入'
                    });
                }
            } else {
                // respObj.code = '10003';
                // respObj.msg = '该用户不存在';
                respObj = respJson('10003', '该用户不存在');
                ctx.rest({
                    code: 10003,
                    msg: '该用户不存在'
                });
            }
        }
    }
    await getData();
    // ctx.response.type = 'application/json';
    // ctx.response.body = respObj;
};

module.exports = {
    'POST /note/login': login
};