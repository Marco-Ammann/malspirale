const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const distPath = path.join(__dirname, 'dist', 'malspirale');
const browserPath = path.join(distPath, 'browser');

// Run the build process
console.log('Building project...');
exec('npm run build:prod', (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error}`);
    return;
  }
  
  console.log('Build completed successfully');
  console.log(stdout);
  
  // Make sure sendMail.php is copied to the root level if needed
  ensureFilesInRoot(() => {
    // Run deployment
    console.log('Starting deployment...');
    exec('node deploy.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Deployment error: ${error}`);
        return;
      }
      
      console.log('Deployment completed successfully');
      console.log(stdout);
    });
  });
});

function ensureFilesInRoot(callback) {
  // List of files that need to be copied from browser directory to root
  const filesToCopy = [
    'sendMail.php',
    '.htaccess',
    // Add any other files that need to be at the root level
  ];
  
  let filesCopied = 0;
  
  filesToCopy.forEach(file => {
    const browserFilePath = path.join(browserPath, file);
    const rootFilePath = path.join(distPath, file);
    
    if (fs.existsSync(browserFilePath)) {
      try {
        fs.copyFileSync(browserFilePath, rootFilePath);
        console.log(`✓ Copied ${file} to root directory`);
      } catch (err) {
        console.error(`Error copying ${file} to root:`, err);
      }
    } else {
      console.warn(`File ${file} not found in browser directory`);
    }
    
    filesCopied++;
    if (filesCopied === filesToCopy.length) {
      callback();
    }
  });
}
