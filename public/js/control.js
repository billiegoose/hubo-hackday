$('.joint').on('change', function(event) {
    var jointId = event.target.id.toLowerCase();
    console.log(jointId + ': ' + event.target.value);
    $.ajax('/joints/' + jointId, {
        type: 'PUT',
        data: {
            'newValue' : event.target.value
        },
        error: function() {
            console.log('error setting joint value');
        },
        success: function() {
            // yay!
        }
    });
});
