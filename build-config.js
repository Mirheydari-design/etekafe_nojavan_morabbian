/**
 * اسکریپت برای تولید فایل config.js از متغیرهای محیطی
 * 
 * استفاده:
 *   node build-config.js
 * 
 * یا در package.json:
 *   npm run build:config
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// خواندن متغیرهای محیطی
const apiKey = process.env.API_KEY || '';
const baseUrl = process.env.BASE_URL || 'https://selfclaude.flearning.ir/';
const apiEndpoint = process.env.API_ENDPOINT || 'chat/completions';
const promptsUrl = process.env.PROMPTS_URL || '';

// محتوای فایل config.js
const configContent = `// فایل تنظیمات API - به صورت خودکار از .env تولید شده
// ⚠️ این فایل را به صورت دستی ویرایش نکنید - از .env استفاده کنید

window.APP_CONFIG = {
    apiKey: "${apiKey}",
    baseUrl: "${baseUrl}",
    apiEndpoint: "${apiEndpoint}",
    promptsUrl: "${promptsUrl}"
};
`;

// نوشتن فایل config.js
const configPath = path.join(__dirname, 'config.js');
fs.writeFileSync(configPath, configContent, 'utf8');

console.log('✅ فایل config.js با موفقیت تولید شد!');
console.log(`📁 مسیر: ${configPath}`);
console.log(`🔑 API Key: ${apiKey ? '***' + apiKey.slice(-4) : '❌ تنظیم نشده'}`);
console.log(`🌐 Base URL: ${baseUrl}`);

