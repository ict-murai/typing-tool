const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplayElement = document.getElementById("typeDisplay");
const typeInputElement = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");
const gameClear = new Audio("./audio/GameClear.mp3")

const countType = document.getElementById("count");
let n = 0;
const NewStart = document.getElementById("new_start");


/* inputテキスト入力。合っているかどうかの判定 */
typeInputElement.addEventListener("input", () => {
  /* タイプ音をつける */
  typeSound.play();
  typeSound.currentTime = 0;

  /* 文字と文字を比較する */
  /* ディスプレイに表示されてるSpanタグを取得 */
  const sentence = typeDisplayElement.querySelectorAll("span");
  /* 自分で打ち込んだテキストを取得 */
  const arrayValue = typeInputElement.value.split("");
  let correct = true;
  

  sentence.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime = 0;
    }
  });

  /* 次の文章へ */
  if (correct) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
    n++;
    countType.innerText = n; // クリアカウント
  }
});

/* ちゃんとthenかawaitで待たないと欲しいデータが入らない。 */
/* 非同期でランダムな文章を取得する */
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then(
      (data) =>
        /* ここでならちゃんと文章情報を取り扱うことができる。 */
        //console.log(data.content);
        data.content
    );
}

/* 次のランダムな文章を取得する */
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  /* ディスプレイに表示 */
  typeDisplayElement.innerText = ""; //最初はsentenceが入ってた。
  /* 文章を1文字ずつ分解して、spanタグを生成する(クラス付与のため) */
  sentence.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    // characterSpan.classList.add("correct");
    characterSpan.innerText = character;
    typeDisplayElement.appendChild(characterSpan);
    /* 確認 */
    console.log(characterSpan);
  });
  /* テキストボックスの中身を消す。 */
  typeInputElement.value = null;

  /* タイマーのリセット */
  StartTimer();
}

let startTime;
let originTime = 30;
/* カウントアップを開始する。 */
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date(); /* 現在の時刻を表示 */
  console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime(); /* １秒ずれて呼び出される */
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor(
    (new Date() - startTime) / 1000
  ); /* 現在の時刻 - １秒前の時刻 = 1s*/
}

function TimeUp() {
  RenderNextSentence();
}

const timerCount = document.getElementById('countdown');
let originTime_Count = 100;
let startTime_Count;

function StartTimer_Count() {
  timerCount.innerText = originTime_Count;
  startTime_Count = new Date(); /* 現在の時刻を表示 */
  setInterval(() => {
    timerCount.innerText = originTime_Count - getTimerTime_Count(); /* １秒ずれて呼び出される */
    if (timerCount.innerText == -1){
      gameTimeUp();
    };
  }, 1000);
}

function getTimerTime_Count() {
  return Math.floor(
    (new Date() - startTime_Count) / 1000
  ); // 現在の時刻 - １秒前の時刻 = 1s
}

function gameTimeUp() {
  alert("ゲーム終了!!!");
  if(countType.innerText >= 5){
    gameClear.play();
    gameClear.currentTime = 0;
    alert("おめでとう、ゲームクリアだね!!!");
    const res = confirm("Restartしますか？");
    if( res == true ) {
      clickEvent();
    }
    else {
      window.location.href = "./index.html";
    }
  }else{
    alert("残念、ゲーム失敗だよ．．．");
    const res = confirm("Restartしますか？");
    if( res == true ) {
      clickEvent();
    }
    else {
      window.location.href = "./index.html";
    }
  };
}

const GameStart = document.getElementById('start');
const Header = document.getElementById('header');

function clickEvent(){
  GameStart.innerText = 'Restart';
  setTimeout(function(){
    StartTimer_Count();
  },260); 
  RenderNextSentence();
  n = 0;
  countType.innerText = n
  Header.style.visibility = 'hidden';
};

const NextType = document.getElementById('next');

NextType.addEventListener('click', function(){
  RenderNextSentence();
});

/* const ResetBtn = document.getElementById('reset');

ResetBtn.addEventListener('click', function(){
  location.href = './view.html';
}) */