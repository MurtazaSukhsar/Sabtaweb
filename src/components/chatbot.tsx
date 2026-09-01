"use client"
 
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Headset, Send, Sparkles, X } from "lucide-react"
import { getAutoResponse, type ChatAction } from "@/lib/chatbot-content"
import { useScrollLock } from "@/lib/use-scroll-lock"
import { useSiteData } from "@/context/site-data-context"

// Answers are authored with **markdown bold**; render those spans as real <strong>.
function renderRichText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

type Message = {
  id: string
  sender: "user" | "bot"
  text: string
  actions?: ChatAction[]
  showQuickReplies?: boolean
}

let idCounter = 0
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function Chatbot() {
  const pathname = usePathname()
  const { chatbotContent: c, quickReplies, contactInfo } = useSiteData()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [visible, setVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  if (pathname.startsWith("/admin")) return null

  useEffect(() => {
    // Reveal only after a small scroll, matching the WhatsApp button — see
    // that component for why (avoids covering the hero's full-width mobile
    // CTA on common phone heights at scroll position 0).
    function updateVisibility() {
      setVisible(window.scrollY > 220)
    }
    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })
    return () => window.removeEventListener("scroll", updateVisibility)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) setIsOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  useScrollLock(isOpen)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: c.welcome,
          actions: [
            {
              label: c.welcomeWhatsApp,
              href: `${contactInfo.primaryWhatsappHref}?text=${encodeURIComponent("Hello Sabta Trading, I would like to get a quote and check product availability.")}`,
              external: true,
            },
          ],
          showQuickReplies: true,
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function handleSendMessage(textToSend: string, isFromQuickReply = false) {
    if (!textToSend.trim()) return

    const userMsg: Message = { id: nextId("user"), sender: "user", text: textToSend }
    setMessages((prev) => prev.map((m): Message => ({ ...m, showQuickReplies: false })).concat(userMsg))
    if (!isFromQuickReply) setInputValue("")

    setIsTyping(true)
    setTimeout(() => {
      const response = getAutoResponse(textToSend, c, quickReplies, contactInfo)
      const botMsg: Message = {
        id: nextId("bot"),
        sender: "bot",
        text: response.answer,
        actions: response.actions,
        showQuickReplies: response.showQuickReplies,
      }
      setMessages((prev) => prev.concat(botMsg))
      setIsTyping(false)
    }, 700)
  }

  function handleActionClick(actionHref: string) {
    if (actionHref !== "action:menu") return
    const userMsg: Message = { id: nextId("user"), sender: "user", text: c.showMenu }
    setMessages((prev) => prev.map((m): Message => ({ ...m, showQuickReplies: false })).concat(userMsg))

    setIsTyping(true)
    setTimeout(() => {
      const botMsg: Message = { id: nextId("bot"), sender: "bot", text: c.menuPrompt, showQuickReplies: true }
      setMessages((prev) => prev.concat(botMsg))
      setIsTyping(false)
    }, 400)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <>
      {/* Floating button — stacked above the WhatsApp button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={c.fabLabel}
        className={`fixed bottom-[84px] right-4 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-500 hover:scale-110 hover:shadow-xl sm:bottom-[92px] sm:right-5 md:size-16 ${
          visible && !isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <Headset className="size-7 md:size-8" aria-hidden="true" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
          1
        </span>
      </button>

      {/* Chat window */}
      <div
        className={`fixed inset-x-0 bottom-4 z-50 mx-auto flex flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl transition-all duration-300 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[380px] sm:rounded-2xl ${
          isOpen
            ? "pointer-events-auto h-[85dvh] translate-y-0 scale-100 opacity-100 sm:h-[550px]"
            : "pointer-events-none h-[85dvh] translate-y-8 scale-95 opacity-0 sm:h-[550px]"
        }`}
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-hidden={!isOpen}
        inert={!isOpen}
        aria-label="Sabta Trading support chat"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-4 py-3.5 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/30">
              <Headset className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-sans text-[15px] font-bold leading-tight">{c.headerTitle}</h3>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                <span className="truncate text-[11px] font-medium text-primary-foreground/75">{c.headerStatus}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label={c.closeLabel}
            className="shrink-0 rounded-full bg-white/10 p-2 text-primary-foreground transition-colors hover:bg-white/25"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages flex-1 overflow-y-auto bg-secondary/40 p-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "rounded-se-none bg-primary text-primary-foreground"
                        : "rounded-ss-none border border-border bg-white text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line">{renderRichText(msg.text)}</p>

                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-2 font-sans">
                        {msg.actions.map((act) =>
                          act.href.startsWith("action:") ? (
                            <button
                              key={act.label}
                              type="button"
                              onClick={() => handleActionClick(act.href)}
                              className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                            >
                              {act.label}
                            </button>
                          ) : act.external ? (
                            <a
                              key={act.label}
                              href={act.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                            >
                              {act.label}
                            </a>
                          ) : (
                            <Link
                              key={act.label}
                              href={act.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                            >
                              {act.label}
                              <ArrowRight className="size-3" aria-hidden="true" />
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {msg.sender === "bot" && msg.showQuickReplies && (
                  <div className="space-y-2 py-1 pe-4 ps-1">
                    <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="size-3 text-accent" aria-hidden="true" />
                      {c.menuPrompt}
                    </div>
                    <div className="flex flex-col gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          type="button"
                          onClick={() => handleSendMessage(reply.question, true)}
                          className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-start text-xs font-medium text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start justify-start">
                <div className="flex items-center gap-1 rounded-xl rounded-ss-none border border-border bg-white px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border bg-white px-3 py-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={c.inputPlaceholder}
            className="min-w-0 flex-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/15"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            aria-label={c.sendLabel}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md shadow-accent/25 transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:scale-100 disabled:opacity-40"
          >
            <Send className="size-[18px] translate-x-[1px]" aria-hidden="true" />
          </button>
        </form>

        <style>{`
          .chatbot-messages::-webkit-scrollbar { width: 5px; }
          .chatbot-messages::-webkit-scrollbar-track { background: transparent; }
          .chatbot-messages::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--primary) 15%, transparent); border-radius: 10px; }
          .chatbot-messages::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--primary) 35%, transparent); }
        `}</style>
      </div>
    </>
  )
}
