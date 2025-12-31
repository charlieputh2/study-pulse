import express from 'express';
import emailService from '../services/emailService.js';

const router = express.Router();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();
const subscriptions = new Set();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !emailService.isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address is required' 
      });
    }

    // Check if already subscribed
    if (subscriptions.has(email)) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email already subscribed to newsletter' 
      });
    }

    // Add to subscriptions
    subscriptions.add(email);

    // Send confirmation email
    const emailResult = await emailService.sendSubscriptionConfirmation(email);
    
    if (!emailResult.success) {
      // Remove from subscriptions if email fails
      subscriptions.delete(email);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send confirmation email',
        error: emailResult.error 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Send password reset OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !emailService.isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address is required' 
      });
    }

    // Generate OTP
    const otp = emailService.generateOTP();
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(email, {
      otp: otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0
    });

    // Send OTP email
    const emailResult = await emailService.sendPasswordResetOTP(email, otp);
    
    if (!emailResult.success) {
      // Remove OTP if email fails
      otpStore.delete(email);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP',
        error: emailResult.error 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent to your email address',
      // Don't send OTP in response for security
      email: email.substring(0, 3) + '***' + email.substring(email.indexOf('@'))
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Verify OTP and allow password reset
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate inputs
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, OTP, and new password are required' 
      });
    }

    // Check if OTP exists and is valid
    const storedOTP = otpStore.get(email);
    
    if (!storedOTP) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP not found or expired' 
      });
    }

    // Check if OTP has expired
    if (Date.now() > storedOTP.expires) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one' 
      });
    }

    // Check if too many attempts
    if (storedOTP.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false, 
        message: 'Too many attempts. Please request a new OTP' 
      });
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      storedOTP.attempts++;
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again' 
      });
    }

    // OTP is valid - remove it
    otpStore.delete(email);

    // In a real application, you would update the password in your database
    // For now, we'll just return success
    console.log(`Password reset successful for ${email}`);

    res.status(200).json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Send welcome email (for registration)
router.post('/welcome', async (req, res) => {
  try {
    const { email, userName } = req.body;

    // Validate inputs
    if (!email || !userName || !emailService.isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email and user name are required' 
      });
    }

    // Send welcome email
    const emailResult = await emailService.sendWelcomeEmail(email, userName);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send welcome email',
        error: emailResult.error 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Welcome email sent successfully' 
    });

  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Send order update notification
router.post('/order-update', async (req, res) => {
  try {
    const { email, orderDetails } = req.body;

    // Validate inputs
    if (!email || !orderDetails || !emailService.isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email and order details are required' 
      });
    }

    // Send order update email
    const emailResult = await emailService.sendOrderUpdate(email, orderDetails);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send order update',
        error: emailResult.error 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Order update sent successfully' 
    });

  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get subscription status
router.get('/subscription-status/:email', (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email || !emailService.isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address is required' 
      });
    }

    const isSubscribed = subscriptions.has(email);
    
    res.status(200).json({ 
      success: true, 
      isSubscribed: isSubscribed 
    });

  } catch (error) {
    console.error('Subscription status check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !emailService.isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address is required' 
      });
    }

    const wasSubscribed = subscriptions.has(email);
    subscriptions.delete(email);

    res.status(200).json({ 
      success: true, 
      message: wasSubscribed ? 
        'Successfully unsubscribed from newsletter' : 
        'Email was not subscribed'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Clean up expired OTPs (run periodically)
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expires) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export default router;
