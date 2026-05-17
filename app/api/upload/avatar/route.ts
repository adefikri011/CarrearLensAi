import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 })
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      return NextResponse.json({ success: false, error: "File size must be less than 2MB" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const fileExt = file.name.split(".").pop()
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return NextResponse.json({ success: false, error: "Failed to upload to storage" }, { status: 500 })
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    // Update User in Database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl }
    })

    return NextResponse.json({ 
      success: true, 
      data: { 
        url: publicUrl,
        user: updatedUser
      } 
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
