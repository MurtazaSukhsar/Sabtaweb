const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")
const cloudinary = require("cloudinary").v2

// 1. Read environment variables from .env.local
const envPath = path.join(__dirname, "..", ".env.local")
const envConfig = {}

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8")
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)?$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2] ? match[2].trim() : ""
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      envConfig[key] = value
    }
  })
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

const cloudName = envConfig.CLOUDINARY_CLOUD_NAME
const apiKey = envConfig.CLOUDINARY_API_KEY
const apiSecret = envConfig.CLOUDINARY_API_SECRET

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local")
  process.exit(1)
}

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ Error: Cloudinary credentials are required in .env.local")
  process.exit(1)
}

// Initialize clients
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

async function run() {
  console.log("🚀 Fetching products from Supabase...")
  
  const { data: products, error } = await supabase
    .from("products")
    .select("id, category_slug, slug, name, image")
    .order("id")

  if (error) {
    console.error("❌ Failed to fetch products:", error.message)
    process.exit(1)
  }

  const localProducts = products.filter(p => p.image && p.image.startsWith("/products/"))
  
  console.log(`Found ${products.length} products total.`)
  console.log(`Found ${localProducts.length} products with local image paths to migrate to Cloudinary.`)

  if (localProducts.length === 0) {
    console.log("✅ No local images to migrate!")
    return
  }

  let successCount = 0
  let skipCount = 0

  for (let i = 0; i < localProducts.length; i++) {
    const product = localProducts[i]
    const relativePath = product.image
    const localFilePath = path.join(__dirname, "..", "public", relativePath)

    console.log(`[${i + 1}/${localProducts.length}] Migrating: ${product.name}...`)

    if (!fs.existsSync(localFilePath)) {
      console.warn(`  ⚠️ Local file does not exist: ${localFilePath}. Skipping.`)
      skipCount++
      continue
    }

    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(localFilePath, {
        folder: `sabta-products/${product.category_slug}`,
        public_id: product.slug,
        format: "webp",
        overwrite: true,
      })

      const secureUrl = uploadResult.secure_url
      console.log(`  ✅ Uploaded to Cloudinary: ${secureUrl}`)

      // Update Supabase
      const { error: updateError } = await supabase
        .from("products")
        .update({ image: secureUrl })
        .eq("id", product.id)

      if (updateError) {
        throw new Error(`DB Update failed: ${updateError.message}`)
      }

      console.log(`  ✅ DB updated for product: ${product.id}`)
      successCount++
    } catch (err) {
      console.error(`  ❌ Failed to migrate ${product.id}:`, err.message || err)
    }
  }

  console.log(`\n🎉 Image migration finished!`)
  console.log(`   - Successful uploads: ${successCount}`)
  console.log(`   - Skipped files: ${skipCount}`)
}

run()
