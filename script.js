const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");

const app = {
  currentIndex: 0,

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
    const cdWidth = cd.offsetWidth;

    document.onscroll = function () {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollY;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;

      cd.style.opacity = newWidth / cdWidth;
    };
  },

  start: function () {
    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();
  },
};

app.start();
