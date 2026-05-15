import { NextResponse } from "next/server";

import { serviceService } from "@/server/modules/service/service.service";

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