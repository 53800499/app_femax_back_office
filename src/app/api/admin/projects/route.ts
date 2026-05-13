import { NextResponse } from "next/server";
import { projectService } from "@/server/modules/project/project.service";

export async function GET() {
  try {
    const projects = await projectService.getProjects();

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await projectService.createProject(body);

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
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
