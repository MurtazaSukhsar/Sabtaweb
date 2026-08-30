const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("slug, name, order")
    .order("order", { ascending: true })

  if (catErr) {
    console.error("❌ Categories error:", catErr)
    process.exit(1)
  }

  const categoryMap = {}
  categories.forEach((cat) => {
    categoryMap[cat.slug] = cat.name
  })

  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("*")
    .order("order", { ascending: true })

  if (prodErr) {
    console.error("❌ Products error:", prodErr)
    process.exit(1)
  }

  const remainingProducts = products
    .filter((p) => !p.image || !p.image.startsWith("https://res.cloudinary.com"))
    .map((p) => ({
      ...p,
      category_name: categoryMap[p.category_slug] || p.category_slug
    }))

  const targetPath = "C:\\Users\\murta\\.gemini\\antigravity-ide\\brain\\4f7be32c-e3a6-4e33-8372-7ca85ba87465\\remaining_products.json"
  fs.writeFileSync(targetPath, JSON.stringify(remainingProducts, null, 2), "utf8")

  console.log(`✅ Saved ${remainingProducts.length} remaining products to ${targetPath}`)
}

run()
