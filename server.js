let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

var client_id = 'bd1acdcec11845f89fbb7d04ebd13f70'; // Your client id
var client_secret = '4a18fe860b5f4c09b4185eabbce33657'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: 'user-read-private user-top-read user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        client_id + ':' + client_secret
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

app.get('/try', function(req, res) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer BQAK4a_-6aqX8-GxPhZPVy2715yAqSwU28svgCnt4hknxS4NP6JOk5Wo3KadhD_MMOec4APtgu3-4YEu1gjS699kdWX19fyQlPSBjaokFeQlmiWBJ09DPCKndaeQ41sB-mSv37KZdH7mjF9GrZytdr8-'
  };

  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10&offset=5',
    headers: headers
  };

  function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
      res.send(JSON.stringify(body));
    }
  }
  request(options, callback);

});

let port = 8888

console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)
