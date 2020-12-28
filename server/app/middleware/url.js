module.exports = (options, app) => {
    return async function url(ctx, next) {
        ctx.logger.info('url');
        const invokeEntitys = await ctx.service.redis.get('invokeEntitys');
        const invokeName = ctx.request.url.replace('/invoke/', '');
        const currentEntity = invokeEntitys.find(e => e.name == invokeName);
        ctx.request.body = {
            baseUrl: app.config.systemInfo.find(s => s.systemId == currentEntity.systemId).url,
            ...ctx.request.body 
        };
        await next();
    };
};