"use server"

import { Resend } from "resend"

interface SubscribeResult {
  success: boolean
  message: string
}

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: "Email service is not configured. Please try again later.",
    }
  }

  if (!process.env.RESEND_AUDIENCE_ID) {
    return {
      success: false,
      message: "Email service is not configured. Please try again later.",
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  // Validate email on server
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email address",
    }
  }

  try {
    // Add contact to Resend audience
    const { error } = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: false,
    })

    if (error) {
      // Handle duplicate email
      if (error.message?.toLowerCase().includes("already exists")) {
        return {
          success: false,
          message: "This email is already subscribed",
        }
      }

      console.error("Resend error:", error)
      return {
        success: false,
        message: "Failed to subscribe. Please try again.",
      }
    }

    return {
      success: true,
      message: "Successfully subscribed!",
    }
  } catch (error) {
    console.error("Subscribe error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}
