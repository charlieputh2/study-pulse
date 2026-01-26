import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Navigation, Upload, Check, XCircle, MapPin, Package, ShieldCheck, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { useShippingLocations } from '../hooks/useShippingLocations';
import { supabase } from '../lib/supabase';
import { useImageUpload } from '../hooks/useImageUpload';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  product?: {
    id: string;
    name: string;
    image?: string;
    purity_percentage?: number;
  };
  variation?: {
    id: string;
    name: string;
    value: string;
    description?: string;
  };
  option?: {
    id: string;
    name: string;
    value: string;
    description?: string;
  };
}

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }): React.ReactNode => {
  const { paymentMethods } = usePaymentMethods();
  const { locations: shippingLocations, getShippingFee } = useShippingLocations();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Customer Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping Details
  const [address, setAddress] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [shippingLocation, setShippingLocation] = useState<'LUZON' | 'VISAYAS' | 'MINDANAO' | 'MAXIM' | ''>('');

  // Courier Selection
  const [selectedCourier, setSelectedCourier] = useState<'LBC' | 'J&T' | 'LALAMOVE' | ''>('');
  const [isCOD, setIsCOD] = useState(false);
  const [paymentType, setPaymentType] = useState<'prepaid' | 'cod'>('prepaid'); // New payment type state

  // User Account
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Login Modal States
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(''); // Initialize as empty string
  const [contactMethod, setContactMethod] = useState<'messenger' | ''>('messenger');
  const [notes, setNotes] = useState('');
  const [orderMessage, setOrderMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Payment Proof
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { uploadImage, uploading: isUploadingProof } = useImageUpload('payment-proofs');
  
  // Promo Code State
  const [appliedPromo] = useState<any>(null);
  const [discountAmount] = useState(0);

  // Helper functions to resolve TypeScript comparison errors
  const getStepClassName = (currentStep: string, targetStep: string, baseClass: string, activeClass: string) => {
    if (currentStep === targetStep) return activeClass;
    return baseClass;
  };

  const getStepIndicator = (currentStep: string) => {
    if (currentStep === 'details') return '1';
    if (currentStep === 'payment') return '2';
    return '✓';
  };

  const getStepText = (currentStep: string) => {
    if (currentStep === 'details') return 'Details';
    if (currentStep === 'payment') return 'Payment';
    return 'Complete';
  };

  const getProgressWidth = (currentStep: string) => {
    if (currentStep === 'details') return '0%';
    if (currentStep === 'payment') return '50%';
    return '100%';
  };

  const getPaymentStepIndicator = (currentStep: string) => {
    if (currentStep === 'confirmation') return '✓';
    return '2';
  };

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  React.useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].id);
    }
    // Auto-select first payment method when they load
    if (paymentMethods.length > 0 && step === 'payment' && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethod, step]);

  // Calculate shipping fee based on location (uses dynamic fees from database)
  const shippingFee = shippingLocation ? getShippingFee(shippingLocation) : 0;

  // Calculate courier shipping fee
  const getCourierFee = () => {
    if (selectedCourier === 'LBC') {
      return isCOD ? 150 : 0; // LBC has COD fee but no shipping fee
    } else if (selectedCourier === 'J&T') {
      return 0; // Always free shipping
    } else if (selectedCourier === 'LALAMOVE') {
      return 0; // Not free but payment first
    }
    return 0;
  };

  const courierFee = getCourierFee();
  const finalShippingFee = shippingFee + courierFee;

  // Calculate final total (Subtotal + Shipping - Discount)
  const finalTotal = Math.max(0, totalPrice + finalShippingFee - discountAmount);

  // User Account Functions
  React.useEffect(() => {
    // Check if user is logged in (check localStorage or session)
    const savedUser = localStorage.getItem('studyPulseUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserEmail(user.email);
      setUserPhone(user.phone);
      setUserFullName(user.fullName);
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      localStorage.removeItem('studyPulseUser');
      setIsLoggedIn(false);
      setUserEmail('');
      setUserPhone('');
      setUserFullName('');
      setFullName('');
      setEmail('');
      setPhone('');
      
      Swal.fire({
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };


  // Authentication handlers
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter both email and password.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setIsAuthenticating(true);

    try {
      // Simulate login - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Auto-populate form with user data
      setFullName(registerName || loginEmail.split('@')[0]);
      setEmail(loginEmail);
      setPhone(registerPhone || '09XXXXXXXXX');
      
      // Set logged in state
      setIsLoggedIn(true);
      setUserEmail(loginEmail);
      setUserPhone(registerPhone || '09XXXXXXXXX');
      setUserFullName(registerName || loginEmail.split('@')[0]);
      
      // Close modal
      setShowLoginModal(false);
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'You have been successfully logged in.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setIsAuthenticating(true);

    try {
      // Simulate registration - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Auto-populate form with user data
      setFullName(registerName);
      setEmail(registerEmail);
      setPhone(registerPhone);
      
      // Set logged in state
      setIsLoggedIn(true);
      setUserEmail(registerEmail);
      setUserPhone(registerPhone);
      setUserFullName(registerName);
      
      // Close modal
      setShowLoginModal(false);
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Your account has been created successfully. Welcome to Study Pulse!',
        timer: 3000,
        showConfirmButton: false
      });

    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Unable to create account. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const isDetailsValid =
    (fullName?.trim() ?? '') !== '' &&
    (email?.trim() ?? '') !== '' &&
    (phone?.trim() ?? '') !== '' &&
    (address?.trim() ?? '') !== '' &&
    (barangay?.trim() ?? '') !== '' &&
    (city?.trim() ?? '') !== '' &&
    (state?.trim() ?? '') !== '' &&
    (zipCode?.trim() ?? '') !== '' &&
    shippingLocation !== '' &&
    (paymentType === 'prepaid' || paymentType === 'cod') &&
    selectedCourier !== '';

  const handleProceedToPayment = async () => {
    console.log('🚀 Proceeding to payment...');
    console.log('📊 Form validation:', {
      isDetailsValid,
      paymentType,
      selectedCourier,
      isLoggedIn,
      paymentMethodsCount: paymentMethods.length
    });
    
    if (!isDetailsValid) {
      await Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill all required fields including payment type and courier selection.',
        confirmButtonColor: '#1e40af',
        confirmButtonText: 'OK',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      return;
    }
    
    if (!isLoggedIn) {
      // Show professional account creation/login modal
      const result = await Swal.fire({
        title: 'Create Account for Better Experience',
        html: `
          <div style="text-align: center; font-family: system-ui; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style="margin-bottom: 10px;">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3 style="margin: 10px 0; font-size: 18px; font-weight: bold;">Join Study Pulse</h3>
              <p style="margin: 5px 0; opacity: 0.9;">Create your account for a seamless checkout experience</p>
            </div>
            
            <div style="text-align: left; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h4 style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600;">Account Benefits:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px;">
                <li style="margin-bottom: 5px;">✓ Faster checkout process</li>
                <li style="margin-bottom: 5px;">✓ Order tracking dashboard</li>
                <li style="margin-bottom: 5px;">✓ Exclusive member discounts</li>
                <li style="margin-bottom: 5px;">✓ Save shipping addresses</li>
                <li>✓ Priority customer support</li>
              </ul>
            </div>
            
            <p style="margin: 10px 0; color: #6b7280; font-size: 14px;">
              Create your account in seconds and continue with your order
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Create Account / Login',
        cancelButtonText: 'Continue as Guest',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      
      if (result.isConfirmed) {
        setShowLoginModal(true);
      }
      return;
    }
    
    // Show confirmation before proceeding
    const result = await Swal.fire({
      title: 'Proceed to Payment?',
      html: `
        <div style="text-align: left; font-family: system-ui;">
          <p style="margin-bottom: 12px; color: #374151;">Review your order details:</p>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 4px 0; font-weight: 600;">Customer: ${fullName}</p>
            <p style="margin: 4px 0; color: #6b7280;">Email: ${email}</p>
            <p style="margin: 4px 0; color: #6b7280;">Phone: ${phone}</p>
            <p style="margin: 4px 0; color: #6b7280;">Location: ${shippingLocation.replace('_', ' & ')}</p>
            <p style="margin: 4px 0; color: #6b7280;">Courier: ${selectedCourier}</p>
            <p style="margin: 8px 0 0 0; font-weight: 600; color: #1f2937;">Total: ₱${finalTotal.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Review Details',
      backdrop: 'rgba(0,0,0,0.5)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
    
    if (result.isConfirmed) {
      // Set payment step immediately
      setStep('payment');
      
      // Show loading while checking payment methods
      const loadingSwal = await Swal.fire({
        title: 'Loading Payment Methods...',
        text: 'Please wait while we load available payment options.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Wait a moment for payment methods to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if payment methods are available
      if (paymentMethods.length === 0) {
        await Swal.close();
        await Swal.fire({
          icon: 'warning',
          title: 'No Payment Methods Available',
          html: `
            <div style="text-align: center; font-family: system-ui;">
              <p style="margin: 12px 0; color: #374151;">No payment methods are currently available.</p>
              <p style="margin: 12px 0; color: #6b7280;">Please contact support or try again later.</p>
            </div>
          `,
          confirmButtonColor: '#1e40af',
          backdrop: 'rgba(0,0,0,0.5)'
        });
        setStep('details'); // Go back to details
        return;
      }
      
      await Swal.close();
      
      // Show success notification
      await Swal.fire({
        icon: 'success',
        title: 'Payment Step',
        html: `
          <div style="text-align: center; font-family: system-ui;">
            <p style="margin-bottom: 16px; color: #374151;">Please select your payment method and upload proof of payment.</p>
            <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0; color: #059669; font-weight: 600;">✓ Select Payment Method</p>
              <p style="margin: 4px 0; color: #059669; font-weight: 600;">✓ Upload Payment Proof</p>
              <p style="margin: 4px 0; color: #059669; font-weight: 600;">✓ Choose Contact Method</p>
            </div>
            <p style="margin-top: 16px; color: #6b7280; font-size: 14px;">Ready when you are! Complete your order below.</p>
          </div>
        `,
        confirmButtonColor: '#1e40af',
        confirmButtonText: 'Got it!',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    }
  };


  
  const handlePlaceOrder = async () => {
    console.log('🚀 Place Order clicked');
    console.log('📊 Form validation:', {
      isLoggedIn,
      selectedPaymentMethod,
      paymentProof: paymentProof ? paymentProof.name : 'none',
      contactMethod,
      isUploadingProof
    });
    
    // First check if user is logged in
    if (!isLoggedIn) {
      const result = await Swal.fire({
        icon: 'error',
        title: 'Login Required',
        html: `
          <div style="text-align: center; font-family: system-ui;">
            <p style="margin: 12px 0; color: #374151; font-size: 14px;">
              You must be logged in to place an order and proceed with payment.
            </p>
            <p style="margin: 12px 0; color: #6b7280; font-size: 13px;">
              Please login with your existing account or create a new one.
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#0ea5e9',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Login / Create Account',
        cancelButtonText: 'Go Back',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      
      if (result.isConfirmed) {
        setShowLoginModal(true);
      }
      return;
    }

    if (!contactMethod) {
      await Swal.fire({
        icon: 'warning',
        title: 'Contact Method Required',
        text: 'Please select your preferred contact method (Messenger).',
        confirmButtonColor: '#1e40af',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      return;
    }

    if (!shippingLocation) {
      await Swal.fire({
        icon: 'warning',
        title: 'Shipping Location Required',
        text: 'Please select your shipping location.',
        confirmButtonColor: '#1e40af',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      return;
    }

    if (!paymentProof) {
      await Swal.fire({
        icon: 'warning',
        title: 'Payment Proof Required',
        text: 'Please upload a screenshot of your payment proof to proceed.',
        confirmButtonColor: '#1e40af',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: 'Processing Order...',
      text: 'Please wait while we process your order.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);

      try {
        // 1. Upload Payment Proof First
        let paymentProofUrl = null;
        if (paymentProof) {
          try {
            paymentProofUrl = await uploadImage(paymentProof);
          } catch (uploadError: any) {
            console.error('Failed to upload payment proof:', uploadError);
            await Swal.fire({
              icon: 'error',
              title: 'Failed to Upload Payment Proof',
              text: `Failed to upload payment proof: ${uploadError.message}`,
              confirmButtonColor: '#1e40af',
              backdrop: 'rgba(0,0,0,0.5)',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            });
            return;
          }
        }

        // Prepare order items for database
        const orderItems = cartItems.map((item: CartItem) => ({
  product_id: item.product?.id,
  variation_id: item.variation?.id,
  option_id: item.option?.id,
  quantity: item.quantity,
  price: item.price,
  product_name: item.product?.name || item.name,
  variation_name: item.variation?.name,
  variation_value: item.variation?.value,
  option_name: item.option?.name,
  option_value: item.option?.value,
  purity_percentage: item.product?.purity_percentage
}));

        // Save order to database
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            shipping_address: address,
            shipping_barangay: barangay,
            shipping_city: city,
            shipping_state: state,
            shipping_zip_code: zipCode,
            order_items: orderItems,
            total_price: Math.max(0, totalPrice - discountAmount), // Store subtotal minus discount (not including shipping)
            shipping_fee: shippingFee,
            shipping_location: shippingLocation,
            courier: selectedCourier,
            is_cod: isCOD,
            courier_fee: courierFee,
            payment_method_id: paymentMethod?.id || null,
            payment_method_name: paymentMethod?.name || null,
            payment_proof_url: paymentProofUrl,
            contact_method: contactMethod || null,
            notes: notes.trim() || null,
            order_status: 'new',
            payment_status: 'pending',
            promo_code_id: appliedPromo?.id || null,
            promo_code: appliedPromo?.code || null,
            discount_applied: discountAmount
          }])
          .select()
          .single();

        if (orderError) {
          console.error('❌ Error saving order:', orderError);

          // Provide helpful error message if table doesn't exist
          let errorMessage = orderError.message;
          if (orderError.message?.includes('Could not find the table') ||
            orderError.message?.includes('relation "public.orders" does not exist') ||
            orderError.message?.includes('schema cache')) {
            errorMessage = `The orders table doesn't exist in the database. Please run the migration: supabase/migrations/20250117000000_ensure_orders_table.sql in your Supabase SQL Editor.`;
          }

          await Swal.fire({
            icon: 'error',
            title: 'Failed to Save Order',
            text: `Failed to save order: ${errorMessage}`,
            confirmButtonColor: '#1e40af',
            backdrop: 'rgba(0,0,0,0.5)',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
          return;
        }

        // Update promo code usage count
        if (appliedPromo) {
          const { error: promoUpdateError } = await supabase
            .from('promo_codes')
            .update({ usage_count: appliedPromo.usage_count + 1 })
            .eq('id', appliedPromo.id);

          if (promoUpdateError) {
            console.error('Failed to update promo usage count:', promoUpdateError);
          }
        }

        console.log('✅ Order saved to database:', orderData);

        // Get current date and time
        const now = new Date();
        const dateTimeStamp = now.toLocaleString('en-PH', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

        const orderDetails = `
Study Pulse Order - ${dateTimeStamp}

CUSTOMER INFORMATION
Name: ${fullName}
Email: ${email}
Phone: ${phone}

SHIPPING ADDRESS
${address}
${barangay}
${city}, ${state} ${zipCode}

ORDER DETAILS
${cartItems.map((item: CartItem) => {
          let line = `• ${item.product?.name || item.name}`;
          if (item.variation) {
            line += ` (${item.variation.name})`;
          }
          if (item.option) {
            line += ` [${item.option.name}]`;
          }
          line += ` x${item.quantity} - ₱${(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
          if (item.product?.purity_percentage && item.product.purity_percentage > 0) {
            line += `\n  Purity: ${item.product.purity_percentage}%`;
          }
          if (item.option && item.option.description) {
            line += `\n  Package: ${item.option.description}`;
          }
          return line;
        }).join('\n\n')}

PRICING
Product Total: ₱${totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
Shipping Fee: ₱${shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 0 })} (${shippingLocation.replace('_', ' & ')})
${selectedCourier ? `Courier: ${selectedCourier} (${isCOD ? 'COD' : 'Payment First'})\n` : ''}
${courierFee > 0 ? `COD Fee: ₱${courierFee.toLocaleString('en-PH', { minimumFractionDigits: 0 })}\n` : ''}
${discountAmount > 0 ? `Discount (${appliedPromo?.code}): -₱${discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 0 })}\n` : ''}Grand Total: ₱${finalTotal.toLocaleString('en-PH', { minimumFractionDigits: 0 })}

PAYMENT METHOD
${paymentMethod?.name || 'N/A'}
${paymentMethod ? `Account: ${paymentMethod.account_number}` : ''}

PROOF OF PAYMENT
${paymentProofUrl ? 'Screenshot attached to order.' : 'Pending'}

CONTACT METHOD
Messenger: https://m.me/StudyPulse

ORDER ID: ${orderData.id}

Please confirm this order. Thank you!
      `.trim();

        // Store order message for copying
        setOrderMessage(orderDetails);

        // Auto-copy to clipboard
        try {
          await navigator.clipboard.writeText(orderDetails);
          setCopied(true);
        } catch (err) {
          console.error('Failed to auto-copy:', err);
        }

        // Open contact method based on selection
        const contactUrl = contactMethod === 'messenger'
          ? `https://m.me/61555961135365?text=${encodeURIComponent(orderDetails)}`
          : null;

        if (contactUrl) {
          setTimeout(() => {
            try {
              const contactWindow = window.open(contactUrl, '_blank');
              if (!contactWindow || contactWindow.closed || typeof contactWindow.closed === 'undefined') {
                console.warn('⚠️ Popup blocked or contact method failed to open');
              }
            } catch (error) {
              console.error('❌ Error opening contact method:', error);
            }
          }, 500);
        }

        // Close loading and show success
        Swal.close();
        
        await Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          html: `
            <div style="text-align: left; font-family: system-ui;">
              <p style="margin-bottom: 12px; color: #374151;">Your order has been placed successfully!</p>
              <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #10b981;">
                <p style="margin: 4px 0; font-weight: 600; color: #059669;">Order ID: ${orderData.id}</p>
                <p style="margin: 4px 0; color: #059669;">Total: ₱${finalTotal.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                <p style="margin: 4px 0; color: #6b7280;">Courier: ${selectedCourier}</p>
              </div>
              <p style="color: #6b7280;">The order message has been copied to your clipboard and Messenger should open automatically.</p>
            </div>
          `,
          timer: 4000,
          timerProgressBar: true,
          confirmButtonColor: '#10b981',
          backdrop: 'rgba(0,0,0,0.5)',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });

        // Show confirmation
        setStep('confirmation');
      } catch (error) {
        console.error('❌ Error placing order:', error);
        Swal.close();
        await Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: `Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          confirmButtonColor: '#1e40af',
          backdrop: 'rgba(0,0,0,0.5)',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);
      Swal.close();
      await Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: `Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        confirmButtonColor: '#1e40af',
        backdrop: 'rgba(0,0,0,0.5)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = orderMessage;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        alert('Failed to copy. Please manually select and copy the message below.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleOpenContact = () => {
    const contactUrl = contactMethod === 'messenger'
      ? `https://m.me/61555961135365?text=${encodeURIComponent(orderMessage)}`
      : null;

    if (contactUrl) {
      window.open(contactUrl, '_blank');
    }
  };

  // Default step - render details form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Mobile-Optimized Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          {/* Mobile Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 group bg-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Back to Cart</span>
          </button>
          
          {/* Mobile Progress Indicator */}
          <div className="flex items-center gap-2 sm:hidden bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepClassName(step, 'details', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg')}`}>
              {getStepIndicator(step)}
            </div>
            <span className="text-xs font-medium text-gray-600">
              {getStepText(step)}
            </span>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2 flex items-center gap-2">
            Checkout
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </h1>
          <p className="text-gray-600 text-sm">Complete your order in just a few simple steps</p>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block mb-6 lg:mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-4 flex items-center gap-3">
            Checkout
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
          </h1>
          <p className="text-gray-600 text-lg">Complete your order in just a few simple steps</p>
        </div>

        {/* Desktop Progress Indicator */}
        <div className="hidden sm:block mb-6 lg:mb-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 h-1 bg-gray-200 w-full -translate-y-1/2"></div>
              <div className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-500 to-blue-600 -translate-y-1/2 transition-all duration-700 ease-out" style={{width: getProgressWidth(step)}}></div>
              
              <div className="relative flex flex-col items-center">
                <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${getStepClassName(step, 'details', 'bg-green-500 text-white', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                  {getStepIndicator(step)}
                </div>
                <span className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-gray-700">Details</span>
              </div>
              
              <div className="relative flex flex-col items-center">
                <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${getStepClassName(step, 'payment', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                  {getPaymentStepIndicator(step)}
                </div>
                <span className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-gray-700">Payment</span>
              </div>
              
              <div className="relative flex flex-col items-center">
                <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${getStepClassName(step, 'confirmation', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                  3
                </div>
                <span className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-gray-700">Complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {/* User Account Section */}
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-3 rounded-xl shadow-md">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Account Information</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {isLoggedIn ? `Welcome back, ${userFullName}!` : 'Enter your details to continue'}
                    </p>
                  </div>
                </div>
                {isLoggedIn && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-green-200">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-green-700">Verified</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Show customer info form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base shadow-sm hover:shadow-md"
                      placeholder="Juan Dela Cruz"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="juan@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="09XXXXXXXXX"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-3 rounded-xl shadow-md">
                  <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Shipping Information</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Street Address *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Barangay *</label>
                    <input
                      type="text"
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Barangay Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">State/Province *</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="State/Province"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">ZIP Code *</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="1234"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-3 rounded-xl shadow-md">
                  <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Choose your preferred payment type</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                    paymentType === 'prepaid'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="prepaid"
                    checked={paymentType === 'prepaid'}
                    onChange={(e) => setPaymentType(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Pay First</div>
                    <div className="text-sm text-gray-600 mt-1">Pay before delivery</div>
                  </div>
                </label>

                <label
                  className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                    paymentType === 'cod'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="cod"
                    checked={paymentType === 'cod'}
                    onChange={(e) => {
                      setPaymentType(e.target.value as any);
                      // Auto-select LBC when COD is chosen
                      if (e.target.value === 'cod' && selectedCourier !== 'LBC') {
                        setSelectedCourier('LBC');
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-600 mt-1">Pay upon receipt</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Shipping Location & Courier Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 sm:p-3 rounded-xl shadow-md">
                  <Navigation className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Shipping & Delivery</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Select your location and preferred courier</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Shipping Location *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { value: 'LUZON', label: 'Luzon', fee: 150 },
                      { value: 'VISAYAS', label: 'Visayas', fee: 120 },
                      { value: 'MINDANAO', label: 'Mindanao', fee: 90 },
                      { value: 'MAXIM', label: 'Maxim Delivery', fee: 0 }
                    ].map((location) => (
                      <label
                        key={location.value}
                        className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                          shippingLocation === location.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingLocation"
                          value={location.value}
                          checked={shippingLocation === location.value}
                          onChange={(e) => setShippingLocation(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{location.label}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {location.fee > 0 ? `₱${location.fee}` : 'Free'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Courier Service *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'LBC', label: 'LBC', desc: 'Reliable nationwide delivery' },
                      { value: 'J&T', label: 'J&T Express', desc: 'Fast and affordable' },
                      { value: 'LALAMOVE', label: 'Lalamove', desc: 'Same day delivery' }
                    ].map((courier) => (
                      <label
                        key={courier.value}
                        className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                          selectedCourier === courier.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        } ${
                          paymentType === 'cod' && courier.value !== 'LBC'
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedCourier"
                          value={courier.value}
                          checked={selectedCourier === courier.value}
                          onChange={(e) => setSelectedCourier(e.target.value as any)}
                          disabled={paymentType === 'cod' && courier.value !== 'LBC'}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{courier.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{courier.desc}</div>
                          {paymentType === 'cod' && courier.value !== 'LBC' && (
                            <div className="text-xs text-red-500 font-medium mt-2">Only available for Pay First</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed to Payment Button */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200/50">
              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                <span>Proceed to Payment</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 sticky top-24 border border-gray-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 sm:p-3 rounded-xl shadow-md">
                  <Package className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Order Summary</h2>
                  <p className="text-sm text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.product?.name || item.name}</p>
                      {item.variation && (
                        <p className="text-sm text-gray-500">{item.variation.name}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₱{totalPrice.toLocaleString()}</span>
                </div>
                {shippingLocation && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium text-gray-900">₱{shippingFee.toLocaleString()}</span>
                  </div>
                )}
                {selectedCourier && courierFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Courier Fee</span>
                    <span className="font-medium text-gray-900">₱{courierFee.toLocaleString()}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-₱{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₱{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 sm:p-4 border border-green-200 mt-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong>Secure Checkout:</strong> Your information is protected and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Login Modal Component
  if (showLoginModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Join Study Pulse</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  isLoginMode
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  !isLoginMode
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {isLoginMode ? (
              // Login Form
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={isAuthenticating || !loginEmail || !loginPassword}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            ) : (
              // Register Form
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="09XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>
                <button
                  onClick={handleRegister}
                  disabled={isAuthenticating || !registerName || !registerEmail || !registerPhone || !registerPassword}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-8">Thank you for your purchase. Your order has been successfully placed.</p>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="text-left space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order Message</p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">{orderMessage}</pre>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Message
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleOpenContact}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Open Messenger
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Mobile-Optimized Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={() => setStep('details')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 group bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Back to Details</span>
            </button>
            
            {/* Mobile Progress Indicator */}
            <div className="flex items-center gap-2 sm:hidden">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepClassName(step, 'details', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg')}`}>
                {getStepIndicator(step)}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {getStepText(step)}
              </span>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:block mb-8 lg:mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-4 flex items-center gap-3">
              Complete Payment
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </h1>
            <p className="text-gray-600 text-lg">Securely complete your purchase</p>
          </div>

          {/* Desktop Progress Indicator */}
          <div className="hidden sm:block mb-8 lg:mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 h-1 bg-gray-200 w-full -translate-y-1/2"></div>
                <div className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-500 to-blue-600 -translate-y-1/2 transition-all duration-700 ease-out" style={{width: getProgressWidth(step)}}></div>
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${getStepClassName(step, 'details', 'bg-green-500 text-white', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                    {getStepIndicator(step)}
                  </div>
                  <span className="text-sm font-medium mt-2 text-gray-700">Details</span>
                </div>
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${getStepClassName(step, 'payment', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                    {getPaymentStepIndicator(step)}
                  </div>
                  <span className="text-sm font-medium mt-2 text-gray-700">Payment</span>
                </div>
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${getStepClassName(step, 'confirmation', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                    3
                  </div>
                  <span className="text-sm font-medium mt-2 text-gray-700">Complete</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Payment Form */}
            <div className="xl:col-span-2 space-y-6 lg:space-y-8">
              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-600 mt-1">Select your preferred payment method</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Loading payment methods...</p>
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-4 flex-1">
                          <div className="font-semibold text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-600 mt-1">Account: {method.account_number}</div>
                          {method.instructions && (
                            <div className="text-sm text-gray-500 mt-2">{method.instructions}</div>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Payment Proof</h2>
                    <p className="text-sm text-gray-600 mt-1">Upload a screenshot of your payment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="paymentProof"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPaymentProof(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="paymentProof"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <span className="text-gray-600 font-medium">Click to upload payment proof</span>
                      <span className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                    </label>
                  </div>
                  
                  {paymentProof && (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{paymentProof?.name}</span>
                      </div>
                      <button
                        onClick={() => setPaymentProof(null)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Method */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Contact Method</h2>
                    <p className="text-sm text-gray-600 mt-1">How should we contact you?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md hover:border-gray-300">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="messenger"
                      checked={contactMethod === 'messenger'}
                      onChange={(e) => setContactMethod(e.target.value as 'messenger' | '')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-semibold text-gray-900">Facebook Messenger</div>
                      <div className="text-sm text-gray-600 mt-1">We'll contact you via Messenger for order confirmation</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Additional Notes</h2>
                    <p className="text-sm text-gray-600 mt-1">Any special instructions (optional)</p>
                  </div>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any special delivery instructions or notes..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Place Order Button */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50">
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedPaymentMethod || !paymentProof || !contactMethod || isUploadingProof}
                  className={`w-full py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform shadow-xl relative overflow-hidden group ${
                    selectedPaymentMethod && paymentProof && contactMethod && !isUploadingProof
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-2xl hover:scale-105 border-2 border-green-600 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                  }`}
                >
                  {isUploadingProof ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Complete Order
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-7 sticky top-24 border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Order Summary</h2>
                    <p className="text-sm text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.product?.name || item.name}</p>
                        {item.variation && (
                          <p className="text-sm text-gray-500">{item.variation.name}</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity} × ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">Subtotal:</p>
                  <p className="text-lg font-bold text-gray-900">₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                </div>

                {/* Shipping Fee */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">Shipping Fee:</p>
                  <p className="text-lg font-bold text-gray-900">₱{shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                </div>

                {/* Courier Fee */}
                {courierFee > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">Courier Fee:</p>
                    <p className="text-lg font-bold text-gray-900">₱{courierFee.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                  </div>
                )}

                {/* Discount */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">Discount:</p>
                    <p className="text-lg font-bold text-red-600">-₱{discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold text-gray-900">Total:</p>
                  <p className="text-lg font-bold text-gray-900">₱{finalTotal.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>

            {/* Mobile Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 group bg-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Back to Cart</span>
            </button>
            
            {/* Mobile Progress Indicator */}
            <div className="flex items-center gap-2 sm:hidden bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepClassName(step, 'details', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg')}`}>
                {getStepIndicator(step)}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {getStepText(step)}
              </span>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="sm:hidden mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2 flex items-center gap-2">
              Checkout
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </h1>
            <p className="text-gray-600 text-sm">Complete your order in just a few simple steps</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:block mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-4 flex items-center gap-3">
              Checkout
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </h1>
            <p className="text-gray-600 text-lg">Complete your order in just a few simple steps</p>
          </div>

          {/* Desktop Progress Indicator */}
          <div className="hidden sm:block mb-6 lg:mb-8">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 h-1 bg-gray-200 w-full -translate-y-1/2"></div>
                <div className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-500 to-blue-600 -translate-y-1/2 transition-all duration-700 ease-out" style={{width: getProgressWidth(step)}}></div>
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${getStepClassName(step, 'details', 'bg-green-500 text-white', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                    {getStepIndicator(step)}
                  </div>
                  <span className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-gray-700">Details</span>
                </div>
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${getStepClassName(step, 'payment', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                    {getPaymentStepIndicator(step)}
                  </div>
                  <span className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-gray-700">Payment</span>
                </div>
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${getStepClassName(step, 'confirmation', 'bg-gray-300 text-gray-600', 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200')}`}>
                    3
                  </div>
                  <span className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-gray-700">Complete</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
            {/* Main Form */}
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              {/* User Account Section */}
              <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-200/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-3 rounded-xl shadow-md">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Account Information</h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {isLoggedIn ? `Welcome back, ${userFullName}!` : 'Enter your details to continue'}
                      </p>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-green-200">
                        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-green-700">Verified</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Show customer info form for guests or allow editing for logged users */}
                {(!isLoggedIn || showLoginModal) ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2">
                        <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base shadow-sm hover:shadow-md"
                          placeholder="Juan Dela Cruz"
                          required={!isLoggedIn}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="juan@example.com"
                          required={!isLoggedIn}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="09XXXXXXXXX"
                          required={!isLoggedIn}
                        />
                      </div>
                    </div>
                    {!isLoggedIn && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-blue-900">Create an account for faster checkout</p>
                            <p className="text-sm text-blue-700 mt-1">Save your information and track your orders</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Show saved customer info for logged in users */
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowLoginModal(true)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-md hover:shadow-lg"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Name</p>
                          <p className="text-sm font-semibold text-gray-900">{userFullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="text-sm font-semibold text-gray-900">{userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <p className="text-sm font-semibold text-gray-900">{userPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-200/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-3 rounded-xl shadow-md">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Delivery Address</h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Where should we deliver your order?</p>
                    </div>
                  </div>
                  
                  {/* Mobile Location Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            async (position) => {
                              const { latitude, longitude } = position.coords;
                              try {
                                const response = await fetch(
                                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                                );
                                const data = await response.json();
                                
                                if (data && data.address) {
                                  setAddress(data.address.road || data.address.house_number || '');
                                  setBarangay(data.address.suburb || data.address.neighbourhood || '');
                                  setCity(data.address.city || data.address.town || data.address.village || '');
                                  setState(data.address.state || data.address.province || '');
                                  setZipCode(data.address.postcode || '');
                                  
                                  // Show map modal with location
                                  Swal.fire({
                                    title: 'Location Detected!',
                                    html: `
                                      <div style="text-align: center;">
                                        <p>Your address has been filled automatically.</p>
                                        <img src="https://maps.openstreetmap.org/staticmap?center=${latitude},${longitude}&zoom=16&size=300x200&markers=${latitude},${longitude}" 
                                             style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" 
                                             alt="Your Location" />
                                        <p style="font-size: 12px; color: #666;">Please verify and edit if needed.</p>
                                      </div>
                                    `,
                                    icon: 'success',
                                    showConfirmButton: true,
                                    confirmButtonText: 'Got it!',
                                    width: 350,
                                  });
                                }
                              } catch (error) {
                                Swal.fire({
                                  title: 'Location Error',
                                  text: 'Unable to get address from coordinates. Please enter manually.',
                                  icon: 'warning',
                                });
                              }
                            },
                            (error) => {
                              let errorMessage = 'Unable to get location.';
                              switch (error.code) {
                                case error.PERMISSION_DENIED:
                                  errorMessage = 'Location access denied. Please enable location services.';
                                  break;
                                case error.POSITION_UNAVAILABLE:
                                  errorMessage = 'Location information is unavailable.';
                                  break;
                                case error.TIMEOUT:
                                  errorMessage = 'Location request timed out.';
                                  break;
                              }
                              Swal.fire({
                                title: 'Location Error',
                                text: errorMessage,
                                icon: 'warning',
                              });
                            }
                          );
                        } else {
                          Swal.fire({
                            title: 'Not Supported',
                            text: 'Geolocation is not supported by your browser.',
                            icon: 'warning',
                          });
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium animate-scale"
                    >
                      <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Use My Location</span>
                      <span className="sm:hidden">Location</span>
                    </button>

                    <button
                      onClick={() => {
                        if (address && city) {
                          const mapQuery = encodeURIComponent(`${address}, ${city}, ${state}`);
                          window.open(`https://www.openstreetmap.org/search?query=${mapQuery}`, '_blank');
                        } else {
                          Swal.fire({
                            title: 'Address Required',
                            text: 'Please enter your address first to view it on the map.',
                            icon: 'info',
                          });
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                    >
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">View on Map</span>
                      <span className="sm:hidden">Map</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="lg:col-span-2">
                      <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        placeholder="123 Rizal Street, Poblacion"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Barangay *
                      </label>
                      <input
                        type="text"
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        placeholder="San Antonio"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        placeholder="Quezon City"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Province *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        placeholder="Metro Manila"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        placeholder="1100"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges & Security */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Secure Checkout</h3>
                    <p className="text-sm text-gray-600">Your information is protected and encrypted</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Verified</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Fast Delivery</span>
                  </div>
                </div>
              </div>

              {/* Shipping Location Selection */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Shipping Location</h2>
                    <p className="text-sm text-gray-600 mt-1">Select your delivery region</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Shipping rates apply to small pouches (4.1 × 9.5 inches) with a capacity of up to 3 pens. For bulk orders exceeding this size, our team will contact you for the adjusted shipping fees.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {shippingLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setShippingLocation(loc.id as 'LUZON' | 'VISAYAS' | 'MINDANAO' | 'MAXIM')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        shippingLocation === loc.id
                          ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                    >
                      <p className="font-bold text-gray-900 text-sm">{loc.id.replace('_', ' & ')}</p>
                      <p className="text-xs text-gray-600 mt-1">₱{loc.fee.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Type Selection */}
              <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-200/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-3 rounded-xl shadow-md">
                    <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Payment Type</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Choose how you want to pay</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => {setPaymentType('prepaid'); setIsCOD(false); setSelectedCourier('');}}
                    className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                      paymentType === 'prepaid'
                        ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Prepaid</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Pay via GCash, Maya, Bank Transfer</p>
                      <p className="text-xs text-green-600 mt-1 sm:mt-2">Pay First → Ship Fast</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {setPaymentType('cod'); setIsCOD(true); setSelectedCourier('LBC');}}
                    className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                      paymentType === 'cod'
                        ? 'border-orange-600 bg-orange-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <Package className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Cash on Delivery</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Pay when you receive</p>
                      <p className="text-xs text-orange-600 mt-1 sm:mt-2">COD Fee Applies</p>
                    </div>
                  </button>
                </div>
                {paymentType === 'cod' && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-orange-800 flex items-center gap-2">
                      <span className="text-sm sm:text-base">💰</span>
                      <strong className="text-xs sm:text-sm">COD Information:</strong> Additional ₱150 COD fee will be charged. Delivery time may be longer.
                    </p>
                  </div>
                )}
                {paymentType === 'prepaid' && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-green-800 flex items-center gap-2">
                      <span className="text-sm sm:text-base">⚡</span>
                      <strong className="text-xs sm:text-sm">Prepaid Benefit:</strong> Faster delivery processing and no additional fees.
                    </p>
                  </div>
                )}
              </div>

              {/* Courier Selection - Dynamic based on payment type */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Delivery Method</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {paymentType === 'prepaid' ? 'Choose your preferred courier' : 'COD available with LBC'}
                    </p>
                  </div>
                </div>
                
                {paymentType === 'prepaid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {setSelectedCourier('J&T'); setIsCOD(false);}}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedCourier === 'J&T'
                          ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <p className="font-bold text-gray-900">J&T Express</p>
                      <p className="text-xs text-gray-600 mt-1">Payment First</p>
                      <p className="text-xs text-green-600 mt-2">Free Shipping</p>
                    </button>
                    <button
                      onClick={() => {setSelectedCourier('LALAMOVE'); setIsCOD(false);}}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedCourier === 'LALAMOVE'
                          ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <p className="font-bold text-gray-900">Lalamove</p>
                      <p className="text-xs text-gray-600 mt-1">Payment First</p>
                      <p className="text-xs text-purple-600 mt-2">Same Day</p>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <button
                      onClick={() => {setSelectedCourier('LBC'); setIsCOD(true);}}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedCourier === 'LBC'
                          ? 'border-orange-600 bg-orange-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <p className="font-bold text-gray-900">LBC</p>
                      <p className="text-xs text-gray-600 mt-1">Cash on Delivery</p>
                      <p className="text-xs text-orange-600 mt-2">COD Fee: ₱150</p>
                    </button>
                  </div>
                )}
                
                {selectedCourier === 'LBC' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <span>⚠️</span>
                      <strong>Delivery Notice:</strong> LBC delivery typically takes 3-5 business days.
                    </p>
                  </div>
                )}
              </div>

              {/* Enhanced Proceed Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform shadow-xl relative overflow-hidden group ${
                  isDetailsValid
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-[1.02] hover:shadow-2xl border border-blue-800/20'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isDetailsValid ? (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Proceed to Payment
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Complete All Required Fields
                    </>
                  )}
                </span>
                {isDetailsValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 sticky top-20 sm:top-24 border border-gray-200/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 sm:p-3 rounded-xl shadow-md">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Order Summary</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.product?.name || item.name}</h4>
                          {item.variation && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.variation.name}</p>
                          )}
                        </div>
                        <div className="text-right ml-2">
                          <p className="font-bold text-gray-900 text-sm sm:text-base">₱{item.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">×{item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₱{totalPrice.toLocaleString()}</span>
                  </div>
                  {shippingLocation && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-medium text-gray-900">₱{shippingFee.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedCourier && courierFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Courier Fee</span>
                      <span className="font-medium text-gray-900">₱{courierFee.toLocaleString()}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">-₱{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₱{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 sm:p-4 border border-green-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <p className="text-xs sm:text-sm text-gray-700">
                      <strong>Secure Checkout:</strong> Your information is protected and encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Checkout;
