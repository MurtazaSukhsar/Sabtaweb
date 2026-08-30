const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// 2. Define Category metadata (copied from site-data.ts)
const categories = [
  {
    slug: "hose-clips-clamps",
    name: "Hose Clips & Clamps",
    short_description: "Rubit-brand hose clips, P clips, ear clamps and grating clamps.",
    description: "Zinc-plated, 304 and marine-grade 316 stainless hose clips and clamps sized 3/8″–12″ (9.5mm–318mm), for general purpose, industrial and off-shore, salt-water applications.",
    icon: "clamp",
    color: "#0f9b3f",
    brand_note: "Rubit Brand",
    page_range_start: 3,
    page_range_end: 9,
    order: 0,
  },
  {
    slug: "banding-systems",
    name: "Banding & Buckle Systems",
    short_description: "Stainless banding strip, buckles and multi-band tools.",
    description: "Stainless steel banding strip, ear-lokt buckles and Rubit-brand multi-band systems used to secure hose, cable and pipe bundles.",
    icon: "band",
    color: "#1b8f5a",
    brand_note: "Rubit Brand",
    page_range_start: 10,
    page_range_end: 12,
    order: 1,
  },
  {
    slug: "rigging-hardware",
    name: "Rigging Hardware",
    short_description: "Shackles, hooks, pulleys, turnbuckles, pad eyes and wire rope.",
    description: "A full rigging range: snap hooks, shackles, pulleys, turnbuckles, pad eyes, wire rope and chain, in GI, 304 and marine-grade 316 stainless for lifting and securing loads.",
    icon: "rigging",
    color: "#1b2a80",
    page_range_start: 13,
    page_range_end: 22,
    order: 2,
  },
  {
    slug: "lifting-marine-hardware",
    name: "Lifting & Marine Hardware",
    short_description: "G70/G80 chain hardware, hot-dip galvanized shackles and load binders.",
    description: "Hot-dip galvanized shackles and wire rope clips together with G70/G80 alloy chain fittings: clevis hooks, connecting links, master links and load binders, rated for lifting and marine service.",
    icon: "marine",
    color: "#0b6dab",
    page_range_start: 23,
    page_range_end: 26,
    order: 3,
  },
  {
    slug: "clips-pins",
    name: "Clips & Pins",
    short_description: "Circlips, snap rings, dowel pins and split/cotter pins.",
    description: "DIN-standard circlips and snap rings alongside dowel, hitch, quick-release and split/cotter pins for shaft retention and quick-release assembly work.",
    icon: "pin",
    color: "#c98a2e",
    page_range_start: 27,
    page_range_end: 29,
    order: 4,
  },
  {
    slug: "bolts-screws",
    name: "Bolts & Screws",
    short_description: "Hex, flange, carriage, socket-cap and stud bolts to DIN standards.",
    description: "Hex, flange, carriage and roofing bolts, threaded bar, stud bolts and socket-cap screws manufactured to DIN standards in mechanical grades 8.8 through 12.9 and 304/316 stainless.",
    icon: "bolt",
    color: "#1b2a80",
    page_range_start: 30,
    page_range_end: 32,
    order: 5,
  },
  {
    slug: "nuts",
    name: "Nuts",
    short_description: "Hex, lock, flange, rivet and specialty nuts.",
    description: "Hex, lock, flange, castle and rivet nuts through to specialty types: K nuts, T-slide nuts, cage nuts and weld nuts, in mechanical and stainless grades.",
    icon: "nut",
    color: "#0f9b3f",
    page_range_start: 33,
    page_range_end: 37,
    order: 6,
  },
  {
    slug: "washers",
    name: "Washers",
    short_description: "Flat, spring, serrated and Nordlock washers.",
    description: "Flat, spring and serrated washers to DIN125/DIN127/DIN9021, plus Nordlock (NFE25201) and contact (NFE25511) washers for vibration-resistant joints.",
    icon: "washer",
    color: "#5a6178",
    page_range_start: 38,
    page_range_end: 39,
    order: 7,
  },
  {
    slug: "misc-hardware",
    name: "Grease Fittings & Workshop Hardware",
    short_description: "Grease nipples, threading taps & dies, O-rings and rivets.",
    description: "Grease nipples and adaptors, threading taps, dies and rivet tools, O-rings and S.R.C rivets: the workshop consumables that round out a fastener order.",
    icon: "misc",
    color: "#8a4bab",
    page_range_start: 40,
    page_range_end: 44,
    order: 8,
  },
]

