import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { DrivingSchool, Instructor, Student, Lesson } from '@/lib/models';

// POST /api/seed - Populate initial data for testing
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if data already exists
    const existingSchool = await DrivingSchool.findOne();
    if (existingSchool) {
      return NextResponse.json({ 
        message: 'Data already exists. Use DELETE first to clear.',
        drivingSchool: existingSchool
      }, { status: 200 });
    }

    // 1. Create Driving School
    const drivingSchool = await DrivingSchool.create({
      name: 'PilotaJá Driving School',
      cnpj: '12.345.678/0001-99',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      },
      phone: '(11) 99999-9999',
      email: 'contact@pilotaja.com.br',
    });

    // 2. Create Instructors
    const instructors = await Instructor.create([
      {
        name: 'Carlos Silva',
        email: 'carlos@pilotaja.com.br',
        phone: '(11) 98888-1111',
        drivingSchoolId: drivingSchool._id,
        license: '12345678900',
        categories: ['D'],
        active: true,
      },
      {
        name: 'Maria Santos',
        email: 'maria@pilotaja.com.br',
        phone: '(11) 98888-2222',
        drivingSchoolId: drivingSchool._id,
        license: '12345678901',
        categories: ['B'],
        active: true,
      },
      {
        name: 'João Oliveira',
        email: 'joao@pilotaja.com.br',
        phone: '(11) 98888-3333',
        drivingSchoolId: drivingSchool._id,
        license: '12345678902',
        categories: ['A', 'B'],
        active: true,
      },
    ]);

    // 3. Create Student (Cassio)
    const student = await Student.create({
      name: 'Cassio Basile',
      email: 'cassio@email.com',
      phone: '(11) 97777-7777',
      cpf: '123.456.789-00',
      drivingSchoolId: drivingSchool._id,
      birthDate: new Date('1990-01-01'),
      desiredCategory: 'B',
      status: 'active',
    });

    // 4. Create sample lessons
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const lessons = await Lesson.create([
      {
        drivingSchoolId: drivingSchool._id,
        studentId: student._id,
        instructorId: instructors[0]._id,
        dateTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
        duration: 50,
        type: 'practical',
        status: 'scheduled',
      },
      {
        drivingSchoolId: drivingSchool._id,
        studentId: student._id,
        instructorId: instructors[1]._id,
        dateTime: new Date(nextWeek.setHours(14, 0, 0, 0)),
        duration: 50,
        type: 'practical',
        status: 'scheduled',
      },
      // Past lessons (completed)
      {
        drivingSchoolId: drivingSchool._id,
        studentId: student._id,
        instructorId: instructors[0]._id,
        dateTime: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        duration: 50,
        type: 'practical',
        status: 'completed',
      },
      {
        drivingSchoolId: drivingSchool._id,
        studentId: student._id,
        instructorId: instructors[2]._id,
        dateTime: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
        duration: 50,
        type: 'practical',
        status: 'completed',
      },
    ]);

    return NextResponse.json({
      message: 'Data created successfully!',
      data: {
        drivingSchool: {
          _id: drivingSchool._id,
          name: drivingSchool.name,
        },
        instructors: instructors.map((i: any) => ({ _id: i._id, name: i.name })),
        student: {
          _id: student._id,
          name: student.name,
        },
        lessons: lessons.length,
      },
      // IDs to use in mobile app
      config: {
        drivingSchoolId: drivingSchool._id.toString(),
        studentId: student._id.toString(),
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating seed:', error);
    return NextResponse.json({ error: 'Error creating initial data', details: String(error) }, { status: 500 });
  }
}

// DELETE /api/seed - Clear all data (careful!)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    await Promise.all([
      Lesson.deleteMany({}),
      Student.deleteMany({}),
      Instructor.deleteMany({}),
      DrivingSchool.deleteMany({}),
    ]);

    return NextResponse.json({ message: 'All data removed' });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json({ error: 'Error clearing data' }, { status: 500 });
  }
}

// GET /api/seed - Check data status
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const [drivingSchools, instructors, students, lessons] = await Promise.all([
      DrivingSchool.countDocuments(),
      Instructor.countDocuments(),
      Student.countDocuments(),
      Lesson.countDocuments(),
    ]);

    const student = await Student.findOne();
    const drivingSchool = await DrivingSchool.findOne();

    return NextResponse.json({
      status: drivingSchools > 0 ? 'populated' : 'empty',
      counts: { drivingSchools, instructors, students, lessons },
      config: student && drivingSchool ? {
        drivingSchoolId: drivingSchool._id.toString(),
        studentId: student._id.toString(),
      } : null,
    });
  } catch (error) {
    console.error('Error checking seed:', error);
    return NextResponse.json({ error: 'Error checking data' }, { status: 500 });
  }
}
