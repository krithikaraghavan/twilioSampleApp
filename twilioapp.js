var express = require('express');
var twilioClient = require('twilio');
var http = require('http');
var accountSid = 'AC93f2920dcda1cf4e3048eb95d3dbb6cc'; 
var authToken = 'f0f83955e63cffc7d451e0ed3d5c1834'; 
 

var port = Number(process.env.PORT || 5000);
var app	= express();
// Create the server
var server = http.createServer(app);
//require the Twilio module and create a REST client 
var restClient = twilioClient(accountSid, authToken);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//app.post('/call', function(req,res){
//	res.render('stooges', {stooge: null});
//}); 

app.get('/', function(req, res){
	res.render('home');
});

app.listen(port);
console.log('listening on port: '+ port);