// 3. Define Site Settings (copied from site-data.ts)
const siteConfig = {
  name: "Sabta Trading Co. LLC",
  nameAr: "شركة سبته التجارية ذ.م.م",
  shortName: "Sabta Trading",
  tagline: "Fastener & Marine Rigging Hardware Since 1994",
  founded: 1994,
  description: "Dubai-based fastener and marine rigging hardware distributor since 1994, stocking 16,000+ items for the Automotive, Manufacturing, Marine and Oilfield industries.",
  url: "https://www.sabtadxb.com",
  itemsInStock: "16,000+",
}

const contactInfo = {
  phone: "+971 4 2210506",
  phoneHref: "tel:+97142210506",
  fax: "+971 4 2243009",
  poBox: "P.O. Box 14684, Dubai, U.A.E.",
  city: "Dubai, United Arab Emirates",
  website: "www.sabtadxb.com",
  managingDirector: { name: "Saifuddin", role: "Managing Director" },
  contacts: [
    {
      name: "Ali Asgar",
      phone: "+971 50 5649976",
      phoneHref: "tel:+971505649976",
      whatsappHref: "https://wa.me/971505649976",
      email: "ali@sabtadxb.com",
    },
    {
      name: "Husain",
      phone: "+971 50 5092067",
      phoneHref: "tel:+971505092067",
      whatsappHref: "https://wa.me/971505092067",
      email: "husain@sabtadxb.com",
    },
  ],
  primaryWhatsappHref: "https://wa.me/971505649976",
  primaryEmail: "ali@sabtadxb.com",
  mapsPlaceUrl: "https://www.google.com/maps/place/SABTA+TRADING+CO+LLC/@25.2697884,55.3054345,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f43485ed1f901:0x5ff9a43521b4ec62!8m2!3d25.2697884!4d55.3054345!16s%2Fg%2F11bbwpk8pj",
  mapsEmbedSrc: "https://www.google.com/maps?q=25.2697884,55.3054345&z=16&output=embed",
  lat: 25.2697884,
  lng: 55.3054345,
}

const industries = [
  {
    name: "Automotive",
    description: "Fasteners and clamping hardware supplied to automotive workshops and assembly lines across the UAE.",
  },
  {
    name: "Manufacturing",
    description: "General industrial fasteners, fixings and hardware for manufacturing and production facilities.",
  },
  {
    name: "Marine",
    description: "Corrosion-resistant 316-grade rigging, shackles and lifting hardware built for salt-water and off-shore use.",
  },
  {
    name: "Oilfield",
    description: "High-grade bolting, stud bolts and rigging hardware specified for oilfield and heavy-industrial sites.",
  },
]

const faqs = [
  {
    question: "What does Sabta Trading Co. LLC supply?",
    answer: "We are a Dubai-based fastener and marine rigging hardware distributor stocking 16,000+ items: hose clips, clamps, rigging and lifting hardware, clips and pins, bolts, screws, nuts, washers and general workshop hardware, for the Automotive, Manufacturing, Marine and Oilfield industries.",
  },
  {
    question: "Do you carry stainless steel (304 / 316) grades?",
    answer: "Yes. Most ranges are stocked in 304 stainless for general corrosion resistance and 316 marine-grade stainless for off-shore and salt-water applications, alongside standard GI and mechanical grades (8.8–12.9).",
  },
  {
    question: "Can you source items that are not in ready stock?",
    answer: "Yes, with our dedicated list of suppliers we can source any type of fastener that isn’t currently in ready stock. Send us the specification and quantity you need and we’ll quote it.",
  },
  {
    question: "Where are you located and can I collect an order?",
    answer: "We are based in Dubai, U.A.E. Contact our sales team on +971 4 2210506 or WhatsApp to confirm stock and arrange collection or delivery.",
  },
  {
    question: "How do I request a quotation?",
    answer: "Use the contact form on this site, WhatsApp us directly, or call +971 4 2210506. Include the product name, grade/standard and quantity and our sales team will respond with pricing and availability.",
  },
  {
    question: "Is a full product catalogue available?",
    answer: "Yes, our complete 2026 product catalogue (all 9 ranges, with grades and standards) is available to download as a PDF from the Products page, or we can email it to you directly.",
  },
]

