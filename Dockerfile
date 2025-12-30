# استفاده از تصویر رسمی Node.js
FROM node:18-alpine

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های package.json و package-lock.json (اگر وجود دارد)
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install --production

# کپی تمام فایل‌های پروژه
COPY . .

# ایجاد پورت قابل دسترسی
EXPOSE 3000

# متغیرهای محیطی پیش‌فرض (می‌تواند با docker-compose override شود)
ENV PORT=3000
ENV HOST=0.0.0.0

# اجرای سرور
CMD ["npm", "start"]

