import {
  NextRequest,
  NextResponse,
} from "next/server";

import { blogService } from "@/server/modules/blog/blog.service";

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

    await blogService.updateBlog(
      id,
      body
    );

    return NextResponse.json({
      success: true,

      message:
        "Blog updated successfully",
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

    await blogService.deleteBlog(
      id
    );

    return NextResponse.json({
      success: true,

      message:
        "Blog deleted successfully",
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