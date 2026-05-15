import { NextResponse } from "next/server";

import { logService } from "@/server/modules/log/log.service";

/* ------------------------------ GET LOGS ----------------------------- */

export async function GET() {
  try {
    const logs = await logService.getLogs();

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch logs",
      },
      { status: 500 }
    );
  }
}

/* ------------------------------ CREATE LOG ----------------------------- */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await logService.createLog(body);

    return NextResponse.json({
      success: true,
      message: "Log created successfully",
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