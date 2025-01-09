function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
  }

  var mediaConstraints = {
    audio: true
  };
  document.querySelector('#save-recording').onclick = function () {
      this.disabled = true;
      mediaRecorder.save();
      // alert('Drop WebM file on Chrome or Firefox. Both can play entire file. VLC player or other players may not work.');
  };
  //Parto con la registrazione audio
  function startRecording(idx) {
    
    $('#start-recording').disabled = true;
    audiosContainer = document.getElementById('audios-container');
    //document.getElementById("clicks").innerHTML = "Recording Started";

    var f = document.getElementById('clicks');
    setInterval(function () {
        f.style.display = (f.style.display == 'none' ? '' : 'none');
    }, 1000);

    captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
  };
  //Stoppo la registrazione audio
  function stopRecording() {
      $('#stop-recording').disabled = true;
   
      //document.getElementById("clicks").innerHTML = "Recording Stopped";

      var f = document.getElementById('clicks');
      setInterval(function () {
          f.style.display = (f.style.display == 'none' ? '' : 'none');
      }, 1000);
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
   
   
    $('.start-recording').disabled = false;
  };

  //Falvo Il file
  function saveRecording() {
      mediaRecorder.save();
  };

  var mediaRecorder;

  function onMediaSuccess(stream) {
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.mimeType = 'audio/wav';  
    //mediaRecorder.mimeType = 'audio/webm';  
    mediaRecorder.audioChannels = 1;
    mediaRecorder.ondataavailable = function(blob) {
      $('#record-audio').html("<audio controls=''><source src=" + URL.createObjectURL(blob) + "></source></audio>");
    };

    var timeInterval = 360 * 1000;

    mediaRecorder.start(timeInterval);

    $('#stop-recording').disabled = false;
  }

  function onMediaError(e) {
    console.error('media error', e);
  }

  function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  }

  function getTimeLength(milliseconds) {
    var data = new Date(milliseconds);
    return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
  }

  window.onbeforeunload = function() {
    $('#start-recording').disabled = false;
  };


$(document).on('click','input[name="audio_record-icon"]',function(){
  var checked = $('#audio_record-icon').prop('checked'); 
  if(checked == true)
    {
        startRecording();
        console.log('start');
    }
  else
    {
        stopRecording();
        console.log('stop');
    }
});