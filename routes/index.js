const AuthRouter = require('./auth-route')
const VerificationRouter = require('./verification-route')
const ProductRouter = require('./product-route')

const routes =  (app) => {
    app.use('/api/auth', AuthRouter);
    app.use('/api/verification', VerificationRouter);
    app.use('/api/product', ProductRouter);
}

module.exports = routes;