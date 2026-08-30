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
  const { data, error } = await supabase
    .from("products")
    .select("slug, name, image, order")
    .eq("category_slug", "rigging-hardware")
    .order("order", { ascending: true })

  if (error) {
    console.error("❌ Error fetching products:", error)
    process.exit(1)
  }

  console.log("=== Rigging Hardware Database Status ===")
  data.forEach((p) => {
    const isCloudinary = p.image && p.image.includes("res.cloudinary.com")
    console.log(`[${isCloudinary ? "UPDATED" : "OLD"}] #${p.order} ${p.name} (${p.slug}) -> ${p.image}`)
  })
}

run()
