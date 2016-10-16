beep = new Audio('../wav/beep.wav');
beep.play();

// Play beep
self.port.on("play_beep", function(conf) {
    beep = new Audio('../wav/beep.wav');
    beep.play();
});