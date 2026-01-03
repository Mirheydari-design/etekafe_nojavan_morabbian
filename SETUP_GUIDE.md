# 📖 راهنمای کامل راه‌اندازی روی سرور

این راهنما به شما کمک می‌کند تا اپلیکیشن را روی سرور راه‌اندازی کنید.

## 🎯 روش‌های راه‌اندازی

### روش 1: استفاده از سرور Node.js (پیشنهادی) ⭐

این روش بهترین است چون:
- ✅ به صورت خودکار `config.js` را از متغیرهای محیطی تولید می‌کند
- ✅ نیازی به اجرای دستور `build-config.js` نیست
- ✅ هر بار که سرور راه می‌افتد، config به‌روز می‌شود

#### مرحله 1: آپلود فایل‌ها به سرور

تمام فایل‌های پروژه را به سرور آپلود کنید:
- `etekaf.html`
- `server.js`
- `package.json`
- `env.example` (برای مرجع)
- سایر فایل‌های HTML (اگر دارید)

#### مرحله 2: نصب Node.js و npm

اگر Node.js روی سرور نصب نیست:

```bash
# برای Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# بررسی نصب
node --version
npm --version
```

#### مرحله 3: نصب وابستگی‌ها

در پوشه پروژه:

```bash
npm install
```

این دستور پکیج `dotenv` را نصب می‌کند.

#### مرحله 4: تنظیم متغیرهای محیطی

**گزینه A: استفاده از فایل `.env` (پیشنهادی برای توسعه)**

```bash
# کپی کردن فایل نمونه
cp env.example .env

# ویرایش فایل .env
nano .env
```

محتویات فایل `.env`:

```env
API_KEY=morabbiyane_eetekafe_nojavan
BASE_URL=https://selfclaude.flearning.ir/
API_ENDPOINT=v1/chat/completions
PORT=3000
HOST=0.0.0.0
```

**گزینه B: تنظیم متغیرهای محیطی در سیستم (پیشنهادی برای production)**

```bash
# ویرایش فایل ~/.bashrc یا ~/.profile
nano ~/.bashrc

# اضافه کردن این خطوط:
export API_KEY="morabbiyane_eetekafe_nojavan"
export BASE_URL="https://selfclaude.flearning.ir/"
export API_ENDPOINT="chat/completions"
export PORT="3000"
export HOST="0.0.0.0"

# اعمال تغییرات
source ~/.bashrc
```

**گزینه C: تنظیم در cPanel (اگر از cPanel استفاده می‌کنید)**

1. وارد cPanel شوید
2. به بخش **"Environment Variables"** یا **"Setup Node.js App"** بروید
3. متغیرهای زیر را اضافه کنید:
   - `API_KEY` = `morabbiyane_eetekafe_nojavan`
   - `BASE_URL` = `https://selfclaude.flearning.ir/`
   - `API_ENDPOINT` = `chat/completions`
   - `PORT` = `3000`
   - `HOST` = `0.0.0.0`

#### مرحله 5: راه‌اندازی سرور

**برای تست:**

```bash
npm start
```

یا:

```bash
node server.js
```

سرور روی `http://localhost:3000` راه می‌افتد.

**برای production (با PM2):**

```bash
# نصب PM2
npm install -g pm2

# راه‌اندازی با PM2
pm2 start server.js --name etekaf-assistant

# ذخیره تنظیمات PM2
pm2 save

# تنظیم برای راه‌اندازی خودکار بعد از ریستارت
pm2 startup
```

#### مرحله 6: تنظیم Reverse Proxy (Nginx)

اگر می‌خواهید از پورت 80 یا 443 استفاده کنید:

```nginx
# /etc/nginx/sites-available/etekaf
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

سپس:

```bash
# فعال کردن سایت
sudo ln -s /etc/nginx/sites-available/etekaf /etc/nginx/sites-enabled/

# تست تنظیمات
sudo nginx -t

