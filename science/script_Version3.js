/* 理化連連看 — script.js
   功能：
   - 使用內建 pairs 資料（可直接修改）
   - 音效（WebAudio）
   - 排行榜 (localStorage)
   - Confetti 效果
   - 可設定配對數量、玩家名稱、聲音開關
*/

// ------------ 資料庫（來自使用者提供） ------------
const pairs = [
  { id:1, term:"水的分解實驗", def:"拉瓦節透過實驗證實水可以分解成氫氣與氧氣。" },
  { id:2, term:"氧化汞的分解", def:"卜利士力發現氧化汞經加熱後，會分解出汞與氧氣，顯示化合物可分解出更簡單的物質。" },
  { id:3, term:"氯化鈉(NaCl)的組成特性", def:"由具金屬光澤的鈉（固體）與黃綠色有毒的氯（氣體）組成，但氯化鈉本身是可食用的白色顆粒。" },
  { id:4, term:"金屬顏色的特殊例外", def:"多數金屬為銀白色或銀灰色，唯有金（黃色）與銅（紅棕色）除外。" },
  { id:5, term:"合金的應用", def:"鐵常與其他金屬混合製成合金，如不鏽鋼可用於製作餐具。" },
  { id:6, term:"銅合金的區分", def:"青銅主要是銅與錫的合金；黃銅則主要是銅與鋅的合金。" },
  { id:7, term:"鈦(Ti)的特殊性", def:"具有耐熱與抗腐蝕性，常應用於航太與人工關節，但在金屬中其導電性相對較差。" },
  { id:8, term:"二氧化鈦(TiO2)的用途", def:"俗稱鈦白粉，是修正帶的主要成分，也可用於防曬化妝品及光觸媒。" },
  { id:9, term:"碳的同素異形體——鑽石", def:"由碳原子組成，是自然界中硬度極高的物質，可用於切割。" },
  { id:10, term:"活性碳的功能", def:"由煤炭經處理後製成，具有脫色與脫臭的功能。" },
  { id:11, term:"硫(S)的產地與用途", def:"常見於火山噴氣口與溫泉區，可用於製造硫酸與黑火藥。" },
  { id:12, term:"道耳頓原子說的反應觀", def:"化學反應中原子不會消失、創造或改變，僅是重新排列。" },
  { id:13, term:"湯姆森的葡萄乾布丁模型", def:"他發現電子像葡萄乾般散布在原子中，推翻了原子不可分割的觀點。" },
  { id:14, term:"拉塞福的金箔實驗", def:"證實原子內部大部分是空的，質量集中在極小的原子核。" },
  { id:15, term:"質子與電子的電量關係", def:"一個質子的帶電量與一個電子相等，但電性相反，使原子呈電中性。" },
  { id:16, term:"電子的質量極小", def:"一個電子的質量僅約為質子的 1/1836，在計算質量數時可忽略不計。" },
  { id:17, term:"同位素的化學性質", def:"同位素具有相同的質子數，因此其化學性質相同。" },
  { id:18, term:"週期表之父", def:"門得列夫最早依原子量排列元素，並成功預測了當時尚未發現的元素性質。" },
  { id:19, term:"鹵素(第17族)的通性", def:"包含氟、氯、溴、碘，是性質最活潑的非金屬元素，且多具有毒性。" },
  { id:20, term:"化學式的定義", def:"利用元素符號及數字來表示純物質的組成，如 2H₂O 表示兩個水分子。" },
  { id:21, term:"元素的定義", def:"無法再用化學方法分解的純物質稱為元素，例如氧、氫。" },
  { id:22, term:"化合物的定義", def:"由兩種或兩種以上元素，以一定比例組合成的純物質，稱為化合物，例如水、氧化汞。" },
  { id:23, term:"純物質的性質", def:"化合物的性質與其組成元素的性質完全不同。" },
  { id:24, term:"元素符號命名法", def:"通常取拉丁文、希臘文或英文名稱的第一個字母大寫表示，若重複則在後面附加一小寫字母。" },
  { id:25, term:"中文名稱部首規則", def:"固態金屬用「金」部、固態非金屬用「石」部、液態用「水」或「氵」部（如汞、溴）、氣態用「气」部。" },
  { id:26, term:"金屬元素的通性", def:"大部分具有金屬光澤、具延展性（可拉成細線或打成薄片）、是電與熱的良導體。" },
  { id:27, term:"非金屬元素的通性", def:"大多不具延展性（易碎）、不具金屬光澤、多為電與熱的不良導體（石墨除外）。" },
  { id:28, term:"常見元素特性——金(Au)與銀(Ag)", def:"銀的導電性與導熱性居金屬之冠；金的性質安定、延展性最好。" },
  { id:29, term:"常見元素特性——鋁(Al)與汞(Hg)", def:"鋁是地殼中含量最多的金屬元素；汞是常溫常壓下唯一的液態金屬。" },
  { id:30, term:"常見元素特性——碳(C)與矽(Si)", def:"碳的同素異形體包含煤炭、石墨、鑽石與石墨烯；矽是地殼中含量第二多的元素，為半導體工業的重要原料。" },
  { id:31, term:"道耳頓原子說", def:"所有物質皆由不可分割的原子組成；同元素原子質量相同；化合物由不同原子以簡單整數比組成；化學反應僅是原子重新排列。" },
  { id:32, term:"原子結構的發現順序", def:"湯姆森發現電子 → 拉塞福發現原子核與質子 → 查兌克發現中子。" },
  { id:33, term:"原子的電中性", def:"原子中「質子數 = 電子數」，正負電量相等，故原子呈電中性。" },
  { id:34, term:"原子序(Z)", def:"代表原子內的質子數，是判斷元素種類的依據。" },
  { id:35, term:"質量數(A)", def:"定義為原子核內「質子數 + 中子數」的總和。" },
  { id:36, term:"同位素", def:"具有相同質子數（原子序相同），但中子數不同（質量數不同）的原子。" },
  { id:37, term:"週期表排列規則", def:"依原子序由小到大排列，橫列稱為「週期」（共7個），縱行稱為「族」（共18族）。" },
  { id:38, term:"常見族名與化學性質", def:"第1族為鹼金屬（鋰、鈉、鉀，質軟且活性大）；第2族為鹼土金屬（鎂、鈣、鋇）；第17族為鹵素；第18族為鈍氣（性質最安定）。" },
  { id:39, term:"分子", def:"由亞佛加厥提出，是表現純物質特性的最小單位，通常由兩個或以上原子結合而成。" },
  { id:40, term:"化學式書寫原則", def:"金屬元素在前，非金屬元素在後（如 NaCl）；含氧時氧在後（如 CO₂）；有機物依碳、氫、氧順序書寫（如 C₆H₁₂O₆）。" }
];

