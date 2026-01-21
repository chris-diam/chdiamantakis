import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Check if email is already registered
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Create new user
      const username = profile.displayName.replace(/\s+/g, '_').toLowerCase().slice(0, 15) +
                       '_' + Math.random().toString(36).slice(2, 6);

      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: username,
        character: {
          skinColor: Math.floor(Math.random() * 5),
          hairStyle: Math.floor(Math.random() * 5),
          hairColor: Math.floor(Math.random() * 8),
          shirtColor: Math.floor(Math.random() * 10),
          pantsColor: Math.floor(Math.random() * 10),
          hatStyle: -1,
        },
      });

      await user.save();
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

export default passport;