# راه‌اندازی مجدد Nginx
sudo systemctl restart nginx
```

---

### روش 2: استفاده از سرور استاتیک (Apache/Nginx)

اگر نمی‌خواهید از Node.js استفاده کنید:

#### مرحله 1: تولید فایل config.js

```bash
# تنظیم متغیرهای محیطی
export API_KEY="morabbiyane_eetekafe_nojavan"
export BASE_URL="https://selfclaude.flearning.ir/"
export API_ENDPOINT="chat/completions"

# تولید config.js
npm install
npm run build:config
```

یا به صورت دستی فایل `config.js` را بسازید:

```javascript
window.APP_CONFIG = {
    apiKey: "morabbiyane_eetekafe_nojavan",
    baseUrl: "https://selfclaude.flearning.ir/",
    apiEndpoint: "v1/chat/completions"
};
```

#### مرحله 2: آپلود فایل‌ها

تمام فایل‌ها را به پوشه `public_html` یا `www` آپلود کنید.

#### مرحله 3: تنظیم Apache/Nginx

فایل‌ها به صورت استاتیک serve می‌شوند. نیازی به تنظیم خاصی نیست.

---

## 🔍 بررسی و تست

### بررسی متغیرهای محیطی

```bash
# بررسی متغیرهای محیطی
echo $API_KEY
echo $BASE_URL
echo $API_ENDPOINT
```

### تست سرور

```bash
# بررسی اینکه سرور در حال اجرا است
curl http://localhost:3000/config.js

# باید خروجی شبیه این باشد:
# window.APP_CONFIG = {
#     apiKey: "morabbiyane_eetekafe_nojavan",
#     ...
# };
```

### تست در مرورگر

1. باز کردن `http://your-domain.com` یا `http://localhost:3000`
2. باز کردن Developer Tools (F12)
3. رفتن به تب Console
4. تایپ کردن: `console.log(window.APP_CONFIG)`
5. باید تنظیمات API را ببینید

---

## 🛠️ عیب‌یابی

### مشکل: "API key not configured"

**راه‌حل:**
1. بررسی کنید فایل `.env` وجود دارد و مقادیر درست است
2. بررسی کنید متغیرهای محیطی در سیستم تنظیم شده‌اند
3. بررسی کنید `config.js` به درستی تولید شده است

```bash
# بررسی فایل .env
cat .env

# بررسی config.js
cat config.js
```

### مشکل: "Cannot find module 'dotenv'"

**راه‌حل:**
```bash
npm install
```

### مشکل: "Port 3000 is already in use"

**راه‌حل:**
```bash
# تغییر پورت در .env
PORT=8080

# یا در متغیرهای محیطی
export PORT=8080
```

### مشکل: "CORS Error"

**راه‌حل:**
API بک‌اند باید CORS را برای دامنه شما فعال کند. با تیم بک‌اند تماس بگیرید.

---

## 📝 چک‌لیست راه‌اندازی

- [ ] Node.js و npm نصب شده است
- [ ] فایل‌های پروژه آپلود شده‌اند
- [ ] `npm install` اجرا شده است
- [ ] فایل `.env` ایجاد شده و مقادیر پر شده‌اند
- [ ] یا متغیرهای محیطی در سیستم تنظیم شده‌اند
- [ ] سرور با `npm start` راه‌اندازی شده است
- [ ] `config.js` به درستی تولید می‌شود (در روش Node.js خودکار است)
- [ ] اپلیکیشن در مرورگر باز می‌شود
- [ ] درخواست‌های API به درستی ارسال می‌شوند

---

## 🔒 نکات امنیتی

1. **هرگز** فایل `.env` را در Git commit نکنید
2. **هرگز** فایل `config.js` را در Git commit نکنید (اگر حاوی API key است)
3. از HTTPS استفاده کنید
4. API key را در کد سمت کلاینت قرار ندهید (در حال حاضر در `config.js` است که در مرورگر قابل مشاهده است - اگر نیاز به امنیت بیشتر دارید، از یک پروکسی استفاده کنید)

---

## 📞 پشتیبانی

اگر مشکلی دارید:
1. لاگ‌های کنسول را بررسی کنید
2. Network tab در Developer Tools را بررسی کنید
3. با تیم بک‌اند برای فرمت دقیق API تماس بگیرید

---

**موفق باشید! 🚀**

