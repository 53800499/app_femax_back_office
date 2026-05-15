import { NextResponse } from "next/server";

import { logService } from "@/server/modules/log/log.service";
import { equipeService } from "@/server/modules/equipe/equipe.service";

export async function GET() {
  try {
    const data =
      await equipeService.getEquipes();

    return NextResponse.json({
      success: true,

      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to fetch equipes",
      },

      { status: 500 }
    );
  }
}

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    await equipeService.createEquipe(
      body
    );
    
    await logService.createLog({
      title: `Équipe créée : ${body.name}`,
      category: "Équipe",
      author: "Admin",
      status: "Création",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,

      message:
        "Équipe created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },

      { status: 400 }
    );
  }
}