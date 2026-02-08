const passport = require("passport");
const UserModel = require("../models/User.model");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const initializePassport = () => {
    passport.use(
        "jwt",
        new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (jwt_payload, done) => {
            try {
                //buscamos el usuario por id
                const user = await UserModel.findById(jwt_payload.id).select("-password");
                //si no existe el usuario
                if(!user){
                    return done(null, false);
                }
                //si existe el usuario
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        })
    );
};

module.exports = initializePassport;