# ⚡ راهنمای سریع راه‌اندازی

## 🚀 برای استفاده محلی (Development)

### 1. نصب وابستگی‌ها
```bash
npm install
```

### 2. ایجاد فایل `.env`
```bash
cp env.example .env
```

### 3. ویرایش فایل `.env`
```env
API_KEY=morabbiyane_eetekafe_nojavan
BASE_URL=https://selfclaude.flearning.ir/
API_ENDPOINT=chat/completions
```

### 4. راه‌اندازی سرور
```bash
npm start
```

### 5. باز کردن در مرورگر
```
http://localhost:3000
```

---

## 🌐 برای راه‌اندازی روی سرور (Production)

### روش 1: با Node.js (پیشنهادی)

```bash
# 1. آپلود فایل‌ها
# 2. نصب وابستگی‌ها
npm install

# 3. تنظیم متغیرهای محیطی (یکی از روش‌ها):
#    - ایجاد فایل .env
#    - یا تنظیم در cPanel
#    - یا export در سیستم

# 4. راه‌اندازی با PM2
npm install -g pm2
pm2 start server.js --name etekaf-assistant
pm2 save
pm2 startup
```

### روش 2: سرور استاتیک

```bash
# 1. تولید config.js
npm install
npm run build:config

# 2. آپلود فایل‌ها به public_html
# 3. استفاده از Apache/Nginx
```

---

## 📝 متغیرهای محیطی

| متغیر | مقدار پیش‌فرض | توضیح |
|-------|--------------|-------|
| `API_KEY` | - | کلید API بک‌اند |
| `BASE_URL` | `https://selfclaude.flearning.ir/` | آدرس پایه API |
| `API_ENDPOINT` | `chat/completions` | Endpoint API |
| `PORT` | `3000` | پورت سرور |
| `HOST` | `0.0.0.0` | آدرس سرور |

---

## 🔍 بررسی

```bash
# بررسی متغیرهای محیطی
echo $API_KEY

# تست سرور
curl http://localhost:3000/config.js
```

---

## 📚 راهنمای کامل

برای جزئیات بیشتر، فایل **[SETUP_GUIDE.md](SETUP_GUIDE.md)** را مطالعه کنید.

---

**موفق باشید! 🎉**
