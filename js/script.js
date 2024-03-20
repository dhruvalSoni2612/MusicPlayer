cardDisplay();

let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "svgImg/pause.svg";
  }
  // currentSong.play();
  document.querySelector(".song_info").innerHTML = decodeURI(
    track.split(".mp3")[0]
  );
  document.querySelector(".song_time").innerHTML = "00:00 / 00:00";
};

async function main() {
  songs = await getSongs();
  playMusic(songs[0], true);

  let songNames = document
    .querySelector(".songsDisplay")
    .getElementsByTagName("ul")[0];
  songs.forEach((song) => {
    songNames.innerHTML += `<li class="songList"> ${song.replaceAll(
      "%20",
      " "
    )} </li>`;
  });

  Array.from(
    document.querySelector(".songsDisplay").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.innerText);
      playMusic(e.innerText.trim());
    });
  });
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgImg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svgImg/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    let progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".song_time").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = progress + "%";
    document.querySelector(".progress").style.left = progress + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    console.log(e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    document.querySelector(".progress").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".humburger").addEventListener("click", () => {
    document.querySelector(".left_container").style.left = "0";
  });

  document.querySelector(".close_btn").addEventListener("click", () => {
    document.querySelector(".left_container").style.left = "-100%";
  });

  prev.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ([index - 1] >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ([index + 1] < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
}

main();

function cardDisplay() {
  let cardElement = document.querySelector(`.cards`);
  let innerHTML = "";
  cards.forEach((card) => {
    innerHTML += `<div class="card">
    <img
      src="${card.image}"
      alt="img"
    />
    <span class="play_symbol"
      ><i class="fa-regular fa-circle-play"></i
    ></span>
    <p class="song_type">${card.song_type}</p>
    <p class="song_description">${card.discription}</p>
  </div>`;
  });
  cardElement.innerHTML = innerHTML;
}
