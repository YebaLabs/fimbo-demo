const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "publicweb/fimbo-demo/public")));

// Signup Route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email || !phone) {
    res.redirect("/fail.html");
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: phone,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  fetch(`https://us1.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}`, {
    method: "POST",
    headers: {
      Authorization: `auth ${MAILCHIMP_API_KEY}`,
    },
    body: postData,
  })
    .then(
      res.statusCode === 200
        ? res.redirect("/success.html")
        : res.redirect("/fail.html")
    )
    .catch((err) => console.log(err));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
