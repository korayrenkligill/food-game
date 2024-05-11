/* #region  Tanımlamalar */
var screen = document.getElementById("screen");

var gridContainer = document.getElementById("gridContainer");

var character = document.getElementById("character");
character.style.backgroundImage = `url('./images/character/0.png')`;

var scoreElement = document.getElementById("score");
var scoreParagraph = scoreElement.querySelector("p");

var startScreenElement = document.getElementById("startScreen");
var startScreenMaxScoreParagraph = startScreenElement.querySelector("p");
var startScreenButton = startScreenElement.querySelector("button");

var loseScreenElement = document.getElementById("loseScreen");
var loseScreenScoreParagraph = document.getElementById("loseScreenScore");
var loseScreenMaxScoreParagraph = document.getElementById("loseScreenMaxScore");
var loseScreenTryAgainButton = document.getElementById("loseScreenTryAgain");

var heartElement = document.getElementById("hearts");
/* #endregion */

/* #region  Değişkenler */
var lineList = [];

var maxScore = localStorage.getItem("maxScore");
if (!maxScore) {
  localStorage.setItem("maxScore", 0);
}
startScreenMaxScoreParagraph.innerText = `Max Score: ${maxScore}`;

var leftValue = 10;
var score = 0;
var heart = 3;
var characterPos = 50;

heartElement.style.backgroundImage = `url('./images/hearts/3.png')`;

var speed = 2; // Hız değeri (4px her 50 milisaniyede bir)

var gameStatus = false;
var gameClock = 3000;
var gameTiming;
/* #endregion */

startScreenButton.addEventListener("click", function () {
  //Oyunu başlat ve başlangıç ekranını kaldır
  PlayTime();
  startScreenElement.style.display = "none";
});

loseScreenTryAgainButton.addEventListener("click", function () {
  //Oyun kaybedildi yeniden başlat
  ResetGame();
});

/* #region  Rastgele Yemek üretme fonksiyonu */
function generateRandomFood() {
  // Yemekler için random bir pozisyon oluştur ve bunu 10 ile çarp
  var foodPosition = getRandomNumber(1, 9);
  foodPosition *= 10;

  // Yemekler için random bir resim seç
  var randomImg = getRandomNumber(0, 14);

  // Yemeği oluştur
  var circle = document.createElement("div");
  circle.classList.add("circle");
  circle.style.top = 0 + "vh"; // Y pozisyonunu ayarla
  circle.style.left = foodPosition + "vw"; // X pozisyonunu ayarla
  circle.style.backgroundImage = `url('images/foods/${randomImg}.png')`;
  gridContainer.appendChild(circle);

  // Yemeklerin aşağı doğru düşme fonksiyonu
  var interval = setInterval(function () {
    if (gameStatus) {
      var foodLeft = parseInt(circle.style.left);
      var currentTop = parseFloat(circle.style.top); // Şu anki top değerini al
      var newTop = currentTop + speed; // Yeni top değerini hesapla
      circle.style.top = newTop + "px"; // Yeni top değerini ayarla
      if (newTop + 70 > window.innerHeight - 100 && foodLeft == characterPos) {
        // Yemek yenildi
        // score++;
        score += 5;
        if (score >= 20 && score < 40) {
          gameClock = 1500;
          cle;
          clearInterval(gameTiming);
          gameTiming = setInterval(generateRandomFood, gameClock);
          speed = 4;
          character.style.width = "120px";
          character.style.height = "120px";
          character.style.transform = "translateX(-60px)";
        } else if (score >= 40 && score < 80) {
          gameClock = 1000;
          clearInterval(gameTiming);
          gameTiming = setInterval(generateRandomFood, gameClock);
          speed = 8;
          character.style.width = "140px";
          character.style.height = "140px";
          character.style.transform = "translateX(-70px)";
        } else if (score >= 80) {
          gameClock = 750;
          clearInterval(gameTiming);
          gameTiming = setInterval(generateRandomFood, gameClock);
          speed = 12;
          character.style.width = "160px";
          character.style.height = "160px";
          character.style.transform = "translateX(-80px)";
        }
        scoreParagraph.innerText = score;

        var originalBackground = `url('./images/character/0.png')`;
        character.style.backgroundImage = `url('./images/character/1.png')`;
        setTimeout(function () {
          character.style.backgroundImage = originalBackground;
        }, 250);
        clearInterval(interval); // Aralığı temizle
        circle.remove(); // Çemberi kaldır
      }

      // Eğer top ekranın alt kenarına ulaşırsa çemberi kaldır
      if (newTop + 70 >= window.innerHeight) {
        // Yemeği yiyemedi
        // Canı varsa canını eksilt yoksa kayıp ekranını aç
        if (heart > 0) {
          heart--;
          heartElement.style.backgroundImage = `url('./images/hearts/${heart}.png')`;
        }
        if (heart <= 0) {
          if (score > maxScore || !maxScore) {
            localStorage.setItem("maxScore", score);
          }
          loseScreenElement.style.display = "flex";
          loseScreenScoreParagraph.innerText = `Score: ${score}`;
          loseScreenMaxScoreParagraph.innerText = `Max Score: ${localStorage.getItem(
            "maxScore"
          )}`;
          StopTime();
          ResetGame();
        }
        clearInterval(interval); // Aralığı temizle
        circle.remove(); // Çemberi kaldır
      }
    }
  }, 50);
}
generateRandomFood();
/* #endregion */

/* #region  Random sayı üretme fonksiyonu */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/* #endregion */

/* #region  Tuş dinleme */
document.addEventListener("keydown", function (event) {
  if (gameStatus) {
    if (event.keyCode === 39) {
      // Sağ ok tuşu
      // Left değerini artır
      characterPos += 10;
      // En fazla 90vw olacak şekilde sınırla
      characterPos = Math.min(90, characterPos);
      // Kutunun left değerini güncelle
      character.style.left = characterPos + "vw";
    } else if (event.keyCode === 37) {
      // Sol ok tuşu
      // Left değerini azalt
      characterPos -= 10;
      // En az 10vw olacak şekilde sınırla
      characterPos = Math.max(10, characterPos);
      // Kutunun left değerini güncelle
      character.style.left = characterPos + "vw";
    }
  }
});
/* #endregion */

function StopTime() {
  gameStatus = false;
  clearInterval(timeoutID);
}
function PlayTime() {
  gameStatus = true;
  gameTiming = setInterval(generateRandomFood, gameClock);
}
function ResetGame() {
  scoreParagraph.innerText = "0";
  if (score > maxScore) {
    localStorage.setItem("maxScore", score);
  }
  heart = 3;
  score = 0;
  characterPos = 50;
  var circleList = document.querySelectorAll(".circle");
  circleList.forEach(function (circle) {
    circle.remove();
  });
  location.reload();
}
