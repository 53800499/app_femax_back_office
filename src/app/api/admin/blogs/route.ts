import { NextResponse } from "next/server";

import { blogService } from "@/server/modules/blog/blog.service";

export async function GET() {
  try {
    const blogs =
      await blogService.getBlogs();

    return NextResponse.json({
      success: true,

      data: blogs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to fetch blogs",
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

    await blogService.createBlog(
      body
    );

    return NextResponse.json({
      success: true,

      message:
        "Blog created successfully",
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