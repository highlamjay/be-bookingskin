const AuthRouter = require('./auth-route')
const VerificationRouter = require('./verification-route')

const routes =  (app) => {
    app.use('/api/auth', AuthRouter);
    app.use('/api/verification', VerificationRouter);
}

module.exports = routes;