#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Study Pulse Backend Deployment...\n');

// Check if required files exist
const requiredFiles = [
  'src/server.js',
  'src/routes/userRoutes.js',
  'src/routes/emailRoutes.js',
  'package.json'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ Missing: ${file}`);
    process.exit(1);
  }
});

// Create deployment directory
const deployDir = './deploy-backend';
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true });
}
fs.mkdirSync(deployDir, { recursive: true });

console.log('\n📦 Creating deployment package...');

// Copy necessary files
const filesToCopy = [
  'src/server.js',
  'src/routes/',
  'package.json',
  'package-lock.json',
  '.env.production'
];

filesToCopy.forEach(file => {
  const src = file;
  const dest = path.join(deployDir, file);
  
  // Create destination directory if it doesn't exist
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  if (fs.statSync(file).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.copyFileSync(src, dest);
  }
  console.log(`📄 Copied: ${file}`);
});

// Create production package.json
const prodPackageJson = {
  ...JSON.parse(fs.readFileSync('./package.prod.json', 'utf8')),
  scripts: {
    start: "node src/server.js",
    test: "curl http://localhost:5000/api/health"
  }
};

fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(prodPackageJson, null, 2)
);

// Rename .env.production to .env
if (fs.existsSync(path.join(deployDir, '.env.production'))) {
  fs.renameSync(
    path.join(deployDir, '.env.production'),
    path.join(deployDir, '.env')
  );
}

// Create uploads directory
fs.mkdirSync(path.join(deployDir, 'uploads'), { recursive: true });

console.log('\n✅ Backend deployment package created successfully!');
console.log(`📁 Deployment directory: ${deployDir}`);
console.log('\n📋 Deployment Instructions:');
console.log('1. Upload the entire deploy-backend folder to your server');
console.log('2. Run: npm install');
console.log('3. Run: npm start');
console.log('4. Test: curl http://your-domain.com:5000/api/health');
console.log('\n🌐 Your API will be available at: http://your-domain.com:5000/api');
