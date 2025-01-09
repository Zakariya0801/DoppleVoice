document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
        const audioPlayer = document.getElementById('audioPlayer');
        const objectURL = URL.createObjectURL(file);
        
        audioPlayer.src = objectURL;
        audioPlayer.play();
    }
});
