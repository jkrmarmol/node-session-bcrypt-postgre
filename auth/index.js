const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const store = session.MemoryStore();
const { compareHash } = require('./bcrypt');
const { findUsername, findPasswordByUsername, getIDByUsernamePassword, getInfoByID, registerUser, updatePasswordById, deleteUserByID } = require('../database');
const auth = express.Router();

auth.use(express.json())

auth.use(session({
  secret: 'ku1234ad',
  cookie: {
    maxAge: 3600000,
    secure: false,
    sameSite: 'none'
  },
  resave: false,
  saveUninitialized: false,
  store
}))

auth.use(passport.initialize());
auth.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (id, done) => {
  done(null, await getInfoByID(id))
})

passport.use(new LocalStrategy(
  async function (username, password, done) {
    if (username === await findUsername(username)) {
      if (await compareHash(password, await findPasswordByUsername(username))) {
        done(null, await getIDByUsernamePassword(username, await findPasswordByUsername(username)))
      } else {
        done(null, false)
      }
    } else {
      done(null, false)
    }
  }
))

auth.get('/login', (req, res, next) => {
  res.send('please use post request to login')
})

auth.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/dashboard');
});

auth.post('/register', async (req, res, next) => {
  try {
    const { id, username, password } = req.body;
    res.status(201).send(await registerUser(id, username, password))
  } catch (err) {
    console.log(err)
  }
});

auth.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  res.status(200).json(await updatePasswordById(password, id))
})

auth.delete('/:id', async(req, res, next) => {
  const { id } = req.params;
  res.status(204).json(await deleteUserByID(id))
});



module.exports = auth;