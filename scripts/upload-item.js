const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")
const cloudinary = require("cloudinary").v2

const categorySlug = process.argv[2]
const productSlug = process.argv[3]

if (!categorySlug || !productSlug) {
  console.error("❌ Usage: node scripts/upload-item.js <category_slug> <product_slug>")
  process.exit(1)
}

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
  console.error("❌ Supabase config missing")
  process.exit(1)
}

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ Cloudinary credentials missing")
  process.exit(1)
}

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
  const relativePath = `/products/${categorySlug}/${productSlug}.webp`
  const localFilePath = path.join(__dirname, "..", "public", relativePath)

  if (!fs.existsSync(localFilePath)) {
    console.error(`❌ Local file does not exist: ${localFilePath}`)
    process.exit(1)
  }

  console.log(`🚀 Uploading ${productSlug} to Cloudinary...`)
  try {
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: `sabta-products/${categorySlug}`,
      public_id: productSlug,
      format: "webp",
      overwrite: true,
      invalidate: true,
    })

    const secureUrl = uploadResult.secure_url
    console.log(`✅ Uploaded to Cloudinary: ${secureUrl}`)

    console.log(`🚀 Updating Supabase record...`)
    const { error } = await supabase
      .from("products")
      .update({ image: secureUrl })
      .eq("category_slug", categorySlug)
      .eq("slug", productSlug)

    if (error) {
      throw error
    }

    console.log(`✅ Supabase database updated successfully for ${productSlug}!`)
  } catch (err) {
    console.error(`❌ Failed:`, err.message || err)
    process.exit(1)
  }
}

run()
