import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Instructor } from '@/lib/models';

// GET /api/instructors - List instructors
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const drivingSchoolId = searchParams.get('drivingSchoolId');

    const query: any = { active: true };
    if (drivingSchoolId) query.drivingSchoolId = drivingSchoolId;

    const instructors = await Instructor.find(query)
      .select('name email phone categories')
      .sort({ name: 1 });

    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
