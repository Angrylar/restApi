const APIError = require('../rest').APIError;
const { query } = require('../mysql.cfg.js');

var showLogs = async (ctx, next) => {
    var id = ctx.request.body.id || '';

    console.log('come in showLogs API');

    async function showLog(id) {
        let showLogSql = `select * from logger where id = ("${id}");`;
        console.log(showLogSql);
        let dataList = await query(showLogSql);
        return dataList;
    }
    async function respData() {
        let data = await showLog(id);
        ctx.rest({
            code: 10001,
            msg: 'SUCCESS',
            result: data
        });
    }
    await respData();
};

module.exports = {
    'POST /note/showLogs': showLogs
};