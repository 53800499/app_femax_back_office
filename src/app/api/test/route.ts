import { NextResponse } from "next/server";
import { db } from "@/server/firebase/admin";

export async function GET() {
  try {
    const snapshot = await db.collection("test").get();

    return NextResponse.json({
      success: true,
      count: snapshot.size,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}