var mic, fft, samples, song, titles, timestamp, songLen, volume;
var timePaused = 0;
song = 0;
titles = [];
var loadSong;

function preload() {
  timestamp = millis();
  //if(song==0)mic = loadSound("hightone.mp3"); // mp3 file needs preload befor play.
  if (song == 0) mic = loadSound("sound.mp3", startSong);
  if (song == 1) mic = loadSound("regular.mp3", startSong); // mp3 file needs preload befor play.
  if (song == 2) mic = loadSound("next.mp3", startSong);
  titles = [
    "Two Feet - Had Some Drinks",
    "Jon Lajoie – Regular Everyday Normal MotherFucker",
    "Jeremih - Fuck You All The Time (Shlohmo Remix)"
  ];
}

function setup() {
  createCanvas(1024, 425);
  this.buttonPos = width - 270;
  volume = createSlider(0, 1, 0.04, 0.01);
  prevSong = createButton("⏮ ");
  prevSong.position(this.buttonPos, 425);
  prevSong.mousePressed(previousSong);

  pp = createButton("❚❚/►");
  pp.position(this.buttonPos + 86, 425);
  pp.mousePressed(playPause);

  nextSong = createButton("⏭");
  nextSong.position(172 + this.buttonPos, 425);
  nextSong.mousePressed(songChange);

  samples = width / 2;
}

function draw() {
  //console.log(mic.currentTime()/mic.duration());
  background(0);
  fill(255);
  textSize(30);
  mic.setVolume(volume.value());
  text(titles[song], 20, 40);
  animate();
  songEnd();
  //console.log(mic.isPlaying()); works like shit
}


function playPause() {
  if (mic.isPlaying()) {
    this.pauseStart = millis();
    mic.pause();
  } else {
    timePaused = timePaused + (millis() - this.pauseStart);
    mic.play();
  }
}

function previousSong() {
  timePaused = 0;
  if (mic.currentTime() / mic.duration() > 0.1) {
    mic.stop();
    mic.play();
  } else {
    mic.stop();
    song--;
    //console.log(song);
    if (song < 0) song = 2;
    preload();
  }
}

function songChange() {
  timePaused = 0;
  mic.stop();
  song++;
  //console.log(song);
  if (song % 3 == 0) song = 0;
  preload();
}

function songEnd() {
  if (songLen < millis() - timestamp) {
    timePaused = 0;
    timestamp = millis();
    songChange();
  }
}

function startSong() {
  fft = new p5.FFT(0.9, samples);
  fft.setInput(mic);
  songLen = floor(mic.duration() * 1000) + 3;
  //mic.setVolume(volume.value());
  mic.play();
}

function animate() {
  var spectrum = fft.analyze();

  this.r = 255;
  this.g = 0;
  this.b = 0;
  this.specCrop = samples;
  this.counter = 0;
  for (i = 0; i < this.specCrop; i++) {
    var amp = spectrum[i];
    var y = map(amp, 0, 300, height, 0);
    if (i < this.specCrop / 2) {
      this.r -= 1;
      this.g += 1;
    }
    if (i > this.specCrop / 2) {
      if (i % 1 == 0) {
        this.g -= 6;
        this.b += 6;
      }
    }
    stroke(this.r, this.g, this.b);
    line(i + width / 2, height - 10, i + width / 2, y - 10);
    //rect((i+this.specCrop)*this.w,y,this.w,height-y);
  }

  this.r = 255;
  this.g = 0;
  this.b = 0;
  for (i = this.specCrop; i > 0; i--) {
    var amp = spectrum[this.counter];
    var y = map(amp, 0, 300, height, 0);
    if (this.counter < this.specCrop / 2) {
      this.r -= 1;
      this.g += 1;
    }
    if (this.counter > this.specCrop / 2) {
      this.g -= 6;
      this.b += 6;
    }
    stroke(this.r, this.g, this.b);
    line(i, height - 10, i, y - 10);
    this.counter++;
  }
}
