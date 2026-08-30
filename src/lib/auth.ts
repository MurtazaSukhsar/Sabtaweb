// Hand-rolled admin auth: a password check plus an HMAC-signed, httpOnly
// session cookie. No auth library / database — kept intentionally simple so
// it works with zero extra dependencies.
//
// Configure via environment variables (see .env.local):
//   ADMIN_PASSWORD        — the password required to log into /admin
//   ADMIN_SESSION_SECRET  — secret used to sign the session cookie
// Both have fallback defaults below so the admin works out of the box, but
// you should set your own values in .env.local for a real deployment.

import crypto from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const COOKIE_NAME = "sabta_admin_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

const FALLBACK_PASSWORD = "Sabta@Admin2026"
const FALLBACK_SECRET = "sabta-trading-admin-fallback-secret-please-override"

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || FALLBACK_SECRET
}

import { supabase, isSupabaseConfigured } from "./supabase"

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex")
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Fallback to environment password check for local development
    return password.length > 0 && password === getAdminPassword()
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      console.error("Supabase Auth failed:", error?.message)
      return false
    }

    return true
  } catch (err) {
    console.error("Exception during auth check:", err)
    return false
  }
}

export async function createSession() {
  const expires = Date.now() + SESSION_TTL_MS
  const payload = `admin:${expires}`
  const value = `${Buffer.from(payload, "utf8").toString("base64url")}.${sign(payload)}`
  const store = await cookies()
  // Cookie "Secure" mode is opt-in (ADMIN_COOKIE_SECURE=true) rather than
  // tied to NODE_ENV — `next start` runs in production mode even on a
  // plain-HTTP local server, and a Secure cookie is silently dropped by the
  // browser over HTTP, which would make it impossible to log in. Set
  // ADMIN_COOKIE_SECURE=true in .env.local once the site is served over
  // HTTPS.
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    expires: new Date(expires),
  })
}

export async function destroySession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return false
  const [encoded, sig] = raw.split(".")
  if (!encoded || !sig) return false

  let payload: string
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8")
  } catch {
    return false
  }
  if (sign(payload) !== sig) return false

  const [tag, expiresStr] = payload.split(":")
  if (tag !== "admin") return false
  const expires = Number(expiresStr)
  if (!Number.isFinite(expires) || Date.now() > expires) return false

  return true
}

/** Call at the top of any protected server component; redirects to the
 * login page when there is no valid session. */
export async function requireAdmin() {
  const ok = await isAuthenticated()
  if (!ok) redirect("/admin/login")
}
