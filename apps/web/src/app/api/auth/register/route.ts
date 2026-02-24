import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Student, DrivingSchool } from '@/lib/models';
import bcrypt from 'bcryptjs';

// POST /api/auth/register - Register new student
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, phone, cpf, password, drivingSchoolCode } = body;

    // Validation
    if (!name || !email || !phone || !cpf || !password) {
      return NextResponse.json(
        { error: 'Required fields: name, email, phone, cpf, password' },
        { status: 400 }
      );
    }

    // Find driving school (by code or use default for now)
    let drivingSchool = await DrivingSchool.findOne();
    if (!drivingSchool) {
      return NextResponse.json(
        { error: 'No driving school registered in the system' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ 
      drivingSchoolId: drivingSchool._id, 
      email 
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if CPF already exists
    const existingStudent = await Student.findOne({ 
      drivingSchoolId: drivingSchool._id, 
      cpf 
    });
    if (existingStudent) {
      return NextResponse.json(
        { error: 'CPF already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      drivingSchoolId: drivingSchool._id,
      email,
      password: passwordHash,
      role: 'student',
      active: true,
    });
    await user.save();

    // Create Student linked to User
    const student = new Student({
      drivingSchoolId: drivingSchool._id,
      userId: user._id,
      name,
      email,
      phone,
      cpf,
      birthDate: new Date('1990-01-01'), // Default, can update later
      desiredCategory: 'B', // Default
      status: 'active',
    });
    await student.save();

    // Update User with studentId
    user.studentId = student._id;
    await user.save();

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      student: {
        id: student._id,
        name: student.name,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
