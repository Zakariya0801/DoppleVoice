var song = new Audio;
      var isStopped = true;
      var currentSong = 0;
      var playlist = [];
      var playlistVisible = false;

      function skip(to) {
        if (to == 'prev') {
          stop();
          currentSong = (--currentSong)%playlist.length;
          if (currentSong < 0) {
            currentSong += playlist.length;
          }
          playpause();
        }
        else if (to == 'next') {
          stop();
          currentSong = (++currentSong)%playlist.length;
          playpause();
        }
      }

      function playpause() {
        if (!song.paused) {
          song.pause();
          document.getElementById("glow").classList.add("disable-animation");
        }
        else if (playlist.length == 0){
          togglePlaylist();
        }
        else {
          if (isStopped) {
            song.src = playlist[currentSong];
          }
          song.play();
          songFile = playlist[currentSong].split("/");
          songName = document.getElementById("songName");
          songName.innerHTML = "result";
          document.getElementById("glow").classList.remove("disable-animation");
          isStopped = false;
        }
      }

      function stop() {
        song.pause();
        document.getElementById("glow").classList.add("disable-animation");
        song.currentTime = 0;
        document.getElementById("seek").value = 0;
        isStopped = true;
        document.getElementById("songName").innerHTML = "Audio Name";
      }

      function setPos(pos) {
        song.currentTime = pos;
      }

      function mute() {
        if (song.muted) {
          song.muted = false;
          document.getElementById('mute').className = "fa fa-volume-up";
        }
        else {
          song.muted = true;
          document.getElementById('mute').className = "fa fa-volume-off";
        }
      }

      function setVolume(volume) {
        song.volume = volume;
      }

      function togglePlaylist() {
        if (playlistVisible) {
          document.getElementById('playlist').className = "hide";
          document.getElementById('player').className = "";
          playlistVisible = false;
        }
        else {
          document.getElementById('player').className = "hide";
          document.getElementById('playlist').className = "";
          playlistVisible = true;
        }
      }

      function addList() {
        sourceUrl = document.getElementById('sourceUrl').value;
        sourceUrl.split(",").forEach((file) => {
          fileUrl = file.trim();
          if (fileUrl != "" && playlist.indexOf(fileUrl) == -1) {
            parent = document.getElementById('list');
            listItem = document.createElement('div');
            listItem.setAttribute('class','list-item');

            wrapper = document.createElement('div');
            wrapper.setAttribute('class','wrap-text');

            span = document.createElement('span');
            span.innerHTML = fileUrl;

            wrapper.appendChild(span);
            listItem.appendChild(wrapper);

            btn = document.createElement('button');
            btn.setAttribute('onclick','removeList(this)');
            btn.innerHTML = '&times;';

            listItem.appendChild(btn);
            parent.appendChild(listItem);
            playlist.push(fileUrl);
          }
        });
        document.getElementById('sourceUrl').value = '';
      }
      document.getElementById('fileInput').addEventListener('change', function(event) {
        Array.from(event.target.files).forEach((file) => {
          console.log(file)
          if (file && playlist.indexOf(file.name) == -1) {
          let parent = document.getElementById('list');
          let listItem = document.createElement('div');
          listItem.setAttribute('class', 'list-item');
        
          let wrapper = document.createElement('div');
          wrapper.setAttribute('class', 'wrap-text');
        
          let span = document.createElement('span');
          span.innerHTML = file.name;
        
          wrapper.appendChild(span);
          listItem.appendChild(wrapper);
        
          let btn = document.createElement('button');
          btn.setAttribute('onclick', 'removeList(this)');
          btn.innerHTML = '&times;';
        
          listItem.appendChild(btn);
          parent.appendChild(listItem);
          
          // Create an Object URL for the local file and add it to the playlist
          playlist.push(URL.createObjectURL(file));
          }
        });
        event.target.value = ''; // Clear the input
        });
        

      function removeList(item) {
        index = playlist.indexOf(item.parentElement.firstChild.innerText);
        if (index != -1){
          playlist.splice(index,1);
          item.parentElement.remove();
        }
      }

      song.addEventListener('error', function(){
        stop();
        document.getElementById("songName").innerHTML = "Error Loading Audio";
      });

      song.addEventListener('timeupdate', function() {
        curtime = parseInt(song.currentTime,10);
        document.getElementById('seek').max = song.duration;
        document.getElementById('seek').value = curtime;
      });

      song.addEventListener("ended", function() {
        song.pause();
        song.currentTime = 0;
        document.getElementById('seek').value = 0;
        if ((currentSong + 1) >= playlist.length) {
          currentSong = 0;	
        }
        else {
          currentSong++;
        }
        stop();
        song.src = playlist[currentSong];
        playpause();
      });

      var input = document.getElementById("sourceUrl");
      input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          addList();
        }
      });

      // This area of code is only for preview purposes only

      // document.getElementById('sourceUrl').value = "https://drive.google.com/uc?export=download&id=1v8-iA2SLrttczR_6etvlxu0_ZI3_jWua";
      // addList();
      document.getElementById("glow").classList.remove("disable-animation");

      // Code for preview ends here