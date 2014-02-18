var express = require('express');
var twilioClient = require('twilio');
var http = require('http');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var _ = require("underscore");

//var accountSid = 'AC93f2920dcda1cf4e3048eb95d3dbb6cc'; 
//var authToken = 'f0f83955e63cffc7d451e0ed3d5c1834'; 
var accountSid = 'ACf9c60dc6bfb2158b8956fb08b8f8d264';
var authToken = '93ec72a835d8e838ef96ba67f4db3ab9'
 
mongoose.connect(process.env.MONGOHQ_URL);

var port = Number(process.env.PORT || 5000);
var app	= express();
// Create the server
var server = http.createServer(app);
//require the Twilio module and create a REST client 
var restClient = new twilioClient(accountSid, authToken);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var twilioResponseSchema = new Schema({

	fromUrl : 'String',
	type : 'String',
	Info: 'String'

});


TwilioResponseMongoose = mongoose.model('twilioresponse', twilioResponseSchema);
//https://api.twilio.com/2010-04-01

app.get('/callPhone', function(req,res){
	
	
	var response = '';
	client.calls.create({
	to: "+18623715460",
	from: "+18627728551",
	url: "http://kia-twilio.herokuapp.com/voice",
	IfMachine: 'Hangup'
	}, function(err, call) {
		response = '{response: call phone done ' + call.sid + '}';
		console.log(response);
		var newtwilioresponse = new TwilioResponseMongoose({
		fromUrl: '/callPhone',
		type: 'Create call response',
		Info: call.nodeClientResponse.body.toJSON()
		});

		newtwilioresponse.save(function(err){
		if (err) {
			res.send(500, 'callphone response is not saved');
		}
		else {
			console.log('callphone response is saved');
		}
		});

	});
	res.send(response.toJSON());
});


app.post('/voice', function(req, res){

var twiml = new twilioClient.TwimlResponse();
twiml.say('Please hold while Gig zolo connects you to a conference with the other party.')
.dial({action:'/handleLeaveConference', method:'POST', hangupOnStar:'true' }, function(){
	this.conference('test conference');
});  

client.calls.create({
	url: "http://kia-twilio.herokuapp.com/enterConference",
	to: "+19734830181",//"+18623715460",
	from: "+18627728551",
	IfMachine: 'Hangup'
}, function(err, call){
	
	var newtwilioresponse = new TwilioResponseMongoose({
	fromUrl: '/voice',
	type: 'Create call voice response',
	Info: call.nodeClientResponse.body.toJSON(), 
	});

	newtwilioresponse.save(function(err){
	if (err) {
		res.send(500, 'voice response is not saved');
	}
	else {
		console.log('voice response is saved');
	}
	});
});
res.type('text/xml');
res.send(twiml.toString());
});

app.post('/enterConference', function(req, res){

	var newtwilioresponse = new TwilioResponseMongoose({
	fromUrl: '/enterConference',
	type: 'enterConference response',
	Info: call.nodeClientResponse.body.toJSON()
	});

	newtwilioresponse.save(function(err){
	if (err) {
		res.send(500, 'enterConference response is not saved');
	}
	else {
		console.log('enterConference response is saved');
	}
	});

	var twiml = new twilioClient.TwimlResponse();
	twiml.say('You are being connected to a Gig zolo conference. Press 1 to connect press 2 to disconnect ')
	gather({
	action:'http://kia-twilio.herokuapp.com/connectCall',
	finishOnKey:'*'
	}, function() { 
	
		this.say('Press 1 to connect')
		.say('Press 2 to disconnect');
	});

	res.type('text/xml');
	res.send(twiml.toString());
});

app.post('/handleConference', function(req, res){

var twiml = new twilioClient.TwimlResponse();
twiml.say('Sorry, the other party left the conference. This conference has ended. You may please hangup')
.hangup();

});

app.post('/connectCall', function(req, res){

	var newtwilioresponse = new TwilioResponseMongoose({
	fromUrl: '/connectCall',
	type: 'connectCall response',
	Info: call.nodeClientResponse.body.toJSON()
	});

	newtwilioresponse.save(function(err){
	if (err) {
		res.send(500, 'connectCall response is not saved');
	}
	else {
		console.log('connectCall response is saved');
	}
	});
	var twiml = new twilio.TwimlResponse();
	if (req.body.Digits === '1') {
		twiml.say('Connecting you to the conference')
		.say('You may hit * anytime during the call to leave the conference')
		.dial({action:'/handleLeaveConference', method:'POST', hangupOnStar:'true' }, function(){
		this.conference('test conference');
	});
	}
	else {
		twiml.hangup();
	}
	res.type('text/xml');
	res.send(twiml.toString());
});

app.get('/', function(req, res){
	res.render('home');
});

app.listen(port);
console.log('listening on port: '+ port);