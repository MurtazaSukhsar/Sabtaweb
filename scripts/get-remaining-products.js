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

  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, slug, category_slug, image, order")
    .order("order", { ascending: true })

  if (prodErr) {
    console.error("❌ Products error:", prodErr)
    process.exit(1)
  }

  console.log(`Total Products in Database: ${products.length}\n`)

  const summary = {}
  categories.forEach((cat) => {
    summary[cat.slug] = {
      name: cat.name,
      total: 0,
      completed: [],
      remaining: []
    }
  })

  products.forEach((p) => {
    const cat = summary[p.category_slug] || {
      name: p.category_slug,
      total: 0,
      completed: [],
      remaining: []
    }
    summary[p.category_slug] = cat
    cat.total++

    const isCloudinary = p.image && p.image.startsWith("https://res.cloudinary.com")
    if (isCloudinary) {
      cat.completed.push(p)
    } else {
      cat.remaining.push(p)
    }
  })

  let totalCompleted = 0
  let totalRemaining = 0

  for (const [slug, data] of Object.entries(summary)) {
    totalCompleted += data.completed.length
    totalRemaining += data.remaining.length
    console.log(`### ${data.name} (\`${slug}\`) - [${data.completed.length}/${data.total} Completed | ${data.remaining.length} Remaining]`)
    if (data.remaining.length > 0) {
      data.remaining.forEach((p, idx) => {
        console.log(`  ${idx + 1}. **${p.name}** (\`${p.slug}\`)`)
      })
    } else {
      console.log(`  🎉 All ${data.total} products completed!`)
    }
    console.log("")
  }

  console.log(`=== OVERALL SUMMARY ===`)
  console.log(`Total Products: ${products.length}`)
  console.log(`Completed (Cloudinary WebP): ${totalCompleted}`)
  console.log(`Remaining: ${totalRemaining}`)
}

run()
