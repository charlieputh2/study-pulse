import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, '../data/users.json');

// Initialize database if it doesn't exist
const initDatabase = () => {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
};

// Read database
const readDatabase = () => {
  initDatabase();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [] };
  }
};

// Write to database
const writeDatabase = (data) => {
  try {
    const dbDir = path.dirname(DB_PATH);
    // Ensure directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Write to temporary file first
    const tempPath = DB_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    
    // Replace original file with temp file (atomic operation)
    fs.renameSync(tempPath, DB_PATH);
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    // Clean up temp file if it exists
    try {
      if (fs.existsSync(DB_PATH + '.tmp')) {
        fs.unlinkSync(DB_PATH + '.tmp');
      }
    } catch (e) {
      // Ignore cleanup errors
    }
    return false;
  }
};

// User database operations
const userService = {
  // Register new user
  async registerUser(userData) {
    console.log('=== userService.registerUser called ===');
    console.log('userData email:', userData.email);
    
    const db = readDatabase();
    console.log('Current users in DB:', db.users.length);
    
    // Check if email already exists
    const existingUser = db.users.find(user => user.email === userData.email);
    if (existingUser) {
      console.log('Email already exists:', userData.email);
      return { 
        success: false, 
        message: 'Email already registered' 
      };
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      fullName: userData.fullName,
      password: userData.password, // In production, hash this password
      photo: userData.photo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      role: 'user'
    };

    console.log('New user object created:', { id: newUser.id, email: newUser.email });

    // Add to database
    db.users.push(newUser);
    console.log('User added to DB array, total users now:', db.users.length);
    
    // Save to database
    const saved = writeDatabase(db);
    console.log('Database saved:', saved);
    
    if (saved) {
      // Remove password from response for security
      const { password, ...userResponse } = newUser;
      console.log('Registration successful for:', userData.email);
      return { 
        success: true, 
        message: 'User registered successfully',
        user: userResponse
      };
    } else {
      console.error('Failed to save to database');
      return { 
        success: false, 
        message: 'Failed to save user data' 
      };
    }
  },

  // Find user by email
  async findUserByEmail(email) {
    const db = readDatabase();
    const user = db.users.find(user => user.email === email);
    
    if (user) {
      // Remove password from response for security
      const { password, ...userResponse } = user;
      return { 
        success: true, 
        user: userResponse 
      };
    } else {
      return { 
        success: false, 
        message: 'User not found' 
      };
    }
  },

  // Update user password
  async updatePassword(email, newPassword) {
    const db = readDatabase();
    const userIndex = db.users.findIndex(user => user.email === email);
    
    if (userIndex === -1) {
      return { 
        success: false, 
        message: 'User not found' 
      };
    }

    // Update password
    db.users[userIndex].password = newPassword; // In production, hash this
    db.users[userIndex].updatedAt = new Date().toISOString();
    
    // Save to database
    const saved = writeDatabase(db);
    
    if (saved) {
      return { 
        success: true, 
        message: 'Password updated successfully' 
      };
    } else {
      return { 
        success: false, 
        message: 'Failed to update password' 
      };
    }
  },

  // Update user profile
  async updateUserProfile(userId, updateData) {
    const db = readDatabase();
    const userIndex = db.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return { 
        success: false, 
        message: 'User not found' 
      };
    }

    // Update user data
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Save to database
    const saved = writeDatabase(db);
    
    if (saved) {
      // Remove password from response for security
      const { password, ...userResponse } = db.users[userIndex];
      return { 
        success: true, 
        message: 'Profile updated successfully',
        user: userResponse
      };
    } else {
      return { 
        success: false, 
        message: 'Failed to update profile' 
      };
    }
  },

  // Get user by ID
  async getUserById(userId) {
    const db = readDatabase();
    const user = db.users.find(user => user.id === userId);
    
    if (user) {
      // Remove password from response for security
      const { password, ...userResponse } = user;
      return { 
        success: true, 
        user: userResponse 
      };
    } else {
      return { 
        success: false, 
        message: 'User not found' 
      };
    }
  },

  // Validate user credentials
  async validateUser(email, password) {
    const db = readDatabase();
    const user = db.users.find(user => user.email === email && user.password === password);
    
    if (user) {
      // Remove password from response for security
      const { password: _, ...userResponse } = user;
      return { 
        success: true, 
        user: userResponse 
      };
    } else {
      return { 
        success: false, 
        message: 'Invalid email or password' 
      };
    }
  },

  // Get all users (for admin)
  async getAllUsers() {
    const db = readDatabase();
    
    // Remove passwords from response for security
    const usersWithoutPasswords = db.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return { 
      success: true, 
      users: usersWithoutPasswords 
    };
  },

  // Delete user (for admin)
  async deleteUser(userId) {
    const db = readDatabase();
    const userIndex = db.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return { 
        success: false, 
        message: 'User not found' 
      };
    }

    // Remove user
    db.users.splice(userIndex, 1);
    
    // Save to database
    const saved = writeDatabase(db);
    
    if (saved) {
      return { 
        success: true, 
        message: 'User deleted successfully' 
      };
    } else {
      return { 
        success: false, 
        message: 'Failed to delete user' 
      };
    }
  }
};

export default userService;
