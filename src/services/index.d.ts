declare module './emailService.js' {
  interface OrderData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_barangay: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip_code: string;
    payment_method: string;
    notes?: string;
    promo_code?: string;
    discount_applied: number;
    order_items: any[];
    total_amount: number;
    shipping_fee: number;
    final_amount: number;
    status: string;
    created_at: string;
  }

  interface EmailService {
    sendOrderConfirmation(email: string, orderData: OrderData): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
  }

  const emailService: EmailService;
  export default emailService;
}
