/**
 * سرور ساده Node.js برای serve کردن فایل HTML
 * این سرور فایل‌های استاتیک را serve می‌کند و از متغیرهای محیطی استفاده می‌کند
 * 
 * استفاده:
 *   node server.js
 * 
 * یا:
 *   npm start
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// خواندن متغیرهای محیطی
const apiKey = process.env.API_KEY || '';
const baseUrl = process.env.BASE_URL || 'https://selfclaude.flearning.ir/';
const apiEndpoint = process.env.API_ENDPOINT || 'v1/chat/completions';

// تولید محتوای config.js از متغیرهای محیطی
const configContent = `// فایل تنظیمات API - به صورت خودکار از متغیرهای محیطی تولید شده
// ⚠️ این فایل را به صورت دستی ویرایش نکنید - از .env استفاده کنید

window.APP_CONFIG = {
    apiKey: "${apiKey}",
    baseUrl: "${baseUrl}",
    apiEndpoint: "${apiEndpoint}"
};
`;

// تابع برای تعیین نوع محتوا (MIME type)
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    return types[ext] || 'application/octet-stream';
}

// ایجاد سرور
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    // اگر root است، etekaf.html را نشان بده
    if (filePath === './') {
        filePath = './etekaf.html';
    }
    
    // اگر درخواست config.js است، از متغیرهای محیطی تولید کن
    if (filePath === './config.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end(configContent);
        return;
    }
    
    // خواندن فایل
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // فایل پیدا نشد
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <!DOCTYPE html>
                    <html lang="fa" dir="rtl">
                    <head>
                        <meta charset="UTF-8">
                        <title>404 - فایل پیدا نشد</title>
                    </head>
                    <body style="font-family: Tahoma; text-align: center; padding: 50px;">
                        <h1>404 - فایل پیدا نشد</h1>
                        <p>فایل درخواستی یافت نشد: ${req.url}</p>
                    </body>
                    </html>
                `);
            } else {
                // خطای سرور
                res.writeHead(500);
                res.end(`خطای سرور: ${err.code}`);
            }
        } else {
            // فایل پیدا شد
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.end(content, 'utf-8');
        }
    });
});

// راه‌اندازی سرور
server.listen(PORT, HOST, () => {
    console.log('🚀 سرور راه‌اندازی شد!');
    console.log(`📡 در حال گوش دادن به: http://${HOST}:${PORT}`);
    console.log(`🌐 باز کردن در مرورگر: http://localhost:${PORT}`);
    console.log('');
    console.log('⚙️  تنظیمات:');
    console.log(`   🔑 API Key: ${apiKey ? '***' + apiKey.slice(-4) : '❌ تنظیم نشده'}`);
    console.log(`   🌐 Base URL: ${baseUrl}`);
    console.log(`   📍 Endpoint: ${apiEndpoint}`);
    console.log('');
    console.log('💡 برای توقف سرور: Ctrl+C');
});

