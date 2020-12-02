const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const User = require('../models/User');

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            const hashPassword = bcrypt.hashSync(
              password,
              parseInt(process.env.BCRYPT_ROUNDS) || 12
            );

            // Sacamos los datos de la request que necesitamos para registrar
            const { form1, form2, form3 } = req.body;
            const image = req.file_url || null;

            const { name, phone } = JSON.parse(form1);
            const {
              emergency_name,
              emergency_phone,
              emergency_email,
              insurance,
              policy,
            } = JSON.parse(form2);
            const { allergens } = JSON.parse(form3);

            const newUser = new User({
              name: name,
              email: email,
              password: hashPassword,
              phone: phone,
              image: image,
              allergens,
              emergencyContact: {
                name: emergency_name,
                phone: emergency_phone,
                email: emergency_email,
                insurance: {
                  company: insurance,
                  policy: policy,
                },
              },
            });

            newUser
              .save()
              .then((user) => user.populate('allergens').execPopulate())
              .then(() => done(null, newUser))
              .catch((err) => done(err, null));
          } else {
            throw new Error('User already exists');
          }
        })
        .catch((err) => done(err, null));
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },

    (req, email, password, done) => {
      User.findOne({ email })
        .populate('allergens')
        .then((user) => {
          if (!user) {
            throw new Error('El usuario no existe en la bd');
          }

          const userPassword = user.password;
          const isValidPass = bcrypt.compareSync(password, userPassword);

          if (!isValidPass) {
            throw new Error('la contraseña no es correcta');
          }

          done(null, user);
        })
        .catch((err) => done(err, null));
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/redirect',
    },
    (_accessToken, _refreshToken, profile, done) => {
      // Profile contains out google user data
      const { id: googleId, displayName, name, emails } = profile;
      // User main email is in profile.emails[0]
      const { value: email } = emails[0];

      // Find user with the same googleId and if does not exist create it.
      User.findOne({ email })
        .then((user) => {
          // Create a random password and encrypt it so user field exists
          // const salt = bcrypt.genSaltSync(12)
          const hash = bcrypt.hashSync(uuid(), parseint(process.env.BCRYPT_ROUNDS) || 12);

          // In case user is already in database, log the user with a valid cookie.
          if (!user) {
            const newUser = new User({
              email,
              googleId,
              password: hash,
            });

            newUser.save().then(() => {
              done(null, newUser);
            });
          } else {
            done(null, user);
          }
        })
        .catch((err) => done(err, null));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); //aquí, user.id o user._id da igual
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});
