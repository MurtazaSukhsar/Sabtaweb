/**
 * Chatbot copy and intent matching.
 *
 * The bot is a simple keyword matcher, not a model — it needs no API key and
 * runs entirely in the browser. Keep the keyword lists broad; the fallback
 * reply (with WhatsApp/email actions) always covers anything unmatched.
 */
import { categories, contactInfo, siteConfig } from "@/lib/site-data"

export type ChatAction = { label: string; href: string; external?: boolean }

export type QuickReply = {
  id: string
  label: string
  question: string
  answer: string
  actions?: ChatAction[]
}

const wa = (text: string) => `${contactInfo.primaryWhatsappHref}?text=${encodeURIComponent(text)}`

const categoryLinks: ChatAction[] = categories
  .slice(0, 4)
  .map((c) => ({ label: c.name, href: `/categories/${c.slug}` }))

export const quickReplies: QuickReply[] = [
  {
    id: "quote",
    label: "📋 Request a Quote",
    question: "How can I request a quote for products?",
    answer:
      "You can request a quote in two easy ways:\n\n1. Browse our products, add the ones you need to your **Quote Cart** (the bag icon in the header), then submit the whole list at once.\n2. Send us your requirements directly via WhatsApp or email.",
    actions: [
      { label: "💬 WhatsApp Quote", href: wa("Hello Sabta Trading, I would like to request a quote. Here are my requirements: "), external: true },
      { label: "✉️ Email Quote", href: `mailto:${contactInfo.primaryEmail}?subject=Quote%20Request`, external: true },
      { label: "🔍 Browse Products", href: "/products" },
    ],
  },
  {
    id: "delivery",
    label: "🚚 Delivery & Stock",
    question: "Do you deliver and what's your stock like?",
    answer: `Yes! We stock ${siteConfig.itemsInStock} items across 9 ranges and can arrange delivery across the UAE. If something isn't in ready stock, our supplier network can usually source it, send us the spec and quantity for a quote.`,
    actions: [
      { label: "💬 Ask About Delivery", href: wa("Hello Sabta Trading, I have a question about delivery and stock availability."), external: true },
    ],
  },
  {
    id: "categories",
    label: "🛠️ Product Ranges",
    question: "What product ranges do you supply?",
    answer:
      "We supply 9 ranges of fastener and marine rigging hardware:\n\n• **Hose Clips & Clamps**\n• **Banding & Buckle Systems**\n• **Rigging Hardware**\n• **Lifting & Marine Hardware**\n• **Clips & Pins**\n• **Bolts & Screws**\n• **Nuts**\n• **Washers**\n• **Grease Fittings & Workshop Hardware**",
    actions: [...categoryLinks, { label: "🔍 View All Products", href: "/products" }],
  },
  {
    id: "location",
    label: "📍 Location & Hours",
    question: "Where are you located and what are your hours?",
    answer: `Our office is in **${contactInfo.city}**, ${contactInfo.poBox}.\n\nCall us on **${contactInfo.phone}** or reach out on WhatsApp to confirm stock and arrange collection or delivery.`,
    actions: [
      { label: "🗺️ Google Maps Location", href: contactInfo.mapsPlaceUrl, external: true },
      { label: "📞 Call Us", href: contactInfo.phoneHref, external: true },
    ],
  },
  {
    id: "contact",
    label: "📞 Contact Sales",
    question: "How can I reach your sales team?",
    answer: `You can reach the Sabta Trading sales team directly:\n\n• **Phone:** ${contactInfo.phone}\n• **Email:** ${contactInfo.primaryEmail}\n• **Location:** ${contactInfo.city}`,
    actions: [
      { label: "💬 WhatsApp Chat", href: wa("Hello Sabta Trading, I need assistance with a product enquiry."), external: true },
      { label: "📞 Call Now", href: contactInfo.phoneHref, external: true },
    ],
  },
]

export const chatbotContent = {
  fabLabel: "Open support chat",
  headerTitle: "Sabta Trading Assistant",
  headerStatus: "Online • Auto-Answers",
  closeLabel: "Close chat",
  inputPlaceholder: "Type your question...",
  sendLabel: "Send message",
  welcome:
    "Hi there! Welcome to Sabta Trading. I can quickly answer questions about quotes, delivery, our product ranges, location or contact details. Pick an option below or type your question!",
  welcomeWhatsApp: "💬 Chat on WhatsApp",
  menuPrompt: "Here are the quick topics you can choose from:",
  showMenu: "↩️ Show Main Menu",
  mainMenu: "↩️ Main Menu",
  fallback:
    "I couldn't quite match that with our standard FAQs. I'm the Sabta Trading auto-assistant. You can pick one of the topics below, or chat directly with our team on WhatsApp.",
  fallbackWhatsApp: "💬 Chat on WhatsApp",
  fallbackEmail: "✉️ Send an Email",
}

const menuKeywords = ["menu", "help", "categories", "start", "show main menu"]

/** Ordered intent → keyword list. First match wins. */
const intents: { replyIndex: number; keywords: string[] }[] = [
  { replyIndex: 0, keywords: ["quote", "price", "cost", "pricing", "bulk", "inquire", "enquiry", "buy", "cart", "basket"] },
  { replyIndex: 1, keywords: ["deliver", "ship", "send", "transport", "stock", "available", "availability", "in stock"] },
  {
    replyIndex: 4,
    keywords: ["contact", "phone", "email", "call", "support", "number", "whatsapp", "talk", "reach", "sales", "human", "agent"],
  },
  {
    replyIndex: 3,
    keywords: ["location", "map", "address", "where", "office", "dubai", "hour", "time", "open", "close"],
  },
  {
    replyIndex: 2,
    keywords: [
      "product", "range", "category", "categories", "sell", "supply", "catalog", "catalogue", "items",
      "clamp", "hose", "band", "rigging", "shackle", "hook", "marine", "clip", "pin", "bolt", "screw",
      "nut", "washer", "grease", "hardware", "fastener",
    ],
  },
]

export type AutoResponse = { answer: string; actions?: ChatAction[]; showQuickReplies?: boolean }

export function getAutoResponse(userInput: string, chatbotContent: any, quickReplies: any[], contactInfo: any): AutoResponse {
  const wa = (text: string) => `${contactInfo.primaryWhatsappHref}?text=${encodeURIComponent(text)}`
  const query = userInput.toLowerCase().trim()

  if (menuKeywords.some((k) => query === k)) {
    return { answer: chatbotContent.menuPrompt, showQuickReplies: true }
  }

  for (const intent of intents) {
    if (intent.keywords.some((k) => query.includes(k))) {
      const reply = quickReplies[intent.replyIndex]
      if (reply) {
        return {
          answer: reply.answer,
          actions: [...(reply.actions ?? []), { label: chatbotContent.mainMenu, href: "action:menu" }],
          showQuickReplies: false,
        }
      }
    }
  }

  return {
    answer: chatbotContent.fallback,
    actions: [
      { label: chatbotContent.fallbackWhatsApp, href: wa("Hello Sabta Trading, I need help with a product enquiry."), external: true },
      { label: chatbotContent.fallbackEmail, href: `mailto:${contactInfo.primaryEmail}`, external: true },
    ],
    showQuickReplies: true,
  }
}
