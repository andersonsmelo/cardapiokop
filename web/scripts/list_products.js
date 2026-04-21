const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log('Product Names:');
    products.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
}

listProducts();
