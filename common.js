var jsonMsg = (code, msg) => {

    var jsonObj = {};
        jsonObj.code = code;
        jsonObj.msg = msg;
    return jsonObj;
}

module.exports = jsonMsg;