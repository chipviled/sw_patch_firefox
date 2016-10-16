beep = new Audio('../wav/beep.wav');

// Play beep
self.port.on("play_beep", function(conf) {
    beep.play();
});