const chatbotContent = {
  fabLabel: "Open support chat",
  headerTitle: "Sabta Trading Assistant",
  headerStatus: "Online • Auto-Answers",
  closeLabel: "Close chat",
  inputPlaceholder: "Type your question...",
  sendLabel: "Send message",
  welcome: "Hi there! Welcome to Sabta Trading. I can quickly answer questions about quotes, delivery, our product ranges, location or contact details. Pick an option below or type your question!",
  welcomeWhatsApp: "💬 Chat on WhatsApp",
  menuPrompt: "Here are the quick topics you can choose from:",
  showMenu: "↩️ Show Main Menu",
  mainMenu: "↩️ Main Menu",
  fallback: "I couldn't quite match that with our standard FAQs. I'm the Sabta Trading auto-assistant. You can pick one of the topics below, or chat directly with our team on WhatsApp.",
  fallbackWhatsApp: "💬 Chat on WhatsApp",
  fallbackEmail: "✉️ Send an Email",
}

const quickReplies = [
  {
    id: "quote",
    label: "📋 Request a Quote",
    question: "How can I request a quote for products?",
    answer: "You can request a quote in two easy ways:\n\n1. Browse our products, add the ones you need to your **Quote Cart** (the bag icon in the header), then submit the whole list at once.\n2. Send us your requirements directly via WhatsApp or email.",
    actions: [
      { label: "💬 WhatsApp Quote", href: "https://wa.me/971505649976?text=Hello%20Sabta%20Trading%2C%20I%20would%20like%20to%20request%20a%20quote.%20Here%20are%20my%20requirements%3A%20", external: true },
      { label: "✉️ Email Quote", href: "mailto:ali@sabtadxb.com?subject=Quote%20Request", external: true },
      { label: "🔍 Browse Products", href: "/products" },
    ],
  },
  {
    id: "delivery",
    label: "🚚 Delivery & Stock",
    question: "Do you deliver and what's your stock like?",
    answer: `Yes! We stock 16,000+ items across 9 ranges and can arrange delivery across the UAE. If something isn't in ready stock, our supplier network can usually source it, send us the spec and quantity for a quote.`,
    actions: [
      { label: "💬 Ask About Delivery", href: "https://wa.me/971505649976?text=Hello%20Sabta%20Trading%2C%20I%20have%20a%20question%20about%20delivery%20and%20stock%20availability.", external: true },
    ],
  },
  {
    id: "categories",
    label: "🛠️ Product Ranges",
    question: "What product ranges do you supply?",
    answer: "We supply 9 ranges of fastener and marine rigging hardware:\n\n• **Hose Clips & Clamps**\n• **Banding & Buckle Systems**\n• **Rigging Hardware**\n• **Lifting & Marine Hardware**\n• **Clips & Pins**\n• **Bolts & Screws**\n• **Nuts**\n• **Washers**\n• **Grease Fittings & Workshop Hardware**",
    actions: [
      { label: "Hose Clips & Clamps", href: "/categories/hose-clips-clamps" },
      { label: "Banding & Buckle Systems", href: "/categories/banding-systems" },
      { label: "Rigging Hardware", href: "/categories/rigging-hardware" },
      { label: "Lifting & Marine Hardware", href: "/categories/lifting-marine-hardware" },
      { label: "🔍 View All Products", href: "/products" },
    ],
  },
  {
    id: "location",
    label: "📍 Location & Hours",
    question: "Where are you located and what are your hours?",
    answer: `Our office is in **Dubai, United Arab Emirates**, P.O. Box 14684, Dubai, U.A.E..\n\nCall us on **+971 4 2210506** or reach out on WhatsApp to confirm stock and arrange collection or delivery.`,
    actions: [
      { label: "🗺️ Google Maps Location", href: "https://www.google.com/maps/place/SABTA+TRADING+CO+LLC/@25.2697884,55.3054345,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f43485ed1f901:0x5ff9a43521b4ec62!8m2!3d25.2697884!4d55.3054345!16s%2Fg%2F11bbwpk8pj", external: true },
      { label: "📞 Call Us", href: "tel:+97142210506", external: true },
    ],
  },
  {
    id: "contact",
    label: "📞 Contact Sales",
    question: "How can I reach your sales team?",
    answer: `You can reach the Sabta Trading sales team directly:\n\n• **Phone:** +971 4 2210506\n• **Email:** ali@sabtadxb.com\n• **Location:** Dubai, United Arab Emirates`,
    actions: [
      { label: "💬 WhatsApp Chat", href: "https://wa.me/971505649976?text=Hello%20Sabta%20Trading%2C%20I%20need%20assistance%20with%20a%20product%20enquiry.", external: true },
      { label: "📞 Call Now", href: "tel:+97142210506", external: true },
    ],
  },
]

