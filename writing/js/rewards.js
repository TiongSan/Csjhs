// 獎勵系統變數
let currentScore = 0;
let currentCombo = 0;

// 取得 UI 元素
const scoreText = document.getElementById("score-text");
const comboBadge = document.getElementById("combo-badge");
const comboText = document.getElementById("combo-text");

// 加分與增加連擊
function addScoreAndCombo() {
  currentScore += 10;
  currentCombo += 1;

  scoreText.innerText = currentScore;

  if (currentCombo >= 2) {
    comboText.innerText = currentCombo;
    comboBadge.classList.add("active");
    // 重新觸發彈跳動畫
    comboBadge.style.animation = "none";
    setTimeout(() => (comboBadge.style.animation = ""), 10);
  }
}

// 亂塗或跳過時，中斷連擊
function breakCombo() {
  currentCombo = 0;
  comboBadge.classList.remove("active");
}

// 全部完成或按下儲存時的慶祝與結算
function showFinalCelebration() {
  // 呼叫 auth.js 裡的函數，並把目前的進度丟給它
  showQRCodeModal(currentIndex, currentScore);
}
