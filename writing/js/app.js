// ====== 核心變數 ======
let traceableChars = [];
let charElements = [];
let currentIndex = 0;

// Canvas 畫布設定
const bgCtx = document
  .getElementById("bgCanvas")
  .getContext("2d", { willReadFrequently: true });
const userCanvas = document.getElementById("userCanvas");
const userCtx = userCanvas.getContext("2d", { willReadFrequently: true });
const maskCtx = document
  .getElementById("maskCanvas")
  .getContext("2d", { willReadFrequently: true });

let maskData = null;
let maskTotalPixels = 0;
let isDrawing = false;
let checkTimeout = null;

// ====== 1. 系統初始化 ======
function initApp() {
  const articleDiv = document.getElementById("article-display");
  articleDiv.innerHTML = "";

  // 讀取 data.js 中的第一篇文章
  const textToPractice = articleData[0].content;
  let traceIndex = 0;

  for (let char of textToPractice) {
    const span = document.createElement("span");
    span.innerText = char;
    span.className = "char";

    // 使用 data.js 定義的正規表達式過濾
    if (ignoreRegex.test(char)) {
      span.classList.add("punctuation");
    } else {
      span.dataset.index = traceIndex;
      traceableChars.push(char);
      charElements.push(span);
      traceIndex++;
    }
    articleDiv.appendChild(span);
  }

  document.getElementById("progress-text").innerText =
    `0 / ${traceableChars.length}`;
  loadCharacter(0);
  setupEvents();
}

// ====== 2. 載入單一字體 ======
function loadCharacter(index) {
  if (index >= traceableChars.length) {
    showFinalCelebration(); // 呼叫 rewards.js 的功能
    return;
  }

  currentIndex = index;
  const char = traceableChars[index];

  // 更新課文 UI
  charElements.forEach((el) => el.classList.remove("active"));
  charElements[index].classList.add("active");
  charElements[index].scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("progress-text").innerText =
    `${index + 1} / ${traceableChars.length}`;
  document.getElementById("feedback-msg").innerText = "";

  // 畫給學生看的背景字
  bgCtx.clearRect(0, 0, 300, 300);
  bgCtx.font = "bold 200px sans-serif";
  bgCtx.fillStyle = "rgba(0, 0, 0, 0.12)";
  bgCtx.textAlign = "center";
  bgCtx.textBaseline = "middle";
  bgCtx.fillText(char, 150, 160);

  // 畫程式判斷用的隱形遮罩 (純黑色)
  maskCtx.clearRect(0, 0, 300, 300);
  maskCtx.font = "bold 200px sans-serif";
  maskCtx.fillStyle = "#000000";
  maskCtx.textAlign = "center";
  maskCtx.textBaseline = "middle";
  maskCtx.fillText(char, 150, 160);

  // 計算標準字的面積
  const imgData = maskCtx.getImageData(0, 0, 300, 300).data;
  maskTotalPixels = 0;
  for (let i = 3; i < imgData.length; i += 4) {
    if (imgData[i] > 128) maskTotalPixels++;
  }
  maskData = imgData;

  clearUserCanvas();
}

// ====== 防呆加強版：繪畫互動控制 ======

function getCoords(e) {
  const rect = userCanvas.getBoundingClientRect();
  // 嚴謹判斷是「觸控」還是「滑鼠」
  let clientX =
    e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
  let clientY =
    e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;
  clearTimeout(checkTimeout);
  const { x, y } = getCoords(e);

  console.log("✏️ 偵測到下筆！座標：", x, y); // 偵錯雷達

  // 💡 關鍵修正：必須先設定「畫筆顏色與粗細」，再開始畫，否則會變成透明或 1px 的黑線
  userCtx.lineWidth = 26;
  userCtx.lineCap = "round";
  userCtx.lineJoin = "round";
  // 故意改成半透明的亮綠色，這樣畫上去就能清楚看到有沒有蓋在灰字上
  userCtx.strokeStyle = "rgba(76, 175, 80, 0.8)";

  userCtx.beginPath();
  userCtx.moveTo(x, y);
  // 讓使用者就算只有「輕輕點一下」不拖曳，也能畫出一個圓點
  userCtx.lineTo(x, y + 0.1);
  userCtx.stroke();
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const { x, y } = getCoords(e);

  userCtx.lineTo(x, y);
  userCtx.stroke();
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  console.log("🛑 偵測到停筆，準備批改..."); // 偵錯雷達

  // 停筆後等待 600ms 進行批改
  checkTimeout = setTimeout(validateDrawing, 600);
}

function clearUserCanvas() {
  userCtx.clearRect(0, 0, 300, 300);
  document.getElementById("feedback-msg").innerText = "";
}

// ====== 4. 像素檢核核心 ======
function validateDrawing() {
  const userData = userCtx.getImageData(0, 0, 300, 300).data;
  let userTotalPixels = 0;
  let maskCovered = 0;

  for (let i = 3; i < userData.length; i += 4) {
    if (userData[i] > 50) {
      userTotalPixels++;
      if (maskData[i] > 50) maskCovered++;
    }
  }

  if (userTotalPixels === 0) return;

  const coverageRate = maskCovered / maskTotalPixels;
  const scribbleRatio = userTotalPixels / maskTotalPixels;
  const msgEl = document.getElementById("feedback-msg");

  if (coverageRate > 0.55 && scribbleRatio < 2.3) {
    // 過關！
    charElements[currentIndex].classList.remove("active");
    charElements[currentIndex].classList.add("done");
    addScoreAndCombo(); // 呼叫 rewards.js 的功能

    setTimeout(() => loadCharacter(currentIndex + 1), 300);
  } else if (scribbleRatio >= 2.3) {
    msgEl.innerText = "畫出界太多了！請跟著灰字寫喔！";
    msgEl.style.color = "#e91e63";
    breakCombo(); // 呼叫 rewards.js 的功能
  } else {
    msgEl.innerText = "筆畫還沒寫完喔，繼續補滿！";
    msgEl.style.color = "#ff9800";
  }
}

// ====== 5. 事件監聽器與啟動 ======
function setupEvents() {
  userCanvas.addEventListener("mousedown", startDrawing);
  userCanvas.addEventListener("mousemove", draw);
  userCanvas.addEventListener("mouseup", stopDrawing);
  userCanvas.addEventListener("mouseout", stopDrawing);
  userCanvas.addEventListener("touchstart", startDrawing, { passive: false });
  userCanvas.addEventListener("touchmove", draw, { passive: false });
  userCanvas.addEventListener("touchend", stopDrawing);

  document
    .getElementById("btn-clear")
    .addEventListener("click", clearUserCanvas);
  document.getElementById("btn-skip").addEventListener("click", () => {
    breakCombo();
    charElements[currentIndex].classList.remove("active");
    charElements[currentIndex].classList.add("done");
    charElements[currentIndex].style.color = "#888";
    loadCharacter(currentIndex + 1);
  });
}
