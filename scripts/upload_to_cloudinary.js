const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

const content = fs.readFileSync('.env.local', 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]/g, '').replace(/['"]$/g, '');
  }
});

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const dir = path.join(process.cwd(), 'public', 'products', 'rigging-hardware');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));

console.log(`Found ${files.length} images to upload to Cloudinary...`);

async function run() {
  let count = 0;
  for (const file of files) {
    const slug = path.basename(file, '.webp');
    const filePath = path.join(dir, file);
    
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'sabta-products/rigging-hardware',
        public_id: slug,
        format: 'webp',
        overwrite: true,
        resource_type: 'image',
      });

      const cloudinaryUrl = result.secure_url;
      count++;
      console.log(`[${count}/${files.length}] Uploaded ${slug}`);

      const res = await fetch(`${url}/rest/v1/products?category_slug=eq.rigging-hardware&slug=eq.${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': 'Bearer ' + key,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          image: cloudinaryUrl
        })
      });

      if (!res.ok) {
        console.error(`  Failed to update DB for ${slug}:`, await res.text());
      }
    } catch (err) {
      console.error(`  Error processing ${slug}:`, err.message);
    }
  }

  console.log('\nAll images uploaded and Supabase updated successfully!');
}

run();
