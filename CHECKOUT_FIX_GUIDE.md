# 🚨 CHECKOUT FIX GUIDE - Payment Proofs Storage

## Problem
You're getting this error during checkout:
```
Failed to upload payment proof: Storage bucket "payment-proofs" not found
```

## 🎯 QUICK FIX (2 minutes)

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)

### Step 2: Run the Migration
1. Click **"New query"**
2. Copy the entire content from `FIX_CHECKOUT_PAYMENT_PROOFS.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** ▶️

### Step 3: Verify it worked
Run this query to verify:
```sql
SELECT * FROM storage.buckets WHERE id = 'payment-proofs';
```

You should see the "payment-proofs" bucket in the results.

## 🎉 Done!
Your checkout will now work perfectly! Customers can upload payment screenshots and complete orders.

---

## 📋 What This Fix Does

✅ **Creates Storage Bucket**: Creates "payment-proofs" bucket for payment screenshots  
✅ **Sets Permissions**: Allows customers to upload without login  
✅ **File Size Limit**: 10MB max file size  
✅ **Supported Formats**: JPEG, PNG, WebP, GIF, HEIC, HEIF  
✅ **Admin Access**: Admins can view/manage payment proofs  

---

## 🔧 Technical Details

The migration creates:
- Storage bucket: `payment-proofs`
- Public upload policy (for guest checkout)
- Public read policy (for admin verification)
- File size limit: 10MB
- Allowed formats: Images only

---

## ⚠️ If You Still Get Errors

1. **Check Supabase URL**: Make sure your `.env` has correct Supabase URL
2. **Check Service Role Key**: Verify your Supabase service role key is correct
3. **Clear Browser Cache**: Refresh your browser after running the migration
4. **Check Network**: Ensure you have internet connection

---

## 🚀 After the Fix

Your checkout flow will work:
1. Customer fills details ✅
2. Customer selects payment method ✅  
3. Customer uploads payment screenshot ✅
4. Order is created successfully ✅
5. Admin can verify payment proof ✅

---

## 📞 Need Help?

If you still have issues after running the migration:
1. Check the SQL Editor for any error messages
2. Verify your Supabase project has storage enabled
3. Make sure you're using the correct Supabase project

The fix is instant - once you run the migration, checkout works immediately! 🎯
