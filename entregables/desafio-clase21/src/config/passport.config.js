import passport from "passport";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";

const GITHUB_CLIENT_ID = "25e2b21124ef30370dac";
const GITHUB_CLIENT_SECRET = "b7433158c0877bda3bff1b07568a2ed05625be4c";

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/github/callback",
      },
      async (accesToken, refreshToken, profile, done) => {
        // console.log(profile);
        try {
          let user = await userModel.findOne({ email: profile._json?.email });

          if (!user) {
            let addNewUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: 0,
              password: "",
            };

            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });
};

export default initializePassport;
