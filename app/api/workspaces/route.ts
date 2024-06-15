// app/api/workspaces/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api'; // Import the Convex API
import { fetchQuery, fetchMutation } from 'convex/nextjs';

export async function GET(req: NextRequest) {
  try {
    const workspaces = await fetchQuery(api.workspaces.getAll);
    return NextResponse.json(workspaces, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, ownerId } = await req.json();
    const newWorkspace = await fetchMutation(api.workspaces.create, { name, ownerId });
    return NextResponse.json(newWorkspace, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { workspaceId, userId, permission } = await req.json();
    const updatedMembers = await fetchMutation(api.workspaces.updateWorkspacePermissions, { workspaceId, userId, permission });
    return NextResponse.json({ message: 'Permissions updated', updatedMembers }, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}