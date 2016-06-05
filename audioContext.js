/*
Web Audio Kalimba
*/
var context;
window.addEventListener('load', init, false);
var kalimba = null;

var startTime = null
var tempo = 120; // BPM
var eighthNoteTime = (60 / tempo) / 2;
var delay = null;
var feedback = null;
var filter = null;

function init() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        startTime = context.currentTime + 0.100;
        //Loading sound from freesound.com
        loadSoundBuffer(kalimba, "http://www.freesound.org/data/previews/58/58720_710974-lq.mp3");


        // Delay Routing
        delay = context.createDelay();
        delay.delayTime.value = 0.8;
        delay.connect(context.destination);
        feedback = context.createGain();
        feedback.gain.value = 0.3;
        delay.connect(feedback);
        feedback.connect(delay);
        filter = context.createBiquadFilter();
        filter.frequency.value = 1000;
        feedback.connect(filter);
        filter.connect(delay);


    } catch (e) {
        alert("Web Audio API is not supported");
    }

}



function loadSoundBuffer(mbuffer, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            kalimba = buffer;

        })
    }
    request.send();
}

function playSound(buffer, time, rate, fx) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    source.connect(context.destination);
    if (fx == true) {
        source.connect(delay);
    }

    source.start(time);
}

function playSequence() {
    for (var bar = 0; bar < 4; bar++) {
        var time = startTime + bar * 8 * eighthNoteTime;
        playSound(kalimba, time, 1, false);
        playSound(kalimba, time * time * eighthNoteTime, 6, false);
        playSound(kalimba, 2 * time * time * eighthNoteTime, 4, true);
        playSound(kalimba, 2 * eighthNoteTime * time, 2, false);
        playSound(kalimba, 6 * eighthNoteTime * time, 8, true);
        playSound(kalimba, 4 * eighthNoteTime * time, 16, true);
    }
}


$(document).ready(function() {
    $(".tine").click(function() {
        var time = startTime + 8 * eighthNoteTime;
        var rate = this.id.split('');
        console.log(this.id);
        console.log(rate);
        playSound(kalimba, eighthNoteTime * time, parseFloat(rate[1] + '.' + rate[2]));

    });
    $("#boom").click(function() {
        playSequence();

    });

});
