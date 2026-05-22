// ====== auth.js：帳號與進度管理模組 ======

// 儲存學生基本資料 (移除姓名)
let userInfo = {
    className: "",
    studentNumber: ""
};

// 網頁一載入，自動產生班級與座號的下拉選單
window.addEventListener('DOMContentLoaded', () => {
    const classSelect = document.getElementById('login-class');
    const numSelect = document.getElementById('login-number');
    
    // 產生 701 ~ 709 班
    for(let i = 1; i <= 9; i++) {
        classSelect.innerHTML += `<option value="70${i}">70${i}</option>`;
    }
    // 產生 1 ~ 40 號
    for(let i = 1; i <= 40; i++) {
        let num = i < 10 ? '0' + i : i; // 確保 1 號變成 01
        numSelect.innerHTML += `<option value="${num}">${i}</option>`;
    }
});

// 1. 登入功能
function login() {
    const classInput = document.getElementById('login-class').value;
    const numberInput = document.getElementById('login-number').value;

    if (!classInput || !numberInput) {
        alert("請選擇你的班級與座號喔！");
        return;
    }

    // 存入變數中
    userInfo.className = classInput;
    userInfo.studentNumber = numberInput;

    // 隱藏登入遮罩
    document.getElementById('login-modal').style.display = 'none';
    
    // 啟動主程式 (app.js 裡的函數)
    if (typeof initApp === 'function') {
        initApp();
    }
}

// 2. 產生紀錄碼與 QR Code (格式改為：班級_座號_完成字數_總分)
function showQRCodeModal(completedCount, totalScore) {
    const rawData = `${userInfo.className}_${userInfo.studentNumber}_${completedCount}_${totalScore}`;
    const encodedData = btoa(encodeURIComponent(rawData));
    
    document.getElementById('save-code-text').innerText = encodedData;
    
    const qrcodeContainer = document.getElementById('qrcode-box');
    qrcodeContainer.innerHTML = ""; 
    
    new QRCode(qrcodeContainer, {
        text: encodedData,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H 
    });

    document.getElementById('qrcode-modal').style.display = 'flex';
}

function closeQRCodeModal() {
    document.getElementById('qrcode-modal').style.display = 'none';
}