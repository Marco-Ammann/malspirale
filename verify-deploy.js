const fs = require('fs');
const path = require('path');

// Check if sendMail.php exists in the build output
const distPath = path.join(__dirname, 'dist', 'malspirale');
const browserPath = path.join(distPath, 'browser'); // New Angular structure has a browser subfolder
const sendMailPath = path.join(distPath, 'sendMail.php');
const browserSendMailPath = path.join(browserPath, 'sendMail.php');

console.log('Verifying deployment structure...');
console.log(`Checking for sendMail.php at: ${sendMailPath} and ${browserSendMailPath}`);

// Function to check and list files
function checkAndListFiles(dirPath, level = 0) {
  const indent = '  '.repeat(level);
  
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          console.log(`${indent}- ${file}/`);
          checkAndListFiles(filePath, level + 1);
        } else {
          console.log(`${indent}- ${file}`);
        }
      });
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }
}

let sendMailFound = false;

// Check root directory first
if (fs.existsSync(sendMailPath)) {
  console.log('✅ sendMail.php found in the correct location (root directory)');
  sendMailFound = true;
}

// Also check browser subdirectory
if (fs.existsSync(browserSendMailPath)) {
  console.log('✅ sendMail.php found in browser/ subdirectory');
  sendMailFound = true;
}

if (!sendMailFound) {
  console.error('❌ sendMail.php not found in build output! Check your angular.json configuration.');
  
  // List files in the dist folder to help debug
  console.log('\nFiles in dist/malspirale:');
  checkAndListFiles(distPath);
} else {
  // If sendMail.php is found in browser/ but not in root, copy it to root
  if (!fs.existsSync(sendMailPath) && fs.existsSync(browserSendMailPath)) {
    try {
      // Create a copy in the root directory for deployment
      fs.copyFileSync(browserSendMailPath, sendMailPath);
      console.log('✅ Copied sendMail.php from browser/ to root directory for deployment');
    } catch (err) {
      console.error('❌ Failed to copy sendMail.php to root directory:', err);
    }
  }
}

// Check if there's a server directory that shouldn't be there
const serverDirPath = path.join(distPath, 'server');
if (fs.existsSync(serverDirPath)) {
  console.warn('⚠️ Found a "server" directory in the build output. PHP files should be at root level.');
}

// Check if the PHP file has the right permissions (Unix only)
if (process.platform !== 'win32' && fs.existsSync(sendMailPath)) {
  try {
    const stats = fs.statSync(sendMailPath);
    const mode = stats.mode & parseInt('777', 8);
    console.log(`PHP file permissions: ${mode.toString(8)}`);
    
    if ((mode & parseInt('755', 8)) !== parseInt('755', 8)) {
      console.warn('⚠️ PHP file doesn\'t have execute permissions. Consider running: chmod 755 sendMail.php');
    }
  } catch (err) {
    console.error('Error checking PHP file permissions:', err);
  }
}