// ------------ DOM 元件 ------------
const boardEl = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const pairCountSelect = document.getElementById('pairCount');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const playerNameInput = document.getElementById('playerName');
const soundToggle = document.getElementById('soundToggle');

const leaderboardBtn = document.getElementById('leaderboardBtn');
const leaderboardModal = document.getElementById('leaderboardModal');
const leaderboardTableBody = document.querySelector('#leaderboardTable tbody');
const closeLbBtn = document.getElementById('closeLbBtn');
const clearLbBtn = document.getElementById('clearLbBtn');

const winModal = document.getElementById('winModal');
const winStats = document.getElementById('winStats');
const saveNameInput = document.getElementById('saveName');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const continueBtn = document.getElementById('continueBtn');

const confettiContainer = document.getElementById('confetti');

let deck = [];
let firstCard = null, secondCard = null;
let lockBoard = false;
let moves = 0, matches = 0;
let timerInterval = null, seconds = 0;
let playerName = localStorage.getItem('ll_playerName') || '';
playerNameInput.value = playerName;
saveNameInput.value = playerName;
const LB_KEY = 'll_leaderboard_v1';

// ------------ 時間與計數 ------------
function formatTime(s){
  const mm = String(Math.floor(s/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  return `${mm}:${ss}`;
}
function startTimer(){ clearInterval(timerInterval); seconds = 0; timerEl.textContent = formatTime(seconds);
  timerInterval = setInterval(()=>{ seconds++; timerEl.textContent = formatTime(seconds); },1000);
}
function stopTimer(){ clearInterval(timerInterval); }

// ------------ 建牌、洗牌與渲染 ------------
function buildDeck(selectedPairs){
  const d = [];
  selectedPairs.forEach(p=>{
    d.push({pairId:p.id, side:'term', text:p.term});
    d.push({pairId:p.id, side:'def', text:p.def});
  });
  return shuffleArray(d);
}
function shuffleArray(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function renderBoard(){
  boardEl.innerHTML = '';
  const total = deck.length;
  boardEl.classList.remove('cards-12','cards-24','cards-36');
  if(total<=12) boardEl.classList.add('cards-12');
  else if(total<=24) boardEl.classList.add('cards-24');
  else boardEl.classList.add('cards-36');

  deck.forEach((cardObj, idx)=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = idx;
    card.dataset.pairId = cardObj.pairId;
    card.setAttribute('role','button');
    card.setAttribute('aria-label','未翻開的卡片');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">?</div>
        <div class="card-face card-back"><p>${escapeHtml(truncateText(cardObj.text, 140))}</p></div>
      </div>
    `;
    card.addEventListener('click', ()=> onCardClick(card));
    boardEl.appendChild(card);
  });
}
function truncateText(s, maxLen){
  if(s.length<=maxLen) return s;
  return s.slice(0,maxLen-1)+'…';
}
function escapeHtml(text){
  return text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// ------------ 互動（翻卡、配對邏輯） ------------
function resetState(){
  firstCard = null; secondCard = null; lockBoard = false;
  moves = 0; matches = 0;
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
  timerEl.textContent = "00:00";
  stopTimer();
}
function onCardClick(cardEl){
  if(lockBoard) return;
  if(cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

  // start timer at first user action
  if(moves === 0 && matches === 0 && !timerInterval) startTimer();

  cardEl.classList.add('flipped');
  cardEl.setAttribute('aria-label','已翻開的卡片');

  if(!firstCard){
    firstCard = cardEl;
    playSound('flip');
    return;
  }
  secondCard = cardEl;
  lockBoard = true;
  moves++;
  movesEl.textContent = moves;

  const id1 = firstCard.dataset.pairId;
  const id2 = secondCard.dataset.pairId;
  const idx1 = Number(firstCard.dataset.index);
  const idx2 = Number(secondCard.dataset.index);
  const side1 = deck[idx1].side;
  const side2 = deck[idx2].side;

  if(id1 === id2 && side1 !== side2){
    // match
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    playSound('match');
    matches++;
    matchesEl.textContent = matches;
    setTimeout(()=>{
      firstCard.setAttribute('aria-label','配對成功');
      secondCard.setAttribute('aria-label','配對成功');
      firstCard = null; secondCard = null; lockBoard = false;
    },350);

    if(matches === deck.length/2){
      stopTimer();
      playSound('win');
      showConfetti();
      setTimeout(()=> showWinModal(), 200);
    }
  } else {
    // not match -> flip back
    playSound('mismatch');
    setTimeout(()=>{
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.setAttribute('aria-label','未翻開的卡片');
      secondCard.setAttribute('aria-label','未翻開的卡片');
      firstCard = null; secondCard = null; lockBoard = false;
    },900);
  }
}

// ------------ 遊戲啟動 ------------
function startGame(){
  resetState();
  const val = pairCountSelect.value;
  let selectedPairs = [];
  if(val === 'all'){
    selectedPairs = [...pairs];
  } else {
    const n = Number(val);
    const shuffled = shuffleArray([...pairs]);
    selectedPairs = shuffled.slice(0, Math.min(n, pairs.length));
  }
  deck = buildDeck(selectedPairs);
  deck = shuffleArray(deck);
  renderBoard();
}

// ------------ Leaderboard (localStorage) ------------
function loadLeaderboard(){
  try{
    const raw = localStorage.getItem(LB_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveLeaderboard(arr){
  localStorage.setItem(LB_KEY, JSON.stringify(arr));
}
function addScore(entry){
  const arr = loadLeaderboard();
  arr.push(entry);
  // sort: 配對數 desc, time asc, moves asc
  arr.sort((a,b)=>{
    if(a.matches !== b.matches) return b.matches - a.matches;
    if(a.time !== b.time) return a.time - b.time;
    return a.moves - b.moves;
  });
  // keep only top 100
  saveLeaderboard(arr.slice(0,100));
}
function renderLeaderboard(){
  const arr = loadLeaderboard();
  leaderboardTableBody.innerHTML = '';
  if(arr.length === 0){
    leaderboardTableBody.innerHTML = '<tr><td colspan="6">目前無紀錄</td></tr>'; return;
  }
  arr.forEach((r, i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${escapeHtml(r.name)}</td><td>${r.matches}</td><td>${formatTime(r.time)}</td><td>${r.moves}</td><td>${new Date(r.date).toLocaleString()}</td>`;
    leaderboardTableBody.appendChild(tr);
  });
}

// ------------ Win Modal ------------
function showWinModal(){
  winStats.innerHTML = `<p>時間：<strong>${formatTime(seconds)}</strong></p><p>步數：<strong>${moves}</strong></p><p>配對數：<strong>${matches}</strong></p>`;
  saveNameInput.value = playerNameInput.value || localStorage.getItem('ll_playerName') || '';
  winModal.setAttribute('aria-hidden','false');
}
function hideWinModal(){ winModal.setAttribute('aria-hidden','true'); }

// ------------ Confetti (簡單實作) ------------
function showConfetti(){
  const colors = ['#f56565','#ed8936','#ecc94b','#48bb78','#38b2ac','#4299e1','#9f7aea'];
  const count = 40;
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (Math.random()*100)+'%';
    el.style.top = (-5 - Math.random()*10)+'vh';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.width = (6 + Math.random()*8)+'px';
    el.style.height = (8 + Math.random()*12)+'px';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.animationDuration = (2 + Math.random()*2)+'s';
    confettiContainer.appendChild(el);
    setTimeout(()=> el.remove(), 3000);
  }
}

// ------------ Sound (WebAudio 產生，不需外部檔案) ------------
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx) audioCtx = new AudioCtx();
}
function playTone(freq, duration=0.12, type='sine', gain=0.08){
  if(!soundToggle.checked) return;
  ensureAudio();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g); g.connect(audioCtx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  setTimeout(()=> { o.stop(); o.disconnect(); g.disconnect(); }, duration*1000 + 20);
}
function playSound(name){
  if(!soundToggle.checked) return;
  try{
    if(name==='flip') playTone(900, 0.06, 'sine', 0.02);
    else if(name==='match') { playTone(880, 0.12, 'triangle', 0.06); playTone(1320, 0.08, 'sine', 0.04); }
    else if(name==='mismatch') playTone(240, 0.14, 'sawtooth', 0.04);
    else if(name==='win') { playTone(880,0.09,'sine',0.06); setTimeout(()=>playTone(1320,0.09,'sine',0.06),100); setTimeout(()=>playTone(1760,0.14,'sine',0.08),220); }
  }catch(e){ /* ignore audio errors on some browsers */ }
}

