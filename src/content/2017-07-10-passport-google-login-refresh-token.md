---
layout: post
title: Passport Google Login and the Refresh Token
date: '2017-07-10'
categories: ['passport-js', 'google-login']
comments: true
description: How to handle the refresh token with Google Passport Login
image: "../images/token.jpg"
featured_image: "../images/token.jpg"
featured_image_max_width: 300px
---


Tutorials can be such a pain. On the one hand, they can be great for getting started with a new technology, but quickly you realize that you need to do more than the tutorial shows. That's when the Googling starts!

<iframe src="https://giphy.com/embed/g8GfH3i5F0hby" width="384" height="272" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/frustrated-keyboard-g8GfH3i5F0hby"></a></p>


I encountered this when building [whendidiwork](https://whendidiwork.com), an Express app using Passport and the Google Oauth strategy. I could successfully login and receive the access and refresh tokens, but how to monitor the expiration time of the token and make the exchange when the time comes? 

In this app I used passport to handle authentication, and for my api calls I utilize the [googleapis](https://www.npmjs.com/package/googleapis) library. This library has a method for manually refreshing a token. So I set up route middleware that checks the expiry time against the current time, and if there is less than 5 minutes left, the token is refreshed and then saved to the database. 

So how did I get the expiry time of the access token? It turns out that if you pass the `params`parameter to the passport strategy callback, you will receive an object that looks like this.

```javascript
params = {
  access_token: 'Long_string',
  token_type: 'Bearer',
  expires_in: 3599, // seconds
  id_token: 'Longer_string'
}
```

From this you can calculate the expiry time and save it to the database. 

```javascript
// passport-google-strategy.js

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true 
  },
  function(req, accessToken, refreshToken, params, profile, done) {
    /*
      params = { 
        access_token: 'Long_string',
        token_type: 'Bearer',
        expires_in: 3599, // seconds
        id_token: 'Longer_string'
      }
    */
  
    // find expiry_date so it can be save in the database, along with access and refresh token
    const expiry_date = moment().add(params.expires_in, "s").format("X");
      ...
    }
))
```

Here is the code for the route middleware. Remember to always call `next()` when it is time to go on to the next step.

```javascript
// token-validator.js

const User = require("../models/users.js");
const google = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const auth = require("./auth");
const moment = require("moment");

// create auth client
const oauth2Client = new OAuth2(
  auth.googleAuth.clientID,
  auth.googleAuth.clientSecret,
  auth.googleAuth.callbackURL
);

exports.checkToken = (req, res, next) => {
  // check for user
  if (!req.user) {
    return next();
  }
  // subtract current time from stored expiry_date and see if less than 5 minutes (300s) remain
  if (moment().subtract(req.user.google.expiry_date, "s").format("X") > -300) {
    
    // set the current users access and refresh token
    oauth2Client.setCredentials({
      access_token: req.user.google.token,
      refresh_token: req.user.google.refreshToken
    });

     // request a new token
    oauth2Client.refreshAccessToken(function(err, tokens) {
      if (err) return next(err);
      
      //save the new token and expiry_date
      User.findOneAndUpdate(
        { "google.id": req.user.google.id },
        {
          "google.token": tokens.access_token,
          "google.expiry_date": tokens.expiry_date
        },
        {
          new: true,
          runValidators: true
        },
        function(err, doc) {
          if (err) return next(err);
          next();
        }
      );
    });
  }
  next();
};
```


The last step is to tell the router to use the middleware that we just created.

```javascript
// api-routes.js

const { checkToken } = require("../services/token-validator");

// create the router
const apiRouter = express.Router();

// tell the router to use checkToken function
apiRouter.use(checkToken);

// create routes
const routes = () => {
  apiRouter.route("/user").get(ApiController.getUser);

  ...

  return apiRouter;
};

module.exports = routes;
```


Now the token will be checked for expiration on every route on which the middleware is used.

The full source code from which I pulled this example can be found here in the [<i class="fab fa-github"></i> whendidiwork-react repo](https://github.com/blehr/whendidiwork-react). If you have any questions, or have found a better way of going about this, feel free to let me know. 



