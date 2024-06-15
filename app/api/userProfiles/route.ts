// app/api/userProfiles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api'; // Import the Convex API
import { fetchQuery, fetchMutation } from 'convex/nextjs';

export async function GET(req: NextRequest) {
  try {
    const userProfiles = await fetchQuery(api.userprofile.getAllUserProfiles);
    return NextResponse.json(userProfiles, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { clerkUserId, profileData } = await req.json();
    const newUserProfile = await fetchMutation(api.userprofile.upsertUserProfile, { clerkUserId, profileData });
    return NextResponse.json(newUserProfile, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}