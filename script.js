document.addEventListener("DOMContentLoaded", () => {

  // 📸 imagens
  let images = [];

  // 🎵 músicas
  let musics = [];

  // 🎞️ controle slideshow
  let index = 0;
  let interval;

  // 🎵 elemento audio
  const music = document.getElementById("music");



  // =========================
  // 📸 CARREGAR IMAGENS GITHUB
  // =========================

  //fetch("https://api.github.com/repos/alessandroangel/meu_album/contents/img")
  fetch(`https://api.github.com/repos/alessandroangel/meu_album/contents/img?t=${Date.now()}`)
    .then(res => res.json())
    .then(data => {
       console.log(data);

   images = data
  .filter(file =>
    file.download_url &&
    file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
  )
  .map(file => file.download_url + `?t=${Date.now()}`);

console.log(images);
        createGallery();
    });



  // =========================
  // 🎵 CARREGAR MUSICAS GITHUB
  // =========================

  //fetch("https://api.github.com/repos/alessandroangel/meu_album/contents/mp")
  fetch(`https://api.github.com/repos/alessandroangel/meu_album/contents/mp?t=${Date.now()}`)
    .then(res => res.json())
    .then(data => {
     

      musics = data
        .filter(file =>
          file.name.match(/\.(mp3|wav|ogg)$/i)
        )
        .map(file => file.download_url);

      console.log("Músicas carregadas:", musics);
    });



  // =========================
  // 🎵 TOCAR MÚSICA ALEATÓRIA
  // =========================

  function playRandomMusic() {

    if (musics.length === 0) return;

    const random =
      musics[Math.floor(Math.random() * musics.length)];

    music.src = random;

    music.play().catch(err => console.log(err));
  }



  // =========================
  // 📸 CRIAR GALERIA
  // =========================

  function createGallery() {

    const gallery = document.getElementById("gallery");

    gallery.innerHTML = "";

    images.forEach((src, i) => {

      const img = document.createElement("img");

      img.src = src;

      img.onclick = () => {
        index = i;
        startSlideshow();
      };

      gallery.appendChild(img);
    });
  }



  // =========================
  // ▶️ INICIAR SLIDESHOW
  // =========================

  window.startSlideshow = function() {

    clearInterval(interval);

    playRandomMusic();

    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }

    document.getElementById("home").style.display = "none";

    document.querySelector(".start-btn").style.display = "none";

    document.getElementById("slideshow").style.display = "flex";

    showSlide();

    interval = setInterval(nextSlide, 6000);
  };



  // =========================
  // 🖼️ MOSTRAR SLIDE
  // =========================

  function showSlide() {

    const img = document.getElementById("slideImage");

    img.classList.remove("show");

    setTimeout(() => {

      img.src = images[index];

      img.offsetHeight;

      img.classList.add("show");

    }, 600);
  }



  // =========================
  // ⏭️ PRÓXIMA IMAGEM
  // =========================

  function nextSlide() {

    index = (index + 1) % images.length;

    showSlide();
  }



  // =========================
  // ⛔ PARAR SLIDESHOW
  // =========================

  window.stopSlideshow = function() {

    clearInterval(interval);

    music.pause();

    music.currentTime = 0;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    document.getElementById("slideshow").style.display = "none";

    document.getElementById("home").style.display = "block";

    document.querySelector(".start-btn").style.display = "block";
  };



  // =========================
  // 🎵 TOGGLE MUSICA
  // =========================

  window.toggleMusic = function() {

    if (music.paused) {

      music.play().catch(err => console.log(err));

    } else {

      music.pause();
    }
  };



  // =========================
  // 🔄 SAIR FULLSCREEN
  // =========================

  document.addEventListener("fullscreenchange", () => {

    if (!document.fullscreenElement) {

      stopSlideshow();
    }
  });



  // =========================
  // 🕒 RELÓGIO
  // =========================

  function updateClock() {

    const now = new Date();

    const seconds = now.getSeconds();

    const minutes = now.getMinutes();

    const hours = now.getHours();

    const secondDeg = seconds * 6;

    const minuteDeg = minutes * 6 + seconds * 0.1;

    const hourDeg = (hours % 12) * 30 + minutes * 0.5;

    document.querySelector(".second").style.transform =
      `translateX(-50%) rotate(${secondDeg}deg)`;

    document.querySelector(".minute").style.transform =
      `translateX(-50%) rotate(${minuteDeg}deg)`;

    document.querySelector(".hour").style.transform =
      `translateX(-50%) rotate(${hourDeg}deg)`;
  }

  setInterval(updateClock, 1000);

  updateClock();

});

