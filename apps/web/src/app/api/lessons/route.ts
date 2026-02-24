import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lesson } from '@/lib/models';

// GET /api/lessons - List lessons (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const drivingSchoolId = searchParams.get('drivingSchoolId');
    const instructorId = searchParams.get('instructorId');
    const studentId = searchParams.get('studentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const query: any = {};
    
    if (drivingSchoolId) query.drivingSchoolId = drivingSchoolId;
    if (instructorId) query.instructorId = instructorId;
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.dateTime = {};
      if (startDate) query.dateTime.$gte = new Date(startDate);
      if (endDate) query.dateTime.$lte = new Date(endDate);
    }

    const lessons = await Lesson.find(query)
      .populate('studentId', 'name email phone')
      .populate('instructorId', 'name email phone')
      .sort({ dateTime: 1 })
      .limit(100);

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/lessons - Create new lesson
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { drivingSchoolId, studentId, instructorId, dateTime, duration, type, notes } = body;

    // Basic validation
    if (!drivingSchoolId || !studentId || !instructorId || !dateTime || !type) {
      return NextResponse.json(
        { error: 'Required fields: drivingSchoolId, studentId, instructorId, dateTime, type' },
        { status: 400 }
      );
    }

    // Check for instructor schedule conflict
    const lessonDateTime = new Date(dateTime);
    const durationMinutes = duration || 50;
    const endTime = new Date(lessonDateTime.getTime() + durationMinutes * 60000);

    const conflict = await Lesson.findOne({
      instructorId,
      status: { $in: ['scheduled', 'confirmed'] },
      $or: [
        { dateTime: { $gte: lessonDateTime, $lt: endTime } },
        {
          $expr: {
            $and: [
              { $lt: ['$dateTime', endTime] },
              { $gt: [{ $add: ['$dateTime', { $multiply: ['$duration', 60000] }] }, lessonDateTime] }
            ]
          }
        }
      ]
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'Instructor already has a lesson scheduled at this time' },
        { status: 409 }
      );
    }

    const lesson = new Lesson({
      drivingSchoolId,
      studentId,
      instructorId,
      dateTime: lessonDateTime,
      duration: durationMinutes,
      type,
      notes,
      status: 'scheduled',
    });

    await lesson.save();

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
