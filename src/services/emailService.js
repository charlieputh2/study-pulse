import nodemailer from 'nodemailer';

// Email configuration using Gmail App Password
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'studypulse2022@gmail.com',
    pass: 'hizq nric xerl emep' // App password
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
  welcome: (userEmail, userName) => ({
    subject: 'Welcome to Study Pulse - Registration Successful! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Study Pulse</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 40px 30px; text-align: center; color: white; }
          .logo { width: 60px; height: 60px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: #1d4ed8; }
          .content { padding: 40px 30px; }
          .welcome-title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 20px; }
          .welcome-text { color: #64748b; line-height: 1.6; margin-bottom: 30px; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
          .feature { padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center; }
          .feature-icon { width: 40px; height: 40px; background: #1d4ed8; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          .social-links { margin: 20px 0; }
          .social-link { display: inline-block; width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%; margin: 0 10px; line-height: 40px; text-align: center; color: #1d4ed8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SP</div>
            <h1>Study Pulse</h1>
            <p>Premium E-Commerce</p>
          </div>
          
          <div class="content">
            <h2 class="welcome-title">Welcome to Study Pulse, ${userName}! 🎉</h2>
            <p class="welcome-text">
              Thank you for joining Study Pulse! Your account has been successfully created. 
              You now have access to premium research compounds, peptides, and scientific supplies 
              with worldwide delivery.
            </p>
            
            <div class="features">
              <div class="feature">
                <div class="feature-icon">🔬</div>
                <h3>Premium Quality</h3>
                <p>99.9% purity tested compounds</p>
              </div>
              <div class="feature">
                <div class="feature-icon">🚚</div>
                <h3>Fast Shipping</h3>
                <p>2-3 days worldwide delivery</p>
              </div>
              <div class="feature">
                <div class="feature-icon">🛡️</div>
                <h3>SSL Secured</h3>
                <p>Your data is always protected</p>
              </div>
              <div class="feature">
                <div class="feature-icon">💬</div>
                <h3>24/7 Support</h3>
                <p>Always here to help you</p>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="https://studypulse.com/login" class="cta-button">Start Shopping Now</a>
            </div>
            
            <p style="color: #64748b; margin-top: 30px;">
              If you have any questions, feel free to contact our support team at 
              <a href="mailto:support@studypulse.com">support@studypulse.com</a>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 Study Pulse. All rights reserved.</p>
            <div class="social-links">
              <a href="#" class="social-link">f</a>
              <a href="#" class="social-link">t</a>
              <a href="#" class="social-link">in</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px;">
              You received this email because you registered for a Study Pulse account.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (userEmail, otpCode) => ({
    subject: 'Study Pulse - Password Reset OTP Code 🔐',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Study Pulse</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center; color: white; }
          .logo { width: 60px; height: 60px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: #ef4444; }
          .content { padding: 40px 30px; }
          .reset-title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 20px; }
          .reset-text { color: #64748b; line-height: 1.6; margin-bottom: 30px; }
          .otp-code { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .otp-number { font-size: 36px; font-weight: bold; color: #1d4ed8; letter-spacing: 8px; margin: 10px 0; }
          .expiry-warning { color: #ef4444; font-size: 14px; margin-top: 10px; }
          .security-tips { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SP</div>
            <h1>Password Reset</h1>
            <p>Study Pulse</p>
          </div>
          
          <div class="content">
            <h2 class="reset-title">Password Reset Request 🔐</h2>
            <p class="reset-text">
              We received a request to reset your password for your Study Pulse account. 
              Use the OTP code below to proceed with the password reset.
            </p>
            
            <div class="otp-code">
              <p style="margin: 0; color: #64748b;">Your OTP Code:</p>
              <div class="otp-number">${otpCode}</div>
              <p class="expiry-warning">⚠️ This code will expire in 10 minutes</p>
            </div>
            
            <div class="security-tips">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">🔒 Security Tips:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li>Never share this OTP code with anyone</li>
                <li>Study Pulse staff will never ask for your OTP</li>
                <li>This code can only be used once</li>
              </ul>
            </div>
            
            <p style="color: #64748b; margin-top: 30px;">
              If you didn't request this password reset, please ignore this email or 
              contact our support team immediately.
            </p>
            
            <p style="color: #64748b;">
              Need help? Contact us at <a href="mailto:support@studypulse.com">support@studypulse.com</a>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 Study Pulse. All rights reserved.</p>
            <p style="margin-top: 20px; font-size: 12px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  subscription: (userEmail) => ({
    subject: 'Welcome to Study Pulse Newsletter! 📧',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter Subscription - Study Pulse</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; color: white; }
          .logo { width: 60px; height: 60px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: #10b981; }
          .content { padding: 40px 30px; }
          .sub-title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 20px; }
          .sub-text { color: #64748b; line-height: 1.6; margin-bottom: 30px; }
          .benefits { background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .benefit-item { display: flex; align-items: center; margin: 15px 0; }
          .benefit-icon { width: 30px; height: 30px; background: #10b981; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SP</div>
            <h1>Successfully Subscribed!</h1>
            <p>Study Pulse Newsletter</p>
          </div>
          
          <div class="content">
            <h2 class="sub-title">Welcome to the Study Pulse Family! 🎉</h2>
            <p class="sub-text">
              Thank you for subscribing to our newsletter! You're now part of an exclusive community 
              that gets access to the latest research compounds, special deals, and scientific insights.
            </p>
            
            <div class="benefits">
              <h3 style="margin: 0 0 20px 0; color: #065f46;">What You'll Receive:</h3>
              <div class="benefit-item">
                <div class="benefit-icon">💰</div>
                <div>
                  <strong>Exclusive Deals</strong>
                  <p style="margin: 5px 0 0 0; color: #64748b;">Member-only discounts and special offers</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🆕</div>
                <div>
                  <strong>New Arrivals</strong>
                  <p style="margin: 5px 0 0 0; color: #64748b;">Be the first to know about new products</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🔬</div>
                <div>
                  <strong>Research Updates</strong>
                  <p style="margin: 5px 0 0 0; color: #64748b;">Latest scientific findings and insights</p>
                </div>
              </div>
            </div>
            
            <p style="color: #64748b; margin-top: 30px;">
              Stay tuned for exciting updates and exclusive content coming your way!
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 Study Pulse. All rights reserved.</p>
            <p style="margin-top: 20px; font-size: 12px;">
              You received this email because you subscribed to Study Pulse newsletter.
              <br>
              <a href="#" style="color: #64748b;">Unsubscribe</a> | <a href="#" style="color: #64748b;">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderUpdate: (userEmail, orderDetails) => ({
    subject: `Study Pulse - Order #${orderDetails.orderId} Update 📦`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update - Study Pulse</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; color: white; }
          .logo { width: 60px; height: 60px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: #8b5cf6; }
          .content { padding: 40px 30px; }
          .order-title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 20px; }
          .order-text { color: #64748b; line-height: 1.6; margin-bottom: 30px; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 10px 0; }
          .status-processing { background: #fef3c7; color: #92400e; }
          .status-shipped { background: #dbeafe; color: #1e40af; }
          .status-delivered { background: #d1fae5; color: #065f46; }
          .order-details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SP</div>
            <h1>Order Update</h1>
            <p>Study Pulse</p>
          </div>
          
          <div class="content">
            <h2 class="order-title">Order #${orderDetails.orderId} Update 📦</h2>
            <p class="order-text">
              Great news! Your order status has been updated. Here are the details:
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <span class="status-badge status-${orderDetails.status}">${orderDetails.status.toUpperCase()}</span>
            </div>
            
            <div class="order-details">
              <h3 style="margin: 0 0 15px 0; color: #1e293b;">Order Details:</h3>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderDetails.orderId}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${orderDetails.status}</p>
              <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDelivery}</p>
              <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${orderDetails.trackingNumber}</p>
            </div>
            
            <p style="color: #64748b; margin-top: 30px;">
              You can track your order in real-time on our website or contact our support team for any questions.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://studypulse.com/tracking" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Track My Order
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 Study Pulse. All rights reserved.</p>
            <p style="margin-top: 20px; font-size: 12px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Email sending functions
const emailService = {
  // Send welcome email after registration
  async sendWelcomeEmail(userEmail, userName) {
    try {
      const mailOptions = {
        from: 'Study Pulse <studypulse2022@gmail.com>',
        to: userEmail,
        ...emailTemplates.welcome(userEmail, userName)
      };

      await transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully to:', userEmail);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send password reset OTP
  async sendPasswordResetOTP(userEmail, otpCode) {
    try {
      const mailOptions = {
        from: 'Study Pulse <studypulse2022@gmail.com>',
        to: userEmail,
        ...emailTemplates.passwordReset(userEmail, otpCode)
      };

      await transporter.sendMail(mailOptions);
      console.log('Password reset OTP sent successfully to:', userEmail);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending password reset OTP:', error);
      return { success: false, error: error.message };
    }
  },

  // Send subscription confirmation
  async sendSubscriptionConfirmation(userEmail) {
    try {
      const mailOptions = {
        from: 'Study Pulse <studypulse2022@gmail.com>',
        to: userEmail,
        ...emailTemplates.subscription(userEmail)
      };

      await transporter.sendMail(mailOptions);
      console.log('Subscription confirmation sent successfully to:', userEmail);
      return { success: true, message: 'Subscription confirmation sent successfully' };
    } catch (error) {
      console.error('Error sending subscription confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  // Send order update notification
  async sendOrderUpdate(userEmail, orderDetails) {
    try {
      const mailOptions = {
        from: 'Study Pulse <studypulse2022@gmail.com>',
        to: userEmail,
        ...emailTemplates.orderUpdate(userEmail, orderDetails)
      };

      await transporter.sendMail(mailOptions);
      console.log('Order update sent successfully to:', userEmail);
      return { success: true, message: 'Order update sent successfully' };
    } catch (error) {
      console.error('Error sending order update:', error);
      return { success: false, error: error.message };
    }
  },

  // Generate OTP code
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Verify email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

export default emailService;
