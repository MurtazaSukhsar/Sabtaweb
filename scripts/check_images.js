const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]/g, '').replace(/['"]$/g, '');
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

fetch(url + '/rest/v1/products?select=id,name,category_slug,image', {
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key
  }
})
.then(r => r.json())
.then(data => {
  const cloudinaryImages = data.filter(p => p.image && p.image.includes('cloudinary'));
  const localImages = data.filter(p => p.image && !p.image.includes('cloudinary'));
  const noImages = data.filter(p => !p.image);
  
  console.log('Total products in Supabase:', data.length);
  console.log('Products with Cloudinary URLs:', cloudinaryImages.length);
  console.log('Products with Local paths (/products/...):', localImages.length);
  console.log('Products with No image:', noImages.length);
  
  console.log('\nSample Local Paths in Supabase (first 10):');
  localImages.slice(0, 10).forEach(p => console.log('  ', p.category_slug, '->', p.name, ':', p.image));
})
.catch(console.error);
