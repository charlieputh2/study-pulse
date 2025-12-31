import { createClient } from '@supabase/supabase-js';

// Direct environment variables - replace with your actual values
const supabaseUrl = 'https://krdocvyhqttfyhbhcice.supabase.co';
const supabaseKey = 'sb_publishable_okjtlco2JXLny4ytO7ey4Q_dE8-tR-W';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Running product options migration...');
    
    // First, let's try to fetch existing products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, base_price, name');
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      console.log('This might be because the product_options table doesn\'t exist yet.');
      console.log('Please run the SQL migration manually in the Supabase dashboard.');
      return;
    }
    
    if (products && products.length > 0) {
      console.log(`📦 Found ${products.length} products. Adding default options...`);
      
      for (const product of products) {
        const options = [
          {
            product_id: product.id,
            name: 'Complete Set',
            description: 'Everything you need: vial, bac water, syringes, alcohol pads, and instructions',
            price_adjustment: 50,
            final_price: product.base_price + 50,
            stock_quantity: 50,
            available: true,
            sort_order: 1
          },
          {
            product_id: product.id,
            name: 'Vial + Bac Water Only',
            description: 'Just the essentials: peptide vial and bacteriostatic water',
            price_adjustment: 15,
            final_price: product.base_price + 15,
            stock_quantity: 75,
            available: true,
            sort_order: 2
          },
          {
            product_id: product.id,
            name: 'Vial Only',
            description: 'Peptide vial only - perfect if you already have supplies',
            price_adjustment: 0,
            final_price: product.base_price,
            stock_quantity: 100,
            available: true,
            sort_order: 3
          }
        ];
        
        const { error: insertError } = await supabase
          .from('product_options')
          .insert(options);
        
        if (insertError) {
          console.error(`❌ Error inserting options for product ${product.name} (${product.id}):`, insertError);
          console.log('This might be because the product_options table doesn\'t exist yet.');
          console.log('Please run the SQL migration manually in the Supabase dashboard.');
        } else {
          console.log(`✅ Added options for product: ${product.name}`);
        }
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runMigration();
