module.exports = {
    APIError: function (code, message) {
        this.code = code || 'UNKONW_ERR';
        this.message = message || 'UNKONW_ERR';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/note/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (e) {
                    console.log('Process API error...');
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'UNKONW_ERR',
                        message: e.message || 'UNKONW_ERR'
                    };
                }
            } else {
                await next();
            }
        };
    }
};
