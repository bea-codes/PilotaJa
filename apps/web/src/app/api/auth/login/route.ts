import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Student, Instructor } from '@/lib/models';
import bcrypt from 'bcryptjs';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email, active: true });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get profile based on role
    let profile = null;
    if (user.role === 'student' && user.studentId) {
      profile = await Student.findById(user.studentId)
        .select('name email phone desiredCategory status photoUrl');
    } else if (user.role === 'instructor' && user.instructorId) {
      profile = await Instructor.findById(user.instructorId)
        .select('name email phone categories');
    }

    // For now, return user data (later: JWT token)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        drivingSchoolId: user.drivingSchoolId,
        studentId: user.studentId,
        instructorId: user.instructorId,
      },
      profile,
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
