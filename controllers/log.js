const APIError = require('../rest').APIError;
const { query } = require('../mysql.cfg.js');

var insertLog = async (ctx, next) => {
    var log = ctx.request.body.log || '';

    console.log('come in refreshcontent API');

    async function setLog(logger) {
        let setLogSql = `insert into logger (logger) values ("${logger}");`;
        console.log(setLogSql);
        let dataList = await query(setLogSql);
        return dataList;
    }
    async function respData() {
        let data = await setLog(log);
        ctx.rest({
            code: 10001,
            msg: 'SUCCESS'
        });
    }
    await respData();
};

module.exports = {
    'POST /note/insertLog': insertLog
};