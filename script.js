document.addEventListener("DOMContentLoaded", () => {

let images = [];
let index = 0;
let interval;

fetch("https://api.github.com/repos/alessandroangel/meu_album/contents/img")
  .then(res => res.json())
  .then(data => {

    images = data
      .filter(file =>
        file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
      )
      .map(file => file.download_url);

    createGallery();
  });

//Criando a playlist automatica
let musics = [];

fetch("https://api.github.com/repos/alessandroangel/meu_album/contents/mp")
  .then(res => res.json())
  .then(data => {

    musics = data
      .filter(file =>
        file.name.match(/\.(mp3|wav|ogg)$/i)
      )
      .map(file => file.download_url);

    console.log(musics);
  });

//Tocando a playlist aleatoriamente
const music = document.getElementById("music");

function playRandomMusic() {
  const random =
    musics[Math.floor(Math.random() * musics.length)];

  music.src = random;
  music.play();
}


// 📸 criar galeria
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
createGallery(); // 👈 ADICIONE ISSO

// ▶️ iniciar slideshow
window.startSlideshow = function() {
  const elem = document.documentElement;
  clearInterval(interval);
  playRandomMusic();

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }

  document.getElementById("home").style.display = "none";
  document.querySelector(".start-btn").style.display = "none";
  document.getElementById("slideshow").style.display = "flex";

  showSlide();
  interval = setInterval(nextSlide, 6000);
};

// 🖼️ mostrar imagem
function showSlide() {
  const img = document.getElementById("slideImage");

  img.classList.remove("show");

  setTimeout(() => {
    img.src = images[index];
    img.offsetHeight; // força reflow
    img.classList.add("show");
  }, 600);
}

// ⏭️ próxima imagem
function nextSlide() {
  index = (index + 1) % images.length;
  showSlide();
}

// ⛔ parar slideshow
window.stopSlideshow = function() {
  clearInterval(interval);

  const music = document.getElementById("music");
  music.pause();
  music.currentTime = 0;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  document.getElementById("slideshow").style.display = "none";
  document.getElementById("home").style.display = "block";
  document.querySelector(".start-btn").style.display = "block";
};

// 🎵 música
window.toggleMusic = function() {
  const music = document.getElementById("music");
  /*music.paused ? music.play() : music.pause();
};*/
  music.pause();
music.currentTime = 0;
music.play();
  music.play().catch(err => console.log(err));
    if (music.paused) {
    music.currentTime = 0;
    music.play();
  } else {
    music.pause();
  }

});


// 🔄 sair do fullscreen
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    stopSlideshow();
  }
});


// 🕒 relógio (FORA do evento!)
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