// ------------ 事件綁定 ------------
startBtn.addEventListener('click', ()=>{
  playerName = playerNameInput.value.trim();
  if(playerName) localStorage.setItem('ll_playerName', playerName);
  startGame();
});

leaderboardBtn.addEventListener('click', ()=>{
  renderLeaderboard();
  leaderboardModal.setAttribute('aria-hidden','false');
});
closeLbBtn.addEventListener('click', ()=> leaderboardModal.setAttribute('aria-hidden','true'));
clearLbBtn.addEventListener('click', ()=>{
  if(confirm('確定要清除所有排行榜紀錄嗎？此動作無法復原。')){
    saveLeaderboard([]); renderLeaderboard();
  }
});
window.addEventListener('click', (e)=>{
  if(e.target === leaderboardModal) leaderboardModal.setAttribute('aria-hidden','true');
  if(e.target === winModal) hideWinModal();
});

// 贏了之後儲存分數
saveScoreBtn.addEventListener('click', ()=>{
  const name = (saveNameInput.value || '匿名').trim();
  const entry = { name, matches, time: seconds, moves, date: new Date().toISOString() };
  addScore(entry);
  localStorage.setItem('ll_playerName', name);
  renderLeaderboard();
  winModal.setAttribute('aria-hidden','true');
  leaderboardModal.setAttribute('aria-hidden','false');
});
continueBtn.addEventListener('click', ()=>{
  hideWinModal();
});

// 初始化：自動開始（全部）
window.addEventListener('load', ()=>{
  pairCountSelect.value = 'all';
  // 如果 localStorage 有排行榜，載入以便快速檢視
  renderLeaderboard();
  startGame();
});