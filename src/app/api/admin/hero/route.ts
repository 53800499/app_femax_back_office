import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: false,
    message: "Hero API endpoint is not implemented yet.",
  });
}
