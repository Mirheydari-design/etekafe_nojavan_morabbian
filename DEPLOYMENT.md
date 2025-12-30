# 🚀 راهنمای استقرار (Deployment)

## ✅ چه کارهایی انجام شده است؟

1. ✅ **سرور Node.js** (`server.js`) ساخته شده که:
   - فایل HTML را serve می‌کند
   - به صورت خودکار `config.js` را از متغیرهای محیطی تولید می‌کند
   - نیازی به اجرای دستور `build-config.js` نیست

2. ✅ **پشتیبانی از متغیرهای محیطی**:
   - فایل `.env` برای تنظیمات محلی
   - متغیرهای محیطی سیستم برای production
   - پشتیبانی از cPanel

3. ✅ **راهنماهای کامل**:
   - `SETUP_GUIDE.md` - راهنمای کامل و جامع
   - `QUICK_START.md` - راهنمای سریع
   - `README.md` - به‌روزرسانی شده

---

## 📋 مراحل راه‌اندازی روی سرور

### مرحله 1: آماده‌سازی

```bash
# آپلود تمام فایل‌ها به سرور
# اطمینان حاصل کنید که این فایل‌ها وجود دارند:
# - etekaf.html
# - server.js
# - package.json
# - env.example
```

### مرحله 2: نصب Node.js (اگر نصب نیست)

```bash
# برای Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# بررسی
node --version  # باید 18.x یا بالاتر باشد
npm --version
```

### مرحله 3: نصب وابستگی‌ها

```bash
cd /path/to/your/project
npm install
```

### مرحله 4: تنظیم متغیرهای محیطی

**گزینه A: استفاده از فایل `.env`**

```bash
# کپی کردن فایل نمونه
cp env.example .env

# ویرایش فایل
nano .env
```

محتویات `.env`:
```env
API_KEY=morabbiyane_eetekafe_nojavan
BASE_URL=https://selfclaude.flearning.ir/
API_ENDPOINT=chat/completions
PORT=3000
HOST=0.0.0.0
```

**گزینه B: تنظیم در سیستم**

```bash
# ویرایش ~/.bashrc
nano ~/.bashrc

# اضافه کردن:
export API_KEY="morabbiyane_eetekafe_nojavan"
export BASE_URL="https://selfclaude.flearning.ir/"
export API_ENDPOINT="chat/completions"
export PORT="3000"
export HOST="0.0.0.0"

# اعمال تغییرات
source ~/.bashrc
```

**گزینه C: در cPanel**

1. وارد cPanel شوید
2. به **"Environment Variables"** یا **"Setup Node.js App"** بروید
3. متغیرهای زیر را اضافه کنید:
   - `API_KEY` = `morabbiyane_eetekafe_nojavan`
   - `BASE_URL` = `https://selfclaude.flearning.ir/`
   - `API_ENDPOINT` = `chat/completions`
   - `PORT` = `3000`
   - `HOST` = `0.0.0.0`

### مرحله 5: راه‌اندازی سرور

**برای تست:**
```bash
npm start
```

**برای production (با PM2):**
```bash
# نصب PM2
npm install -g pm2

# راه‌اندازی
pm2 start server.js --name etekaf-assistant

# ذخیره تنظیمات
pm2 save

# راه‌اندازی خودکار بعد از ریستارت
pm2 startup
```

### مرحله 6: تنظیم Reverse Proxy (اختیاری)

اگر می‌خواهید از پورت 80 یا 443 استفاده کنید، Nginx را تنظیم کنید:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔍 بررسی و تست

### 1. بررسی متغیرهای محیطی

```bash
echo $API_KEY
echo $BASE_URL
```

### 2. تست سرور

```bash
# بررسی config.js
curl http://localhost:3000/config.js

# باید خروجی شبیه این باشد:
# window.APP_CONFIG = {
#     apiKey: "morabbiyane_eetekafe_nojavan",
#     baseUrl: "https://selfclaude.flearning.ir/",
#     apiEndpoint: "chat/completions"
# };
```

### 3. تست در مرورگر

1. باز کردن `http://your-domain.com` یا `http://localhost:3000`
2. باز کردن Developer Tools (F12)
3. رفتن به تب Console
4. تایپ کردن: `console.log(window.APP_CONFIG)`
5. باید تنظیمات API را ببینید

---

## 🛠️ دستورات مفید PM2

```bash
# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs etekaf-assistant

# راه‌اندازی مجدد
pm2 restart etekaf-assistant

# توقف
pm2 stop etekaf-assistant

# حذف
pm2 delete etekaf-assistant

# مشاهده استفاده از منابع
pm2 monit
```

---

## 🔒 نکات امنیتی

1. ✅ **هرگز** فایل `.env` را در Git commit نکنید
2. ✅ **هرگز** فایل `config.js` را در Git commit نکنید (اگر حاوی API key است)
3. ✅ از HTTPS استفاده کنید
4. ✅ فایل `.gitignore` را بررسی کنید

---

## 📞 عیب‌یابی

### مشکل: "API key not configured"

**راه‌حل:**
1. بررسی کنید فایل `.env` وجود دارد و مقادیر درست است
2. بررسی کنید متغیرهای محیطی در سیستم تنظیم شده‌اند
3. بررسی کنید `config.js` به درستی تولید می‌شود

```bash
# بررسی فایل .env
cat .env

# بررسی config.js (باید از سرور serve شود)
curl http://localhost:3000/config.js
```

### مشکل: "Port 3000 is already in use"

**راه‌حل:**
```bash
# تغییر پورت در .env
PORT=8080

# یا در متغیرهای محیطی
export PORT=8080

# راه‌اندازی مجدد
pm2 restart etekaf-assistant
```

### مشکل: "Cannot find module 'dotenv'"

**راه‌حل:**
```bash
npm install
```

---

## 📚 فایل‌های راهنما

- **[QUICK_START.md](QUICK_START.md)** - راهنمای سریع
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - راهنمای کامل و جامع
- **[README.md](README.md)** - مستندات اصلی

---

**موفق باشید! 🎉**

