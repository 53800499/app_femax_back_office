import { NextResponse } from "next/server";

import { serviceService } from "@/server/modules/service/service.service";
import { logService } from "@/server/modules/log/log.service";

export async function GET() {
  try {
    const services =
      await serviceService.getServices();

    return NextResponse.json({
      success: true,

      data: services,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to fetch services",
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

    await serviceService.createService(
      body
    );
    
    await logService.createLog({
      title: `Service créé : ${body.title}`,
      category: "Service",
      author: "Admin",
      status: "Création",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,

      message:
        "Service created successfully",
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