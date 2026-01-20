import express from 'express';
import userService from '../services/userService.js';
import emailService from '../services/emailService.js';
import userProfileService from '../services/userProfileService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single('photo'); // Make photo optional by not requiring it

// Custom multer error handler middleware
const multerErrorHandler = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
};

// Optional photo upload middleware
const optionalPhotoUpload = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
};

// Middleware to handle both JSON and FormData
const flexibleBodyParser = (req, res, next) => {
  if (req.get('Content-Type') && req.get('Content-Type').includes('multipart/form-data')) {
    // Use multer for FormData
    upload.single('photo')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        });
      }
      next();
    });
  } else {
    // Use express.json for regular JSON
    express.json()(req, res, next);
  }
};

// Register new user
router.post('/register', flexibleBodyParser, async (req, res) => {
  console.log('=== REGISTER ROUTE HIT ===');
  console.log('Method:', req.method);
  console.log('Content-Type:', req.get('Content-Type'));
  
  try {
    // Handle both JSON and FormData
    let fullName, email, password, confirmPassword, acceptTerms;
    
    if (req.get('Content-Type') && req.get('Content-Type').includes('multipart/form-data')) {
      // FormData request
      fullName = req.body.fullName;
      email = req.body.email;
      password = req.body.password;
      confirmPassword = req.body.confirmPassword;
      acceptTerms = req.body.acceptTerms;
      console.log('FormData request - body keys:', Object.keys(req.body));
      console.log('File info:', req.file ? { filename: req.file.filename, size: req.file.size } : 'No file');
    } else {
      // JSON request
      ({ fullName, email, password, confirmPassword, acceptTerms } = req.body);
      console.log('JSON request - body keys:', Object.keys(req.body));
    }
    
    console.log('Extracted data:', { fullName, email, password: '***', confirmPassword: '***', acceptTerms });

    // Validate required fields
    if (!fullName || !email || !password) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Full name, email, and password are required' 
      });
    }

    // Validate email format
    if (!emailService.isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address is required' 
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    // Validate terms acceptance
    if (acceptTerms !== 'true' && acceptTerms !== true) {
      console.log('Validation failed - terms not accepted:', acceptTerms);
      return res.status(400).json({ 
        success: false, 
        message: 'You must accept the terms and conditions' 
      });
    }

    // Prepare user data
    const userData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password, // In production, hash this password
      photo: req.file ? `/uploads/avatars/${req.file.filename}` : null
    };

    // Register user
    const result = await userService.registerUser(userData);

    if (result.success) {
      console.log('Registration successful:', userData.email);
      
      // Send optional services asynchronously (don't wait for them)
      // This prevents registration from failing if these services fail
      setImmediate(async () => {
        try {
          // Try to create user profile in Supabase (non-blocking)
          if (userProfileService) {
            try {
              console.log('Creating user profile in Supabase for:', userData.email);
              const profileResult = await userProfileService.createUserProfile(userData);
              
              if (profileResult && profileResult.success) {
                console.log('User profile created in Supabase successfully');
              } else {
                console.warn('Failed to create user profile in Supabase:', profileResult?.error);
              }
            } catch (profileError) {
              console.warn('Supabase profile creation error (non-blocking):', profileError?.message);
            }
          }
          
          // Try to send welcome email (non-blocking)
          if (emailService && emailService.sendWelcomeEmail) {
            try {
              console.log('Sending welcome email to:', userData.email);
              const emailResult = await emailService.sendWelcomeEmail(userData.email, userData.fullName);
              if (emailResult?.success) {
                console.log('Welcome email sent successfully');
              } else {
                console.warn('Welcome email failed:', emailResult?.error);
              }
            } catch (emailError) {
              console.warn('Welcome email error:', emailError?.message);
            }
          }
        } catch (err) {
          console.warn('Error in optional services:', err?.message);
        }
      });
      
      console.log('Sending success response');
      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        user: result.user
      });
    } else {
      console.log('Registration failed:', result);
      return res.status(400).json(result);
    }

  } catch (error) {
    console.error('Registration endpoint error:', error);
    console.error('Error stack:', error.stack);
    
    // Return detailed error message
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test Supabase connection
router.get('/test-supabase', async (req, res) => {
  try {
    const userProfileService = await import('../services/userProfileService.js');
    const profileService = userProfileService.default;
    
    // Test creating a profile
    const testData = {
      email: 'test@example.com',
      fullName: 'Test User'
    };
    
    const result = await profileService.createUserProfile(testData);
    
    res.json({
      success: true,
      message: 'Supabase connection test completed',
      result: result
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    res.status(500).json({
      success: false,
      message: 'Supabase connection failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Validate user credentials
    const result = await userService.validateUser(email.trim().toLowerCase(), password);

    if (result.success) {
      // Create session/token (in production, use JWT)
      const sessionData = {
        userId: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        photo: result.user.photo,
        loginTime: new Date().toISOString()
      };

      // Store session (in production, use proper session management)
      req.session.user = sessionData;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        session: sessionData
      });
    } else {
      res.status(401).json(result);
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during login' 
    });
  }
});

// Update user profile
router.put('/profile', upload.single('photo'), async (req, res) => {
  try {
    const userId = req.session.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const { fullName, email } = req.body;
    const updateData = {};

    // Add fields to update
    if (fullName) updateData.fullName = fullName.trim();
    if (email && emailService.isValidEmail(email)) {
      updateData.email = email.trim().toLowerCase();
    }
    
    // Add photo if uploaded
    if (req.file) {
      updateData.photo = `/uploads/avatars/${req.file.filename}`;
    }

    // Update user profile
    const result = await userService.updateUserProfile(userId, updateData);

    if (result.success) {
      // Update session if user data changed
      if (req.session.user) {
        req.session.user = { ...req.session.user, ...result.user };
      }
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: result.user
      });
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during profile update' 
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.session.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const result = await userService.getUserById(userId);

    if (result.success) {
      res.status(200).json({
        success: true,
        user: result.user
      });
    } else {
      res.status(404).json(result);
    }

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  try {
    // Clear session
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error during logout' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during logout' 
    });
  }
});

// Check authentication status
router.get('/auth-status', (req, res) => {
  try {
    if (req.session.user) {
      res.status(200).json({
        success: true,
        isAuthenticated: true,
        user: req.session.user
      });
    } else {
      res.status(200).json({
        success: true,
        isAuthenticated: false
      });
    }

  } catch (error) {
    console.error('Auth status check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Upload avatar only
router.post('/upload-avatar', upload.single('photo'), async (req, res) => {
  try {
    const userId = req.session.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Update user with new photo
    const updateData = {
      photo: `/uploads/avatars/${req.file.filename}`
    };

    const result = await userService.updateUserProfile(userId, updateData);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        photo: updateData.photo
      });
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during upload' 
    });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const userId = req.session.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const result = await userService.deleteUser(userId);

    if (result.success) {
      // Clear session
      req.session.destroy();
      
      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during account deletion' 
    });
  }
});

export default router;
