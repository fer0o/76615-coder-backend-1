const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const { userRepository } = require("../repositories");

const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userRepository.findByIdWithoutPassword(
            jwt_payload.id,
          );

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};

module.exports = initializePassport;
