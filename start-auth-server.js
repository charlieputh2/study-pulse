#!/usr/bin/env node

// Simple script to start the authentication server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Study Pulse Authentication Server...');
console.log('📍 Server directory:', join(__dirname, 'src'));

// Start the server
const serverProcess = spawn('node', [join(__dirname, 'src', 'server.js')], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`📡 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill('SIGTERM');
});

console.log('✅ Server starting on http://localhost:5000');
console.log('🔗 API endpoints:');
console.log('   POST /api/users/register - Register new user');
console.log('   POST /api/users/login - Login user');
console.log('   GET  /api/health - Health check');
console.log('\n💡 Press Ctrl+C to stop the server');
