const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "TruongLe";

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
const repeatBtn = $(".btn.btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isRandom: false,
  isRepeat: false,

  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

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

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        } " data-index=${index}>
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
      _this.render();
      _this.scrollToActiveSong();
    };

    // When Previous button is clicked
    preBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      }
      _this.preSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // When Random button is clicked
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // When Repeat button is clicked
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // When a song is ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // When a song in playlist is clicked
    playlist.onclick = function (e) {
      let notActiveSong = e.target.closest(".song:not(.active)");
      let option = e.target.closest(".option");
      if (notActiveSong || option) {
        // Handle song
        if (notActiveSong) {
          _this.currentIndex = Number(notActiveSong.dataset.index);
          _this.render();
          _this.scrollToActiveSong();
          _this.loadCurrentSong();
          audio.play();
        }

        // Handle option
        if (option) {
        }
      }
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
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    let activeSong = $(".song.active");
    if (activeSong.offsetTop > 100) {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 300);
    } else {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  },

  start: function () {
    // Load user's config
    this.loadConfig();

    // Define new properties
    this.defineProperties();

    // Wait for specific events
    this.handleEvents();

    // Load current song
    this.loadCurrentSong();

    // Render song to playlist
    this.render();

    // Load random and repeat state
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
