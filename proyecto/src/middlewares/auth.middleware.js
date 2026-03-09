const passport = require("passport");

const authenticateCurrent = (req, res, next) => {
    passport.authenticate("current", { session: false }, (error, user) => {
        if (error) return next(error);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "No autenticado",
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: "error",
            message: "No autenticado",
        });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            status: "error",
            message: "No autorizado para este recurso",
        });
    }
    next();
};
const authorizeCartOwner = (req, res, next) => {
    //Admin puede acceder a cualquier carrito
    if(req.user.role === "admin"){
        return next()
    } 

    const { cid } = req.params;

// req.user.cart puede venir como ObjectId, string o objeto poblado
const userCartId = String(req.user?.cart?._id || req.user?.cart || "");

if (!cid || !userCartId) {
    return res.status(403).json({
        status: "error",
        message: "No autorizado para este carrito",
    });
}

if (userCartId !== String(cid)) {
    return res.status(403).json({
        status: "error",
        message: "No autorizado para operar este carrito",
    });
}
next();
};

module.exports = { authenticateCurrent, authorizeRoles, authorizeCartOwner };
