const express = require('express');
const { json } = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const moment = require('moment');


const { secret } = require('./config').session;
const { connectString } = require('./config').db;
const { domain, clientID, clientSecret } = require('./config').auth0;

const port = 3000;

const connectionString = connectString;

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

 const now = moment().format();
 const currentSunday = moment().day("Sunday").format("YYYY/MM/DD");
 var msecPerMinute = 1000 * 60;  
 var msecPerHour = msecPerMinute * 60;  
 var mpd = msecPerHour * 24;  
 var mpw = mpd * 7;

app.post('/api/goals', (req, res, next)=>{
    let goals = {};
    const db = req.app.get('db');
    db.get_goals([req.body.id]).then(response=>{
        response.map(cur=>{
                //console.log(cur.end_date);
                cur.time_left = (moment(cur.end_date).diff(now, 'weeks', true)).toFixed(1);
                if (cur.time_left < 1.4) {
                    cur.time_left = (moment(cur.end_date).diff(now, 'days')).toFixed(1);
                    if (cur.time_left <= 1){
                        cur.time_left = (moment(cur.end_date).diff(now, 'hours')).toFixed(1) + ' hours left';
                    } else {cur.time_left += ' days left'}
                } else {
                    cur.time_left += ' weeks left';
                }   

            if (cur.time_left === 'NaN days left' || cur.time_left === 'NaN weeks left'){cur.time_left = null};
            if (moment(now).diff(cur.last_log, 'hours')>24){
                cur.logged_today = false;
            }
        });
        goals.exercise = response;
        //console.log(goals);
        db.get_weight([req.body.id]).then(respon=>{
            goals.weight = respon;
        })
  
    db.get_savings_goals([req.body.id]).then(respo=>{
        respo.map(cur=>{
            if (moment(cur.next_log).isAfter(now) === false){
                cur.num_logs+=2;
                cur.next_log = moment(cur.date_created).add(cur.num_logs, 'weeks');
            }
        })
        goals.savings = respo;

    db.get_school_goals([req.body.id]).then(roospoonse=>{
        goals.school = roospoonse;
        db.get_quit_habit([req.body.id]).then(resy=>{
            goals.quit_habit = resy;
            res.json(goals);
        })
      
    })
   
    
   
    });
});
})

app.post('/api/getLogs', (req, res, next)=>{
    const db = req.app.get('db');
    // const currentSunday = moment().day("Sunday").format("YYYY/MM/DD");

    db.get_logs([req.body.id, currentSunday]).then(response=>{
       // console.log(response);
        if (response.length === 0){
            return res.json({dates: [moment(currentSunday).format(), moment(currentSunday).add(1, 'days'), moment(currentSunday).add(2, 'days'), moment(currentSunday).add(3, 'days'), moment(currentSunday).add(4, 'days'), moment(currentSunday).add(5, 'days'), moment(currentSunday).add(6, 'days')]});
        }
        let sunday = null;
        let monday = null;
        let tuesday = null;
        let wednesday = null;
        let thursday = null;
        let friday = null;
        let saturday = null;
        response.map(cur=>{

            if (cur.sunday || cur.sunday === false){
                sunday = cur.sunday;
            } else if (cur.monday || cur.monday === false){
                monday = cur.monday;
            } else if (cur.tuesday || cur.tuesday === false){
                tuesday = cur.tuesday;
            } else if (cur.wednesday || cur.wednesday === false){
                wednesday = cur.wednesday;
            } else if (cur.thursday || cur.thursday === false){
                thursday = cur.thursday;
            } else if (cur.friday || cur.friday === false){
                friday = cur.friday;
            } else if (cur.saturday || cur.saturday === false){
                saturday = cur.saturday;
            }
        });

        res.json({
            log_data: [sunday,monday,tuesday,wednesday,thursday,friday,saturday], 
            dates: [response[0].first_day, moment(response[0].first_day).add(1, 'days'), moment(response[0].first_day).add(2, 'days'), moment(response[0].first_day).add(3, 'days'), moment(response[0].first_day).add(4, 'days'), moment(response[0].first_day).add(5, 'days'), moment(response[0].first_day).add(6, 'days')]
        });
        
    })
});
app.post('/api/getHabitLogs', (req, res, next)=>{
    const db = req.app.get('db');
    // const currentSunday = moment().day("Sunday").format("YYYY/MM/DD");

    db.get_habit_logs([req.body.id, currentSunday]).then(response=>{
        if (response.length === 0){
            return res.json({dates: [moment(currentSunday).format(), moment(currentSunday).add(1, 'days'), moment(currentSunday).add(2, 'days'), moment(currentSunday).add(3, 'days'), moment(currentSunday).add(4, 'days'), moment(currentSunday).add(5, 'days'), moment(currentSunday).add(6, 'days')]});
        }
        let sunday = null;
        let monday = null;
        let tuesday = null;
        let wednesday = null;
        let thursday = null;
        let friday = null;
        let saturday = null;
        response.map(cur=>{

            if (cur.sunday || cur.sunday === false){
                sunday = cur.sunday;
            } else if (cur.monday || cur.monday === false){
                monday = cur.monday;
            } else if (cur.tuesday || cur.tuesday === false){
                tuesday = cur.tuesday;
            } else if (cur.wednesday || cur.wednesday === false){
                wednesday = cur.wednesday;
            } else if (cur.thursday || cur.thursday === false){
                thursday = cur.thursday;
            } else if (cur.friday || cur.friday === false){
                friday = cur.friday;
            } else if (cur.saturday || cur.saturday === false){
                saturday = cur.saturday;
            }
        });
        res.json({
            log_data: [sunday,monday,tuesday,wednesday,thursday,friday,saturday], 
            dates: [response[0].first_day, moment(response[0].first_day).add(1, 'days'), moment(response[0].first_day).add(2, 'days'), moment(response[0].first_day).add(3, 'days'), moment(response[0].first_day).add(4, 'days'), moment(response[0].first_day).add(5, 'days'), moment(response[0].first_day).add(6, 'days')]
        });
        
    })
});

