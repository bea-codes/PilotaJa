namespace PilotaJa.API.Domain;

public class Instructor
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string LicenseCategory { get; set; } = string.Empty; // AB, B, etc.
    public decimal HourlyRate { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
    public double Rating { get; set; }
    public int TotalLessons { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int ServiceRadiusKm { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<Availability> Availabilities { get; set; } = [];
    public List<Appointment> Appointments { get; set; } = [];
}

public class Availability
{
    public Guid Id { get; set; }
    public Guid InstructorId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    
    public Instructor Instructor { get; set; } = null!;
}

public class Student
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TaxId { get; set; } // CPF
    public DateTime? DateOfBirth { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<Appointment> Appointments { get; set; } = [];
}

public class Appointment
{
    public Guid Id { get; set; }
    public Guid InstructorId { get; set; }
    public Guid StudentId { get; set; }
    public DateTime DateTime { get; set; }
    public int DurationMinutes { get; set; } = 50;
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public decimal Price { get; set; }
    public string? Notes { get; set; }
    public string? MeetingAddress { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    
    public Instructor Instructor { get; set; } = null!;
    public Student Student { get; set; } = null!;
}

public enum AppointmentStatus
{
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled,
    NoShow
}
