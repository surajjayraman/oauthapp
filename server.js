const express = require('express');
const utils = require('./utils');
const app = express();
const port = 4000;


app.get('/auth', async(req, res) => {
  try {
    console.log(utils.request_get_auth_code_url);
    res.redirect(utils.request_get_auth_code_url);
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

app.get('/api/callback', async(req, res) => {
  // get authorization token from request parameter
  const authorization_token = req.query.code;
  console.log("authorization code",authorization_token);
  try {
    // ! get access token using authorization token
    const response = await utils.get_access_token(authorization_token);
    console.log({data: response.data});
    // get access token from payload
    const {access_token} = response.data;
    console.log("access token:", access_token);
    // get user profile data
    const user = await utils.get_profile_data(access_token);
    //console.log("user:", user);
    const user_data = user.data;
    console.log("user data:", user_data);

    res.send(`
      <h1> welcome ${user_data.email}</h1>
      <img src="${user_data.picture}" alt="user_image" />
    `);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(port);
console.log("Server up and running");