app.post('/api/getHistory', (req, res, next)=>{
    const db = req.app.get('db');
    //console.log(req.body);

    let end = moment(req.body.end_date).format("YYYY/MM/DD");
    let start = moment(req.body.date_created).format("YYYY/MM/DD");
    let numWeeks = Math.ceil((moment(end).toDate().getTime() - moment(start).toDate().getTime())/mpw);
    let numDays = Math.ceil((moment(end).toDate().getTime() - moment(start).toDate().getTime())/mpd);
    let sun = moment(start).day("Sunday").format("YYYY/MM/DD");
    let history = {
        sundays: [sun],
        startDate: start,
        endDate: end,
        numWeeks: numWeeks,
        numDays: numDays
    };
    for (var i=1; i<=numWeeks; i++){
        let newnew = moment(sun).add(i, 'weeks');
        history.sundays.push(moment(newnew).format("YYYY/MM/DD"));
    }

    db.get_history([req.body.goalid, history.sundays[history.sundays.length-1], sun])
    .then(response=>{
        res.json({ log_history: response, history: history });
    })
    
});
app.post('/api/getHabitHistory', (req, res, next)=>{
    const db = req.app.get('db');

    let end = moment(req.body.end_date).format("YYYY/MM/DD");
    let start = moment(req.body.date_created).format("YYYY/MM/DD");
    let numWeeks = Math.ceil((moment(end).toDate().getTime() - moment(start).toDate().getTime())/mpw);
    let numDays = Math.ceil((moment(end).toDate().getTime() - moment(start).toDate().getTime())/mpd);
    let sun = moment(start).day("Sunday").format("YYYY/MM/DD");
    let history = {
        sundays: [sun],
        startDate: start,
        endDate: end,
        numWeeks: numWeeks,
        numDays: numDays
    };
    for (var i=1; i<=numWeeks; i++){
        let newnew = moment(sun).add(i, 'weeks');
        history.sundays.push(moment(newnew).format("YYYY/MM/DD"));
    }

    db.get_habit_history([req.body.goalid, history.sundays[history.sundays.length-1], sun])
    .then(response=>{
        res.json({ log_history: response, history: history });
    })
    
});

app.post('/api/addExerciseGoal', (req, res, next)=>{
    const db = req.app.get('db');
   //console.log(req.body);
    let end_date = moment().add(Number(req.body.numweeks), req.body.wom);
    let nextLog = moment(now).add(1, req.body.wom);
  //console.log(nextLog);
    db.add_goal([req.body.goal, req.body.timesperweek, req.body.wager, req.body.id, moment().format(), end_date, 'week', nextLog, req.body.recipient])
        .then((goals)=>{
            //console.log(goals);
            res.json({goals: goals});
        })
        .catch(err=>{
            console.log(err);
        })
});

app.post('/api/addWeightGoal', (req, res, next)=>{
    const db = req.app.get('db');
    let endDate = moment().add(Number(req.body.numMonths), 'months');
    db.add_weight_goal([req.body.user_id, req.body.curWeight, req.body.goalWeight, moment().format(), endDate, req.body.wager, req.body.recipient])
    res.json('yo');
})

