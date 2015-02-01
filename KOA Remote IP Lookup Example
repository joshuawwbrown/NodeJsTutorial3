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
 
	// Yield magically waits for it to finish! Look ma, no callback!
	var result = yield request(lookupServiceUrl + '' + clientIp);
 
	// Format it as some simple html
	var geoData = JSON.parse(result[1]);
	var myBody = '<html><head><title>'+ clientIp + '</title></head><body><pre>';
	Object.keys(geoData).forEach(function (key) {
		myBody = myBody + '' + key + ': ' + (geoData[key] || '') + '\n';
	});
	myBody = myBody + '</pre></body></html>';
 
  this.body = myBody;
 
});
 
app.listen(serverPort);
console.log("KOA SERVER: Listening on port " + serverPort);
