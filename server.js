const express = require('express');
const { json } = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const { secret } = require('./config').session;
const { dbUser, dbPass, db } = require('./config').db;
const { domain, clientID, clientSecret } = require('./config').auth0;

const port = 3000;

const connectionString = `postgres://${dbUser}:${dbPass}@localhost/${db}`;

const app = express();

app.use(json());
app.use(cors());
app.use(express.static(`${__dirname}/public`));

massive(connectionString).then(db=>app.set('db', db));

app.use(session({
    secret,
    resave: true,
    saveUninitialized: true
}));

// setting up passport
// app.use(passport.initialize());
// app.use(passport.session());

// // using passport to access auth0
// // { domain: config.auth0.domain ... etc}
// passport.use(new Auth0Strategy({
//     domain,
//     clientID,
//     clientSecret,
//     callbackURL:  '/auth/callback'
//    }, (accessToken, refreshToken, extraParams, profile, done) => {
//      //Find user in database
//      console.log(profile);
//      const db = app.get('db');
//      // .then means this is a promise
//      db.getUserByAuthId([profile.id]).then((user, err) => {
//          console.log('INITIAL: ', user);
//        if (!user[0]) { //if there isn't a user, we'll create one!
//          console.log('CREATING USER');
//          db.createUserByAuth([profile.displayName, profile.id]).then((user, err) => {
//            console.log('USER CREATED', user[0]);
//            return done(err, user[0]); // GOES TO SERIALIZE USER
//          })
//        } else { //when we find the user, return it
//          console.log('FOUND USER', user[0]);
//          return done(err, user[0]);
//        }
//      });
//    }
//  ));

//  // put user on session
//  passport.serializeUser((user, done) => {
//      console.log(user);
//      done(null, user);
//  });

//  // pull user from session for manipulation
//  passport.deserializeUser((user, done) => {
//      console.log(user);
//      done(null, user);
//  });


 // General Endpoints
app.get('/api/test', (req, res, next) => {
    req.app.get('db').get_users().then(response => {
        res.json(response);
    });
});
app.post('/api/goals', (req, res, next)=>{
    console.log(req.body);
    req.app.get('db').get_goals([req.body.id]).then(response=>{
        res.json(response);
    })
})

app.post('/api/users/create', (req, res, next)=> {
    const db = req.app.get('db');
   
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    db.createProfile([username, password, firstName, lastName]).then((users)=>{
        console.log(users);
        res.send(users);
    });
});

app.post('/api/addGoal', (req, res, next)=>{
const db = req.app.get('db');
db.add_goal([req.body.goal, req.body.timesperweek, req.body.wager, req.body.id])
    .then((goals)=>{
        console.log(goals);
        res.json(goals);
    })
    .catch(err=>{
        console.log(err);
    })
});
app.post('/api/login', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;
    const db = req.app.get('db');
    db.get_users().then((users)=>{
        const person = users.find(cur=>cur.username == username);
        if (!person) {
            res.send({ validUser: false}).redirect('/login');
            console.log('no user');
        }
        else if (person.password != password) {
            res.send({ validUser: false});
            console.log('wrong password');
        }
        req.session.user = person;
        res.send({ validUser: true});
    })
});


// auth endpoints

// initial endpoint to fire off login
// app.get('/auth', passport.authenticate('auth0'));

// // redirect to home and use the resolve to catch the user
// app.get('/auth/callback',
//     passport.authenticate('auth0', { successRedirect: '/' }), (req, res) => {
//         res.status(200).json(req.user);
// });

// // if not logged in, send error message and catch in resolve
// // else send user
app.get('/auth/me', (req, res) => {
    if (!req.session.user) return res.status(401).json({err: 'User Not Authenticated'});
    res.status(200).json(req.session.user);
});

// // remove user from session
app.get('/auth/logout', (req, res) => {
    req.session.user = null;
    res.redirect('/');
});

// listen on port
app.listen(port, ()=> {
    console.log(`LISTENING ON PORT: ${port}`);
});
