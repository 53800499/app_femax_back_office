import {
  NextRequest,
  NextResponse,
} from "next/server";

import { blogService } from "@/server/modules/blog/blog.service";
import { logService } from "@/server/modules/log/log.service";

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
    await logService.createLog({
      title: `Article modifié`,
      category: "Blog",
      author: "Admin",
      status: "Modification",
      createdAt: new Date().toISOString(),
    });

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
    await logService.createLog({
      title: `Article supprimé`,
      category: "Blog",
      author: "Admin",
      status: "Suppression",
      createdAt: new Date().toISOString(),
    });

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