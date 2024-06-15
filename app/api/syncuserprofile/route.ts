// app/api/syncuserprofile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { api } from '@/convex/_generated/api';
import { fetchQuery, fetchMutation } from 'convex/nextjs';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userProfiles = await fetchQuery(api.userprofile.getAllUserProfiles);
    return NextResponse.json(userProfiles, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const profileData = {
      avatar: user.imageUrl || '',
      displayName: user.fullName || '',
      email: user.emailAddresses[0].emailAddress,
    };

    const newUserProfile = await fetchMutation(api.userprofile.upsertUserProfile, {
      clerkUserId: user.id,
      profileData,
    });
    return NextResponse.json(newUserProfile, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}