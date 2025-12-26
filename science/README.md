```markdown
# 理化連連看 — 國中八年級第六單元（精簡版）

這個版本已移除排行榜與玩家名稱紀錄，提供一個可直接玩的配對遊戲網頁（適合放到 GitHub Pages）。

主要功能
- 題庫：40 對（definition ↔ content），可於 script.js 中直接修改或擴充。
- 遊戲設定：可選擇配對數量（6 / 12 / 18 / 全部）。
- 計時、步數、已配對顯示。
- 音效（使用 WebAudio API，無需外部音檔）與音效開關。
- 彩帶（confetti）結算動畫。
- 響應式設計，支援桌面與行動裝置。

部署到 GitHub Pages
1. 把檔案（index.html、style.css、script.js、README.md）放到 repo 的根目錄。
2. push 到 `main` 分支。
3. 到 GitHub repo 的 Settings → Pages 設定：
   - Source（來源）選擇：Branch = `main`，Folder = `/ (root)`。
4. 等幾分鐘後，網站會在 GitHub Pages 上可用。

如何修改題庫
- 編輯 `script.js` 中的 `pairs` 陣列：
  - 範例：{ id: 41, term: "新的題目", def: "對應敘述" }
  - 注意：`id` 要唯一，系統以 pairId 判定配對。

如果你還想：
- 加入圖片或語音提示（我可以示範如何在 pairs 增加 image/audio 欄位並載入資源），或
- 把頁面打包成可直接上傳的 ZIP 或直接產生完整 repo（包含 LICENSE 與 .gitignore），
告訴我你的需求，我會幫你產生對應檔案或指令。