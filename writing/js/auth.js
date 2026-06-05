// ====== auth.js：帳號與進度管理模組 ======

let pendingSaveData = null; // 暫存解析後的存檔資料，等待身分驗證

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

  if (pendingSaveData) {
    // 🛡️ 執行防弊驗證：比對選擇的班級座號是否與存檔一致
    if (classInput === pendingSaveData.className && numberInput === pendingSaveData.studentNumber) {
      // ✅ 驗證成功：放行並載入進度
      userInfo = { className: classInput, studentNumber: numberInput };
      document.getElementById("user-info-display").innerText = `目前身分：${userInfo.className} 班 ${userInfo.studentNumber} 號`;
      document.getElementById("login-modal").style.display = "none";
      
      if (typeof initApp === "function") {
        initApp(pendingSaveData); // 將存檔資料傳給主程式
      }
      pendingSaveData = null;   // 清空暫存
    } else {
      // ❌ 驗證失敗：觸發防弊懲罰
      alert("🛑 身分驗證失敗！這不是你的存檔喔！");
      pendingSaveData = null; 
      
      // 清除網址列的 ?save 參數，強制重頭開始
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // 介面恢復為「正常登入模式」
      document.querySelector("#login-modal h2").innerText = "📝 歡迎來到台語生字簿";
      document.querySelector("#login-modal .btn-start").innerText = "開始練習";
    }
  } else {
    // 正常新遊戲流程 (無存檔)
    userInfo = { className: classInput, studentNumber: numberInput };
    document.getElementById("user-info-display").innerText = `目前身分：${userInfo.className} 班 ${userInfo.studentNumber} 號`;
    document.getElementById("login-modal").style.display = "none";
    
    if (typeof initApp === "function") {
      initApp(null); 
    }
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

// 4. 解析紀錄碼
function parseSaveCode(code) {
  try {
    const classMatch = code.match(/G(\d+)/);
    const numberMatch = code.match(/N(\d+)/);
    const countMatch = code.match(/C(\d+)/);
    const scoreMatch = code.match(/S(\d+)/);

    if (classMatch && numberMatch && countMatch && scoreMatch) {
      return {
        className: classMatch[1],
        studentNumber: numberMatch[1],
        completedCount: parseInt(countMatch[1], 10),
        totalScore: parseInt(scoreMatch[1], 10),
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}

// 5. 網址攔截與狀態還原
function checkUrlForSaveData() {
  const urlParams = new URLSearchParams(window.location.search);
  const saveCode = urlParams.get("save");
  
  const titleEl = document.querySelector("#login-modal h2");
  const btnEl = document.querySelector("#login-modal .btn-start");

  if (saveCode) {
    pendingSaveData = parseSaveCode(saveCode);
    if (pendingSaveData) {
      // 🌟 進入「解鎖模式」：修改畫面提示，但不關閉視窗
      if (titleEl) titleEl.innerText = "🔒 偵測到存檔紀錄！請選擇班級座號以解鎖";
      if (btnEl) btnEl.innerText = "解鎖進度";
      return; // 停留在這裡，等待使用者按下按鈕
    } else {
      alert("⚠️ 讀檔失敗：紀錄碼格式不正確，請手動登入。");
    }
  }
  
  // 如果沒有存檔，或解析失敗，確保顯示「正常登入模式」
  if (titleEl) titleEl.innerText = "📝 歡迎來到台語生字簿";
  if (btnEl) btnEl.innerText = "開始練習";
}

// 網頁載入時呼叫
window.addEventListener("DOMContentLoaded", checkUrlForSaveData);
