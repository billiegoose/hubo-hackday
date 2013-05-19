var spawn = require('child_process').spawn;

function sendEmail() {

    var streamer = spawn('streamer', ['-c', '/dev/video0', '-b', '16', '-o', 'image.jpeg' ]);

    streamer.on('close', function (code) {

        if (code != 0) {
            console.log('Hahaha');
            return;
        }

        var sendgrid = require('sendgrid');

        var SendGrid = sendgrid.SendGrid;

        var sg = new SendGrid('wmhilton', 'hubo1234');

        var Email = sendgrid.Email;

        var email = new Email({
            to: 'wmhilton@gmail.com',
            from: 'asdfasfasfasf@adfsdf.com',
            subject: 'hi from hubo',
            text: 'i hate you'
        });

        email.addFile({
            //filename: "image.jpeg",
            //path: "./image.jpeg"
            filename: "jawn.wav",
            path: "./jawn.wav"
        });

        sg.send(email, function(success, message) {
            if (!success) {
                console.log(message);
            }
            console.log('success');
        });

    });
}

var http = require('http');
var express = require('express');
var path = require('path');
var util = require('util');
var Firebase = require('firebase');

var app = express();
var jointControl = spawn('python', ['joint_control.py']);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index');
});

app.put('/joints/:id', function(req, res) {
    var jointId = req.params.id.toUpperCase();
    var jointValue = parseInt(req.body['newValue']) / 100;
    console.log('setting joint id ' + jointId + ' to value ' + jointValue);
    jointRef.child(jointId).set(jointValue);
    //jointControl.stdin.write(jointId + ' ' + jointValue + '\n'); 
    res.send(200);
});

app.get('/exit', function(req, res) {
    jointControl.stdin.write('\n');
});

jointControl.stdout.on('data', function(data) {
    console.log('Joint Control: ' + data);
});

jointControl.on('exit', function(code) {
    console.log('Joint Control exited with code ' + code);
});

// initializing firebase
var huboRef = new Firebase('https://hubo-firebase.firebaseIO.com');
var jointRef = huboRef.child('joints');

jointRef.on('child_changed', function(snapshot) {
  var jointId = snapshot.name(),
      jointValue = snapshot.val();

  jointControl.stdin.write(jointId + ' ' + jointValue + '\n'); 
});



var server = http.createServer(app);
server.listen(5000);
