import {
  NextRequest,
  NextResponse,
} from "next/server";

import { serviceService } from "@/server/modules/service/service.service";

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

    await serviceService.updateService(
      Number(id),
      body
    );

    return NextResponse.json({
      success: true,

      message:
        "Service updated successfully",
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

    await serviceService.deleteService(
      Number(id)
    );

    return NextResponse.json({
      success: true,

      message:
        "Service deleted successfully",
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