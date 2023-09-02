const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn.btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn.btn-next");
const preBtn = $(".btn.btn-prev");
const randomBtn = $(".btn.btn-random");

const app = {
  currentIndex: 0,
  isRandom: false,

  songs: [
    {
      name: "Hay trao cho anh",
      singer: "Son Tung MTP",
      path: "./assets/musics/haytraochoanh.mp3",
      image: "./assets/images/sontung.jpeg",
    },
    {
      name: "Mercy",
      singer: "Shawn Mendes",
      path: "./assets/musics/mercy.mp3",
      image: "./assets/images/shawnmendes.jpeg",
    },
    {
      name: "Stiches",
      singer: "Shawn Mendes",
      path: "./assets/musics/stiches.mp3",
      image: "./assets/images/shawnmendes.jpeg",
    },
    {
      name: "Shooting star",
      singer: "Lossless",
      path: "./assets/musics/sexydance.mp3",
      image: "./assets/images/shawnmendes.jpeg",
    },
    {
      name: "There's nothing holding me back",
      singer: "Shawn Mendes",
      path: "./assets/musics/theresnothingholdingmeback.mp3",
      image: "./assets/images/shawnmendes.jpeg",
    },
    {
      name: "Treat you better",
      singer: "Shawn Mendes",
      path: "./assets/musics/treatyoubetter.mp3",
      image: "./assets/images/shawnmendes.jpeg",
    },
    {
      name: "Wonder",
      singer: "Shawn Mendes",
      path: "./assets/musics/wonder.mp3",
      image: "./assets/images/shawnmendes.jpeg",
    },
    {
      name: "See you again",
      singer: "Charlie Puth",
      path: "./assets/musics/seeyouagain.mp3",
      image: "./assets/images/charlieputh.jpeg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song) => {
      return `
        <div class="song">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        `;
    });

    $(".playlist").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Justify the cd thumb size when scrolling
    document.onscroll = function () {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollY;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;

      cd.style.opacity = newWidth / cdWidth;
    };

    // Handle when click play button
    playBtn.onclick = function () {
      if (!audio.paused) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // When song is playing
    audio.onplay = function () {
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // When song is paused
    audio.onpause = function () {
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // When song duration is changed
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // When drag the progress bar
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // When Next button is clicked
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      }
      _this.nextSong();
      audio.play();
    };

    // When Previous button is clicked
    preBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      }
      _this.preSong();
      audio.play();
    };

    // When Random button is clicked
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandom: function () {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === nextIndex);
    this.currentIndex = nextIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Define new properties
    this.defineProperties();

    // Wait for specific events
    this.handleEvents();

    // Load current song
    this.loadCurrentSong();

    // Render song to playlist
    this.render();
  },
};

app.start();
