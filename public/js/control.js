// firebase stuff
var huboRef = new Firebase('https://hubo-firebase.firebaseIO.com');
var jointRef = huboRef.child('joints');

jointRef.on('child_changed', function(snapshot) {
  var jointId = snapshot.name(),
      jointValue = snapshot.val();

  $('#' + jointId.toUpperCase()).val(jointValue);
});

$('.joint').on('change', function(event) {
    var jointId = event.target.id.toLowerCase();
    console.log(jointId + ': ' + event.target.value);

    jointRef.child(jointId).set(event.target.value);
    //$.ajax('/joints/' + jointId, {
    //    type: 'PUT',
    //    data: {
    //        'newValue' : event.target.value
    //    },
    //    error: function() {
    //        console.log('error setting joint value');
    //    },
    //    success: function() {
    //        // yay!
    //    }
    //});
});
