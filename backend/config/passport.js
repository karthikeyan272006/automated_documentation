const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, emails } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        if (!email) {
            return done(new Error("No email found in Google account"), null);
        }

        try {
            // Check if user exists with googleId
            let user = await User.findOne({ googleId: id });

            if (!user) {
                // Check if user exists with email (hybrid auth)
                user = await User.findOne({ email });

                if (user) {
                    // Update existing user with googleId
                    user.googleId = id;
                    // If fullname is missing or placeholder, update it
                    if (!user.fullname || user.fullname === "Unknown") {
                        user.fullname = displayName;
                    }
                    await user.save();
                } else {
                    // Create new user
                    user = await User.create({
                        fullname: displayName,
                        email: email,
                        googleId: id,
                        role: 'user' // Default role for Google login 
                    });
                }
            }
            return done(null, user);
        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    }
));

// No session storage as per requirements, but passport requires these if not disabled properly
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