app.post('/api/addSchoolGoal', (req, res, next)=>{
    const db = req.app.get('db');
    console.log(req.body.id);
    db.add_school_goal([req.body.user_id, req.body.goal, moment().format(), req.body.end_date, req.body.wager, req.body.recipient])
    res.json('yo');
})

app.post('/api/addQuitHabitGoal', (req, res, next)=>{
    const db = req.app.get('db');
    var endDate = moment().add(Number(req.body.numMonths), 'months');
    db.add_quit_habit([req.body.goal, req.body.user_id, moment().format(), endDate, req.body.wager, req.body.recipient])
    res.json('yo');
})

app.post('/api/addSavingsGoal', (req, res, next)=>{
    const db = req.app.get('db');
    let friday = moment().day("Friday").format("YYYY/MM/DD");
    let nextLog = moment(friday).add(2, 'weeks');
    
    const end_date = moment(now).add(req.body.endNum, req.body.endInc);
    db.add_savings_goal([req.body.installment_option, req.body.savings_goal, now, end_date, req.body.user_id, req.body.goal, req.body.installment_value, nextLog])
        .then((goals)=>{
            res.json({savingsGoals: goals});
        })
});

app.post('/api/addSavings', (req, res, next)=>{
    const db = req.app.get('db');
    //console.log(req.body.addition);
    db.add_to_savings([req.body.id, req.body.addition]).then(response=>{
        res.json({newsavings: response});
    })
});

app.post('/api/deleteGoal', (req, res, next)=>{
    const db = req.app.get('db');
    requestData = '';
    requestData += req.body;
    //console.log(requestData);
    console.log(req.body[0]);
    db.delete_goal([req.body[0].id]).then(resp=>{
        res.json(resp);
    });
});
app.post('/api/deleteSavingsGoal', (req, res, next)=>{
    const db = req.app.get('db');
    db.delete_savings([req.body.id]).then(response=>{
        res.json(response);
    })
});

app.post('/api/updateProgress', (req, res, next)=>{
    const db = req.app.get('db');
    if (!req.body.comments){
        req.body.comments = 'none';
    }
    db.add_log([req.body.goalid, moment().format(), req.body.sof, req.body.comments, currentSunday]).then(()=>{
    db.update_progress([req.body.goalid, req.body.sof, req.body.value, moment().format()]).then(()=>res.json('yo'))
    });
});

app.post('/api/updateBadHabit', (req, res, next)=>{
    const db = req.app.get('db');
    db.add_bad_habit_log([req.body.goalid, moment().format(), req.body.sof, currentSunday]).then(()=>{
        res.json('yo');
    })
})

app.post('/api/updateDate', (req, res, next)=>{
    const db = req.app.get('db');
   // console.log(req.body);
    if (!req.body.comments){
        req.body.comments = 'none';
    }
    if (moment(req.body.date).format("YYYY/MM/DD") === moment().format("YYYY/MM/DD")) {
        db.add_log([req.body.goalid, req.body.date, req.body.sof, req.body.comments, moment(req.body.date).day("Sunday").format("YYYY/MM/DD")]).then(()=>{
        db.update_progress([req.body.goalid, req.body.sof, req.body.value, moment().format()])
        .then(()=>res.json('yo'))
        });
    } else {
        db.add_log([req.body.goalid, req.body.date, req.body.sof, req.body.comments, moment(req.body.date).day("Sunday").format("YYYY/MM/DD")]).then(()=>{res.json('yo')})
    }
});

app.post('/api/updateWeight', (req, res, next)=>{
    const db = req.app.get('db');
    let last_log = moment().format();
    db.weight_progress([req.body.id, Number(req.body.newWeight), last_log]);
    res.json('gooood');
})

app.post('/api/login', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;
    const db = req.app.get('db');
    db.get_users().then((users)=>{
        const person = users.find(cur=>cur.username == username);
        if (!person) {
            res.send({ validUser: false , reason: 'no user'}).redirect('/login');
            console.log('no user');
        }
        else if (person.password != password) {
            res.send({ validUser: false, reason: 'wrong password'});
            console.log('wrong password');
        }
        req.session.user = person;
        res.send({ validUser: true, user: req.session.user });
    })
});

app.get('/logout', (req, res, next)=>{
    req.session.user = null;
    res.redirect('/');
});

app.post('/api/users/create', (req, res, next)=> {
    const db = req.app.get('db');
   
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    db.createProfile([username, password, firstName, lastName]).then((users)=>{
        res.send(users);
    });
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

// // // remove user from session
// app.get('/auth/logout', (req, res) => {
//     req.session.user = null;
//     res.redirect('/');
// });

// listen on port
app.listen(port, ()=> {
    console.log(`LISTENING ON PORT: ${port}`);
});
