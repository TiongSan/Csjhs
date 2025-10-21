# Firebase 設定指南

## 完成設定步驟

### 1. 更新 Firebase 配置
在 `game.html` 中找到這段程式碼，並替換為你的 Firebase 配置：

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 2. 設定 Firebase 安全性規則
1. 在 Firebase Console 中進入「Realtime Database」
2. 點擊「規則」頁籤
3. 將 `firebase-rules.json` 的內容複製貼上
4. 點擊「發布」

### 3. 測試遊戲
1. 開啟 `game.html`
2. 點擊「主持遊戲」→「產生PIN碼」
3. 在另一個瀏覽器分頁點擊「加入遊戲」
4. 輸入 PIN 碼和姓名
5. 回到主持人畫面點擊「開始遊戲」

## 資料庫結構

```
games/
  ├── {pin}/
      ├── pin: "1234"
      ├── started: false
      ├── startTime: null
      ├── ended: false
      └── players/
          └── {playerId}/
              ├── name: "玩家名稱"
              ├── score: 0
              ├── streak: 0
              ├── skillCards: []
              └── joinTime: timestamp
```

## 功能特色

✅ 即時多人遊戲
✅ 自動同步分數和排行榜
✅ 技能卡片系統
✅ 主持人控制台
✅ 即時統計資料

## 注意事項

- 確保網路連線穩定
- 建議在同一網路環境下測試
- 可以在手機和電腦間進行跨裝置遊戲
- 遊戲資料會自動保存在 Firebase 中