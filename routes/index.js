const dotenv = require('dotenv')
dotenv.config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const fetch = require('node-fetch')

var bodyParser = require('body-parser')
var express = require('express')
var router = express.Router()

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shares' });
});

router.post('/add-address', jsonParser, function(req, res) {
  if (req.body.walletAddress && req.body.contractAddress) {
    fetch('https://meerkat.watch/api/v0/enterprise/subscribe/address', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.MEERKAT_TOKEN
      },
      body: JSON.stringify({
        "address": req.body.walletAddress,
        "currency": "ERC-20:" + req.body.contractAddress,
        "callback": "shares.dwns.io/"
      })
    })
    res.sendFile(__basedir + '/public/index.html')
  } else {
    res.send('Error: missing parameters.')
  }
});

router.post('/', function(req, res) {
  if (req.param('tel')) {
    var telephone = req.param('tel')
    client.messages
      .create({
         body: req.body,
         from: '+17209034061',
         to: '+1' + telephone
       })
      .then(message => console.log(message.sid));
    res.end();
  } else {
    res.send('Error: missing parameters.')
  }
});

module.exports = router;
