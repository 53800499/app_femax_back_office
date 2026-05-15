import {
  NextRequest,
  NextResponse,
} from "next/server";

import { logService } from "@/server/modules/log/log.service";
import { equipeService } from "@/server/modules/equipe/equipe.service";

export async function PUT(
  req: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const body =
      await req.json();

    await equipeService.updateEquipe(
      Number(id),
      body
    );

    await logService.createLog({
      title: `Équipe modifiée : ${body.name}`,
      category: "Équipe",
      author: "Admin",
      status: "Modification",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,

      message:
        "Équipe updated successfully",
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

export async function DELETE(
  req: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    await equipeService.deleteEquipe(
      Number(id)
    );
    await logService.createLog({
      title: `Équipe supprimée`,
      category: "Équipe",
      author: "Admin",
      status: "Suppression",
      createdAt: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,

      message:
        "Équipe deleted successfully",
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

      { status: 500 }
    );
  }
}