# 理化連連看 — 國中八年級第六單元

這是一個以國中八年級第六單元理化重點為題庫的「連連看（配對）」遊戲，支援 GitHub Pages 部署，並內建以下功能：

主要功能
- 題庫：40 對（definition ↔ content），可於 script.js 中直接修改或擴充。
- 遊戲設定：可選擇配對數量（6 / 12 / 18 / 全部）。
- 計時、步數、已配對顯示。
- 聲音（使用 WebAudio API，無需外部音檔）與音效開關。
- 排行榜（localStorage），依配對數 → 時間 → 步數排序。
- 彩帶（confetti）結算動畫。
- 響應式設計，支援桌面與行動裝置。
- 可直接放到 GitHub Pages（根目錄）即能運行。

部署到 GitHub Pages
1. 將此專案放到 GitHub repo（例如 `youruser/chem-memory`）。
2. push 到 `main` 分支。
3. 到 GitHub repo 的 Settings → Pages（或 Pages）設定：
   - Source（來源）選擇：Branch = `main`，Folder = `/ (root)`。
4. 儲存後等幾分鐘，GitHub 會生成 Pages 網站，網址通常為：
   `https://<your-username>.github.io/<repo>/`

如何修改題庫
- 編輯 `script.js` 中的 `pairs` 陣列：
  - 範例：{ id: 41, term: "新的題目", def: "對應敘述" }
  - 注意：`id` 要唯一，系統以 pairId 判定配對。

進階擴充建議
- 將題庫放到外部 JSON，再使用 fetch 載入（需啟用伺服器）。
- 加入圖片或語音播放（示範：在 pairs 加入 image 或 audio 欄位，並修改 renderBoard）。
- 使用現成的 confetti 函式庫（例如 canvas-confetti）做更華麗的效果。
- 把排行榜同步到伺服器（需後端 API）。

授權
- MIT License — 你可以自由修改並用於教學或部署到 GitHub Pages。

若要我幫你：
- 直接產生完整 GitHub repo（包含 README、LICENSE、.gitignore），並示範如何使用 Git 指令推上 GitHub（我可以產生指令與檔案內容），或
- 把題庫改成「題目→中文/英文雙語」或「加入圖片與語音（我會示範如何放音檔 / 圖片）」，
請告訴我你要哪一方向，我會幫你產生下一步的檔案或修改版本。