async function run() {
  console.log("🚀 Starting data migration to Supabase...")

  try {
    // 1. Insert Categories
    console.log("📁 Seeding Categories...")
    for (const cat of categories) {
      const { error } = await supabase.from("categories").upsert({
        slug: cat.slug,
        name: cat.name,
        short_description: cat.short_description,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        brand_note: cat.brand_note,
        page_range_start: cat.page_range_start,
        page_range_end: cat.page_range_end,
        order: cat.order,
      })
      if (error) throw error
    }
    console.log("✅ Categories seeded successfully.")

    // 2. Insert Products
    console.log("📦 Seeding Products...")
    const productsPath = path.join(__dirname, "..", "data", "products.json")
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, "utf8"))
      console.log(`Loaded ${productsData.length} products from products.json`)

      // Chunk products insertion to avoid Supabase limits
      const chunkSize = 100
      for (let i = 0; i < productsData.length; i += chunkSize) {
        const chunk = productsData.slice(i, i + chunkSize).map((p) => ({
          id: p.id,
          category_slug: p.categorySlug,
          slug: p.slug,
          name: p.name,
          grade: p.grade || null,
          standard: p.standard || null,
          description: p.description,
          image: p.image || null,
          images: p.images || [],
          featured: p.featured || false,
          order: p.order || 0,
        }))

        const { error } = await supabase.from("products").upsert(chunk)
        if (error) throw error
        console.log(`   Upserted products ${i + 1} to ${Math.min(i + chunkSize, productsData.length)}`)
      }
    } else {
      console.log("⚠️ No products.json found, skipping products seed.")
    }
    console.log("✅ Products seeded successfully.")

    // 3. Insert Site Settings
    console.log("⚙️ Seeding Site Settings...")
    const testimonials = [
      {
        author: { name: "Ali Mohammed", role: "Procurement Officer", company: "Al Naboodah Contracting" },
        text: "Sabta has been our primary fastener supplier for over 5 years. Their stock depth in stainless steel bolts is unmatched in Dubai.",
      },
      {
        author: { name: "Hassan Raza", role: "Project Manager", company: "Marine Services LLC" },
        text: "For marine-grade rigging hardware and copper washers, Sabta always delivers on time. Highly recommended for heavy contracting.",
      },
      {
        author: { name: "John Mathew", role: "Workshop Manager", company: "Apex Engineering" },
        text: "Excellent service and high-quality materials. Their sales team on WhatsApp is extremely responsive when quoting bulk orders.",
      },
    ]

    const settings = [
      { key: "site_config", value: siteConfig },
      { key: "contact_info", value: contactInfo },
      { key: "industries", value: industries },
      { key: "faqs", value: faqs },
      { key: "chatbot_content", value: chatbotContent },
      { key: "quick_replies", value: quickReplies },
      { key: "testimonials", value: testimonials },
    ]

    for (const setting of settings) {
      const { error } = await supabase.from("site_settings").upsert({
        key: setting.key,
        value: setting.value,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
    }
    console.log("✅ Site settings seeded successfully.")
    console.log("🎉 Seeding finished successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
  }
}

run()
