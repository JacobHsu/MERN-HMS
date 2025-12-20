# Railway 部署指南

## 準備工作

在部署到 Railway 之前，請確保：
1. 已經有 Railway 帳號（https://railway.app）
2. 已經將專案推送到 GitHub
3. MongoDB 資料庫已準備好（可以使用 MongoDB Atlas 或 Railway 的 MongoDB 插件）

## 部署步驟

### 1. 在 Railway 創建新專案

1. 登入 Railway Dashboard
2. 點擊 "New Project"
3. 選擇 "Deploy from GitHub repo"
4. 選擇你的 MERN-HMS 儲存庫
5. 選擇 `backend` 目錄作為根目錄

### 2. 配置環境變量

在 Railway 專案的 Variables 頁面中，添加以下環境變量：

#### 必需的環境變量

```env
# Server Configuration
PORT=4000

# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_connection_string

# Cloudinary Configuration (圖片上傳服務)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# JWT Secret (請使用強隨機字串)
JWT_SECRET=your_strong_random_jwt_secret_here

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

# CORS Configuration (前端和後台 URL)
FRONTEND_URL=https://your-frontend-url.vercel.app
ADMIN_URL=https://your-admin-url.vercel.app
```

#### 可選的環境變量（支付功能）

```env
# Payment Gateway - Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Payment Gateway - Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Currency
CURRENCY=INR
```

### 3. 設定 MongoDB

#### 選項 A: 使用 MongoDB Atlas（推薦）

1. 前往 https://www.mongodb.com/cloud/atlas
2. 創建免費的 M0 cluster
3. 在 Network Access 中添加 Railway 的 IP（或允許所有 IP: 0.0.0.0/0）
4. 創建資料庫使用者
5. 獲取連接字串並設定到 `MONGODB_URI`

#### 選項 B: 使用 Railway MongoDB 插件

1. 在 Railway 專案中點擊 "New"
2. 選擇 "Database" → "MongoDB"
3. Railway 會自動生成 `MONGO_URL` 變量
4. 在你的 backend 服務中添加引用：`MONGODB_URI=${{MongoDB.MONGO_URL}}`

### 4. 設定 Cloudinary

1. 前往 https://cloudinary.com 註冊帳號
2. 在 Dashboard 中找到：
   - Cloud Name
   - API Key
   - API Secret
3. 將這些值設定到對應的環境變量中

### 5. 生成強 JWT Secret

使用以下命令生成安全的隨機字串：

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 或使用 OpenSSL
openssl rand -hex 64
```

### 6. 部署設定

Railway 會自動檢測 `railway.toml` 配置文件並執行：
- 使用 Nixpacks 建置
- 執行 `node server.js` 啟動服務
- 失敗時自動重啟（最多 10 次）

### 7. 確認部署

部署完成後：

1. 檢查 Railway 部署日誌，確認沒有錯誤
2. 訪問 Railway 提供的 URL（例如：`https://your-app.up.railway.app`）
3. 應該看到 "API Working" 訊息
4. 測試 API endpoints：
   - `GET /api/user/test`
   - `GET /api/admin/test`
   - `GET /api/doctor/test`

## 環境變量說明

### PORT
- Railway 會自動設定 PORT，但你也可以手動設定為 4000

### MONGODB_URI
- MongoDB 連接字串
- 格式：`mongodb+srv://username:password@cluster.mongodb.net/database_name`
- 確保 IP 白名單包含 Railway 的 IP 或允許所有 IP

### CLOUDINARY_*
- 用於上傳和管理醫生照片、患者記錄等圖片
- 必須設定才能使用圖片上傳功能

### JWT_SECRET
- 用於加密和驗證 JWT tokens
- 必須是強隨機字串（至少 64 個字元）
- 生產環境請勿使用預設值

### FRONTEND_URL & ADMIN_URL
- 前端和後台的部署 URL
- 用於 CORS 設定，確保只有這些來源可以訪問 API
- 部署前端後需要更新這些值

### STRIPE_SECRET_KEY & RAZORPAY_*
- 支付功能所需（可選）
- 如果不使用支付功能，可以不設定或使用測試密鑰

## 常見問題

### Q: 部署後 API 無法訪問？
A: 檢查：
1. Railway 日誌中是否有錯誤
2. MongoDB 連接是否成功
3. 環境變量是否正確設定
4. PORT 是否正確

### Q: CORS 錯誤？
A: 確保：
1. `FRONTEND_URL` 和 `ADMIN_URL` 正確設定
2. URL 不包含結尾的斜線
3. 使用正確的協議（https）

### Q: MongoDB 連接失敗？
A: 檢查：
1. MongoDB Atlas 的 IP 白名單
2. 資料庫使用者權限
3. 連接字串格式是否正確
4. 網路連接是否正常

### Q: Cloudinary 上傳失敗？
A: 確認：
1. Cloudinary 憑證是否正確
2. API Key 和 Secret 沒有多餘空格
3. Cloud Name 拼寫正確

## 後續步驟

部署成功後：

1. **更新前端配置**：
   - 將 Railway 的 backend URL 設定到前端的 API 配置中

2. **設定自定義域名**（可選）：
   - 在 Railway 專案設定中添加自定義域名
   - 更新 DNS 記錄

3. **監控和日誌**：
   - 定期檢查 Railway 日誌
   - 設定錯誤通知

4. **資料庫備份**：
   - 設定 MongoDB Atlas 自動備份
   - 定期匯出重要資料

5. **安全性檢查**：
   - 確保所有 secrets 都是強隨機值
   - 定期更新依賴套件
   - 檢查 CORS 設定是否過於寬鬆

## 支援

如有問題，請參考：
- Railway 文檔：https://docs.railway.app
- MongoDB Atlas 文檔：https://docs.atlas.mongodb.com
- Cloudinary 文檔：https://cloudinary.com/documentation

## 重要提醒

⚠️ **安全性**：
- 永遠不要將 `.env` 文件提交到 Git
- 使用強隨機字串作為 secrets
- 定期輪換敏感憑證
- 在 MongoDB Atlas 中限制 IP 訪問（如果可能）

✅ **最佳實踐**：
- 使用環境變量管理所有配置
- 定期更新依賴套件
- 監控應用效能和錯誤
- 設定適當的日誌級別
