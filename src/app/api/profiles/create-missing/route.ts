import { NextResponse } from 'next/server';
import { createMissingProfiles } from '@/app/actions/profiles';

export async function POST() {
  try {
    const result = await createMissingProfiles();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in create-missing profiles route:', error);
    return NextResponse.json(
      { error: 'Failed to create missing profiles' },
      { status: 500 }
    );
  }
} 