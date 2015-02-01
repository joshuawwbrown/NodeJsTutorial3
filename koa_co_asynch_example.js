// Packages
var koa = require('koa');
var co = require('co');
var thunkify = require('thunkify');
var request = thunkify(require('request')); // Turn old-school "request" into a thunkified version
 
var lookupServiceUrl = 'http://freegeoip.net/json/';
var serverPort  = 1337;
 
var app = koa();
 
// logger
app.use(function *(next){
  var start = new Date();
  yield next;
  var elapsed = (new Date()) - start;
  console.log('%s %s %s - %sms', start, this.method, this.originalUrl, elapsed);
});
 
// Geo Append the Client Ip and return
 
app.use(function *(){
 
  // Get the remote IP Address
  var clientIp = this.request.ip;
  this.body = 'Your IP address is ' + clientIp;
 
  // Co does the OPPOSITE of yield.
  // Co will return control immediately--it won't execute YET, but will be scheduled fot he next IO wait
  co(function *() {
    // After our web request is done, this generator function CO will be invoked
    var result = yield request(lookupServiceUrl + '' + clientIp); // And THEN this YIELD will wait!
    var geoData = JSON.parse(result[1]);
    console.log(geoData); 
  })(); // <-- INVOKE the co after making it, very important!
 
});
 
app.listen(serverPort);
console.log("KOA SERVER: Listening on port " + serverPort);
