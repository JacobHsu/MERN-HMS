# Prescripto - 醫院管理系統

## 專案簡介
**Prescripto** 是一個基於 MERN 技術棧構建的綜合性醫院管理系統，旨在提升醫院運營效率。該系統包含安全的使用者認證、高效的預約調度、患者記錄管理以及醫患之間的即時通訊等功能。它提供了一個可擴展且使用者友好的平台，用於簡化醫療工作流程並改善就醫體驗。

## 主要功能
- **使用者認證**：為患者、醫生和管理員提供安全的登入系統
- **預約調度**：輕鬆實現預約的預訂、改期和取消
- **患者記錄管理**：儲存、存取和更新患者健康記錄
- **醫患溝通**：為諮詢和追蹤提供即時訊息功能
- **管理員儀表板**：管理使用者、預約並檢視資料分析
- **安全資料儲存**：使用 MongoDB 確保患者隱私和資料安全

## 技術棧
- **前端**：React.js
- **後端**：Node.js 和 Express.js
- **資料庫**：MongoDB
- **身份驗證**：JWT (JSON Web Tokens)
- **狀態管理**：Redux（可選）

## 快速開始

### 快速啟動（推薦）

我們提供了便捷的腳本來管理整個專案：

**Windows (PowerShell)：**
```powershell
# 安裝所有依賴
.\dev.ps1 install

# 啟動所有服務（後端、前台、後台）
.\dev.ps1 start

# 清理所有依賴
.\dev.ps1 clean
```

**Linux/macOS (Bash)：**
```bash
# 安裝所有依賴
./dev.sh install

# 啟動所有服務（後端、前台、後台）
./dev.sh start

# 清理所有依賴
./dev.sh clean
```

詳細說明請參閱[開發指南](./開發指南.md)。

### 前置需求
- 已安裝 Node.js（建議 v18 或更高版本）
- 已安裝 MongoDB 或擁有 MongoDB 雲端實例存取權限
- 已安裝 Git
- 已安裝 pnpm（`npm install -g pnpm`）

### 手動安裝

如果您更喜歡手動安裝和執行服務：

1. **複製儲存庫**
   ```bash
   git clone https://github.com/your-username/Prescripto-Hospital_Management_System.git
   cd Prescripto-Hospital_Management_System
   ```

2. **為各個服務安裝相依套件**
   ```bash
   # 後端
   cd backend
   pnpm install
   cd ..

   # 前台
   cd frontend
   pnpm install
   cd ..

   # 後台
   cd admin
   pnpm install
   cd ..
   ```

3. **設定環境變數**

   在 `backend` 目錄下建立 `.env` 檔案，包含以下內容：
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **啟動服務（需要 3 個終端）**

   終端 1 - 後端：
   ```bash
   cd backend
   pnpm run server
   ```

   終端 2 - 前台：
   ```bash
   cd frontend
   pnpm run dev
   ```

   終端 3 - 後台：
   ```bash
   cd admin
   pnpm run dev
   ```

# 相關主題
醫院管理、MERN 技術棧、MongoDB、Express.js、React、Node.js、醫療應用程式、患者記錄、預約系統。

# 參考

[Prescripto-Hospital_Management_System](https://github.com/meniraj07/Prescripto-Hospital_Management_System)  

# 授權條款
本專案採用 MIT 授權條款。
