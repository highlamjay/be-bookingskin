const AuthRouter = require('./auth-route')

const routes =  (app) => {
    app.use('/api/auth', AuthRouter);
}

module.exports = routes;