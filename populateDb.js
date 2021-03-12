#! /usr/bin/env node

console.log('This script populates your database. With your specified database as argument');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Post = require('./models/postModel')
var User = require('./models/userModel')
var Comment = require('./models/commentsModel')
const bcrypt = require("bcryptjs");


var date = Date.now();


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var posts = []
var users = []
var comments = []

function postCreate(title, body, timestamp, status, cb) {
  postdetail = {title , body, timestamp, status }

  var post = new Post(postdetail);

  post.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Post: ' + post);
    posts.push(post)
    cb(null, post)
  }  );
}

function userCreate(username, password, status, cb) {

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    // if err, do something
    if (err) {
      console.log(err)
      return
    }

    userdetail = {
      username,
      password: hashedPassword,
      status }

    var user = new User(userdetail);

    user.save(function (err) {
      if (err) {
        cb(err, null);
        return;
    }
      console.log('New User: ' + user);
      users.push(user)
      cb(null, user);
    });
  }) 

}

function commentCreate(title, body, user, timestamp, post, cb) {
  commentdetail = {
    title,
    body,
    user,
    timestamp,
    post
  }

  var comment = new Comment(commentdetail);
  comment.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Comment: ' + comment);
    comments.push(comment)
    cb(null, comment)
  }  );
}


function createPosts(cb) {
    async.series([
        function(callback) {
          postCreate('Filler post 1', 'This is the body of filler post 1', date, 'active', callback);
        },
        function(callback) {
            postCreate('Filler post 2', 'This is the body of filler post 2', date, 'inactive', callback);
        },
        function(callback) {
            postCreate('Filler post 3', 'This is the body of filler post 3', date, 'active', callback);
        },
        function(callback) {
            postCreate('Filler post 4', 'This is the body of filler post 4', date, 'inactive', callback);
        },
        function(callback) {
            postCreate('Filler post 5', 'This is the body of filler post 5', date, 'active', callback);
        },
        function(callback) {
            postCreate('Filler post 6', 'This is the body of filler post 6', date, 'active', callback);
        }
        ],
        // optional callback
        cb);
}

function createUsers(cb) {
    async.series([
        function(callback) {
            userCreate('admin', 'admin','admin', callback)
            
        },
        function(callback) {
            userCreate('user1', 'user1','regular', callback)
        },
        function(callback) {
            userCreate('user2', 'user2','regular', callback)
        },
        function(callback) {
            userCreate('user3', 'user3','regular', callback)
        }

    ],
    cb)
}


function createComments(cb) {
    async.parallel([
        function(callback) {
          commentCreate('Test Comment 3', 'Summary of test book 3', users[1], date, posts[0], callback);
        },
        function(callback) {
          commentCreate('Test Comment 4', 'Summary of test book 4', users[2], date, posts[0], callback);
        },
        function(callback) {
          commentCreate('Test Comment 5', 'Summary of test book 5',  users[1], date, posts[1], callback);
        },
        function(callback) {
          commentCreate('Test Comment 7', 'Summary of test book 7',  users[3], date, posts[1], callback);
        },
        function(callback) {
          commentCreate('Test Comment 6', 'Summary of test book 6',  users[1], date, posts[2], callback);
        },
        function(callback) {
          commentCreate('Test Comment 1', 'Summary of test book 1',  users[1], date, posts[0], callback);
        },
        function(callback) {
          commentCreate('Test Comment 2', 'Summary of test book 2',  users[1], date, posts[0], callback)
        }
        ],
        // optional callback
        cb);
}







async.series([
    createPosts,
    createUsers,
    createComments
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
