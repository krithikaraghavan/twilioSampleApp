var express = require('express');
var twilioClient = require('twilio')
var accountSid = 'AC93f2920dcda1cf4e3048eb95d3dbb6cc'; 
var authToken = 'f0f83955e63cffc7d451e0ed3d5c1834'; 
 
var app	= express();
//require the Twilio module and create a REST client 
var restClient = twilioClient(accountSid, authToken);

app.get('/stooges/*?', function(req,res){
	res.render('stooges', {stooge: null});
}); 
var port = 8010;
app.listen(port);
console.log('listening on port: '+ port);