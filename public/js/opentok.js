TB.addEventListener('exception', function(error) {
});


var session = TB.initSession('1_MX4yOTY3NzA4Mn4xMjcuMC4wLjF-U3VuIE1heSAxOSAxMTo0OTo0MCBQRFQgMjAxM34wLjg0NjQxMjN-');

session.addEventListener('sessionConnected', function(e) {
   session.publish('publisher');
   addStreams(e.streams);
});

session.addEventListener('streamCreated', function(e) {
  addStreams(e.streams);
});

function addStreams(streams) {
  for (var i = 0; i < streams.length; i++) {
    var stream = streams[i];
    if (stream.connection.connectionId === session.connection.connectionId) return;
    session.subscribe(stream, 'subscriber');
  }
}


function connectToSession() {
  session.connect('29677082', 'T1==cGFydG5lcl9pZD0yOTY3NzA4MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1lYjdjMWFjZGZmNzA3MTQwOWE0MjMzNjJhZWQyZTZlOWUwZTNmZjYzOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDR5T1RZM056QTRNbjR4TWpjdU1DNHdMakYtVTNWdUlFMWhlU0F4T1NBeE1UbzBPVG8wTUNCUVJGUWdNakF4TTM0d0xqZzBOalF4TWpOLSZjcmVhdGVfdGltZT0xMzY4OTg5NDUzJm5vbmNlPTAuMzM1MDMxNDgwMzk3MTExNSZleHBpcmVfdGltZT0xMzY5MDc1ODUyJmNvbm5lY3Rpb25fZGF0YT0=');
}

$('#connect').on('click', function(e) {
  connectToSession();
});
