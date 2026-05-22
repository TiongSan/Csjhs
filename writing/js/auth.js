// ====== auth.js：帳號與進度管理模組 ======

// 儲存學生基本資料 (移除姓名)
let userInfo = {
  className: "",
  studentNumber: "",
};

// 網頁一載入，自動產生班級與座號的下拉選單
window.addEventListener("DOMContentLoaded", () => {
  const classSelect = document.getElementById("login-class");
  const numSelect = document.getElementById("login-number");

  // 產生 701 ~ 709 班
  for (let i = 1; i <= 9; i++) {
    classSelect.innerHTML += `<option value="70${i}">70${i}</option>`;
  }
  // 產生 1 ~ 40 號
  for (let i = 1; i <= 40; i++) {
    let num = i < 10 ? "0" + i : i; // 確保 1 號變成 01
    numSelect.innerHTML += `<option value="${num}">${i}</option>`;
  }
});

// 1. 登入功能
function login() {
  const classInput = document.getElementById("login-class").value;
  const numberInput = document.getElementById("login-number").value;

  if (!classInput || !numberInput) {
    alert("請選擇你的班級與座號喔！");
    return;
  }

  // 存入變數中
  userInfo.className = classInput;
  userInfo.studentNumber = numberInput;

  // 隱藏登入遮罩
  document.getElementById("login-modal").style.display = "none";

  // 啟動主程式 (app.js 裡的函數)
  if (typeof initApp === "function") {
    initApp();
  }
}

// 2. 產生紀錄碼與 QR Code (使用標籤格式)
function showQRCodeModal(completedCount, totalScore) {
  // 💡 改用標籤與直線 | 來分隔
  // TW=專案代號(TaigiWriting), G=班級, N=座號, C=完成字數, S=總分
  const encodedData = `TW|G${userInfo.className}|N${userInfo.studentNumber}|C${completedCount}|S${totalScore}`;

  // 把代碼顯示在畫面上讓學生可以複製
  document.getElementById("save-code-text").innerText = encodedData;

  const qrcodeContainer = document.getElementById("qrcode-box");
  qrcodeContainer.innerHTML = "";

  // QR Code 也是直接畫這串標籤文字
  new QRCode(qrcodeContainer, {
    text: encodedData,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  document.getElementById("qrcode-modal").style.display = "flex";
}
function closeQRCodeModal() {
  document.getElementById("qrcode-modal").style.display = "none";
}

// 3. 一鍵上傳到 Google 表單
function submitToGoogleForm() {
  // 取得畫面上剛剛產生的紀錄碼
  const code = document.getElementById("save-code-text").innerText;

  // ⚠️ 請替換成你自己的 Google 表單網址與 entry 代號
  // 注意網址結尾是 viewform
  const formBaseUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScDInn5Vn1UwxYqzeuMhcdZAFE20ErqPURU8zurg_lRsWwbUg/viewform?usp=sharing";
  const entryId = "entry.487437124"; // 替換成你的題目代碼

  // 將網址與代碼組合起來
  const finalUrl = `${formBaseUrl}?usp=pp_url&${entryId}=${encodeURIComponent(code)}`;

  // 開啟新分頁，讓學生直接點擊「提交」
  window.open(finalUrl, "_blank");
}
