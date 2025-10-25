#!/usr/bin/env node

/**
 * Script để tìm IP address của máy tính
 * Chạy: node scripts/find-ip.js
 */

const { exec } = require('child_process');
const os = require('os');

function findIPAddress() {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    let command;
    
    if (platform === 'win32') {
      command = 'ipconfig';
    } else {
      command = 'ifconfig';
    }
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      
      const lines = stdout.split('\n');
      const ips = [];
      
      for (const line of lines) {
        // Tìm IPv4 addresses
        if (line.includes('IPv4') || line.includes('inet ')) {
          const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (match) {
            const ip = match[1];
            // Loại bỏ localhost và loopback
            if (!ip.startsWith('127.') && !ip.startsWith('169.254.')) {
              ips.push(ip);
            }
          }
        }
      }
      
      resolve(ips);
    });
  });
}

async function main() {
  try {
    console.log('🔍 Đang tìm IP address của máy tính...\n');
    
    const ips = await findIPAddress();
    
    if (ips.length === 0) {
      console.log('❌ Không tìm thấy IP address phù hợp');
      return;
    }
    
    console.log('✅ Tìm thấy các IP address:');
    ips.forEach((ip, index) => {
      console.log(`   ${index + 1}. ${ip}`);
    });
    
    console.log('\n📝 Cập nhật IP trong file config/api.js:');
    console.log(`   BASE_URL: 'http://${ips[0]}:5000'`);
    
    console.log('\n🚀 Để chạy server với IP này:');
    console.log(`   dotnet run --urls="http://0.0.0.0:5000"`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

main();
