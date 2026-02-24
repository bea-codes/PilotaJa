import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Student } from '@/lib/models';

// GET /api/students - List students
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const drivingSchoolId = searchParams.get('drivingSchoolId');

    const query: any = {};
    if (drivingSchoolId) query.drivingSchoolId = drivingSchoolId;

    const students = await Student.find(query)
      .select('name email phone desiredCategory status photoUrl')
      .sort({ name: 1 });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
