import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/server/firebase/admin";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size too large (max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Générer un nom de fichier unique
    const fileName = `projects/${decodedToken.uid}/${Date.now()}-${file.name}`;
    const fileUpload = storage.bucket().file(fileName);

    // Upload du fichier
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedBy: decodedToken.uid,
        },
      },
      public: true, // Pour permettre l'accès public aux images
    });

    // Obtenir l'URL publique
    const [url] = await fileUpload.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // URL valide longtemps
    });

    return NextResponse.json({
      success: true,
      url,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}