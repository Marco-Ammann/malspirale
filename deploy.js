const FtpClient = require('ftp');
const fs = require('fs');
const path = require('path');

// Configure FTP connection - Update these values with your real FTP credentials
const config = {
  host: 'ftp.malspirale.ch',  // Replace with your actual FTP host
  user: 'your-actual-username', // Replace with your FTP username
  password: 'your-actual-password', // Replace with your FTP password
  port: 21,
  secure: false  // Change to true if your host requires FTPS
};

// Remote directory on your FTP server where files should be uploaded
const remoteDir = '/public_html/';  // Adjust based on your hosting configuration

// Local directory with built files - use the browser subdirectory for Angular 16+
const localDir = path.join(__dirname, 'dist', 'malspirale', 'browser');

// Make sure the sendMail.php file exists in the remote directory
const specialFiles = [
  {
    local: path.join(__dirname, 'dist', 'malspirale', 'browser', 'sendMail.php'),
    remote: remoteDir + 'sendMail.php'
  }
];

// Connect to FTP server
const client = new FtpClient();
const pendingUploads = { count: 0 };

client.on('ready', () => {
  console.log('FTP connection established');
  
  // Upload special files first to ensure they're in the correct location
  uploadSpecialFiles(() => {
    // Then upload the rest of the directory
    uploadDirectory(localDir, remoteDir);
  });
});

// Upload special files that need specific handling
function uploadSpecialFiles(callback) {
  if (specialFiles.length === 0) {
    callback();
    return;
  }
  
  let filesUploaded = 0;
  
  specialFiles.forEach(file => {
    if (fs.existsSync(file.local)) {
      console.log(`Uploading special file: ${file.remote}`);
      
      client.put(file.local, file.remote, (err) => {
        if (err) {
          console.error(`Error uploading special file ${file.local}:`, err);
        } else {
          console.log(`Successfully uploaded special file: ${file.remote}`);
        }
        
        filesUploaded++;
        if (filesUploaded === specialFiles.length) {
          callback();
        }
      });
    } else {
      console.warn(`Special file ${file.local} not found, skipping...`);
      filesUploaded++;
      if (filesUploaded === specialFiles.length) {
        callback();
      }
    }
  });
}

function uploadDirectory(localDir, remoteDir) {
  fs.readdir(localDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${localDir}:`, err);
      return;
    }
    
    files.forEach(file => {
      const localPath = path.join(localDir, file);
      const remotePath = remoteDir + file;
      
      fs.stat(localPath, (err, stats) => {
        if (err) {
          console.error(`Error accessing ${localPath}:`, err);
          return;
        }
        
        if (stats.isDirectory()) {
          console.log(`Creating directory: ${remotePath}`);
          pendingUploads.count++;
          
          client.mkdir(remotePath, true, (err) => {
            if (err) {
              console.error(`Error creating directory ${remotePath}:`, err);
            } else {
              uploadDirectory(localPath, remotePath + '/');
            }
            pendingUploads.count--;
            checkIfComplete();
          });
        } else {
          console.log(`Uploading: ${remotePath}`);
          pendingUploads.count++;
          
          client.put(localPath, remotePath, (err) => {
            if (err) {
              console.error(`Error uploading ${file}:`, err);
            } else {
              console.log(`Successfully uploaded: ${remotePath}`);
            }
            pendingUploads.count--;
            checkIfComplete();
          });
        }
      });
    });
  });
}

function checkIfComplete() {
  if (pendingUploads.count === 0) {
    console.log('All files have been uploaded');
    client.end();
    console.log('FTP connection closed');
  }
}

client.on('error', (err) => {
  console.error('FTP error:', err);
  process.exit(1);
});

// Connect to the server
console.log('Connecting to FTP server...');
client.connect(config);
