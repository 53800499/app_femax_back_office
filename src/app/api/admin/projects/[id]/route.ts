import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/server/modules/project/project.service";
import { logService } from "@/server/modules/log/log.service";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await projectService.updateProject(id, body);

    await logService.createLog({
      title: `Projet modifié`,
      category: "Projet",
      author: "Admin",
      status: "Modification",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await projectService.deleteProject(id);

    await logService.createLog({
      title: `Projet supprimé`,
      category: "Projet",
      author: "Admin",
      status: "Suppression",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}