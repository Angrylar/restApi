const APIError = require('../rest').APIError;
const {query} = require('../mysql.cfg.js');


var register = async (ctx, next) => {
    var
        accountNo = ctx.request.body.accountNo || '',
        password = ctx.request.body.password || '';

    console.log(`signin with name: ${accountNo}, password: ${password}`);

    async function selectPerson() {
        // let searchSql = 'select * from user_info_tab where account_no = "' + accountNo + '"';
        let searchSql = `select * from user_info_tab where account_no = ${accountNo}`;
        let dataList = await query(searchSql);
        return dataList;
    }
    async function createPerson() {
        let createUserSql = `insert into user_info_tab (account_no,password) values (${accountNo},${password});`;
        let dataList = await query(createUserSql);
        return dataList;
    }
    async function respData() {
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(accountNo))) {
            ctx.rest({
                code: 10010,
                msg: '用户名不合法，请输入正确的用户名！'
            })
        } else {
            let dataList = await selectPerson();
            console.log(`wtf${JSON.stringify(dataList)}`);
            if (dataList.length > 0) {
                console.log('用户已存在！')
                ctx.rest({
                    code: 10004,
                    msg: '用户已存在，请重新注册！'
                })
            } else {
                let data = await createPerson();
                console.log('创建用户成功！');
                ctx.rest({
                    code: 10001,
                    msg: '恭喜你，注册成功！'
                })
            }
        }


    }
    await respData();
};

module.exports = {
    'POST /note/registe': register
};