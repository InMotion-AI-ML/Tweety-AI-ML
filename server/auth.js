import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './models/exerciseModels.js';

dotenv.config();



// Connect to Google API
const googleAPI = new GoogleStrategy({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000',
  scope: ['profile', 'email'],
});



// user table is called "exerciseUsers"




// server.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const app = express();

// Logs people in using google oauth
// FIND/CREATE USERS HERE
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  function (accessToken, refreshToken, profile, done) {
    // You can save the user's profile to the session here
    return done(null, profile);
  }
));


// Serialize user into session (store user profile info)
// Makes it so that a user stays logged in even when navigating to different pages/refreshing the page+
// Generates a unique session ID and stores it as a cookie
passport.serializeUser(function (user, done) {
  done(null, user);
});

// Deserialize user from session (retrieve user profile)
// So that application can find the user in the databvase
// When a request comes in from the user after they've logged in, 
//Passport needs to look up the stored user ID (from the session) 
//and fetch the user's complete profile data from the database
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Use express-session to manage sessions
// looks up the session ID in the cookie
// retrieves session data
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret to sign the session ID cookie
    resave: false, // Don't save session if it's unmodified
    saveUninitialized: true, // Create a session even if the session is new
    cookie: {
      httpOnly: true, // Cookie can't be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: 'lax', // Restrict cookie sending in cross-site requests
      maxAge: 3600000, // 1 hour
      path: '/', // The cookie is available on the entire site
    },
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());


// Define Routes

// Redirect to Google for authentication
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile']
  })
);

// Handle the Google callback and authenticate the user
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home or to a desired page
    res.redirect('/');
  }
);

// Home route to show user profile or logged-in status
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Hello, ${req.user.displayName}!</h1><a href='/logout'>Logout</a>`);
  } else {
    res.send('<h1>Welcome, please <a href="/auth/google">Login with Google</a></h1>');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});