using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PilotaJa.API.Domain;

public class Instructor
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public Guid Id { get; set; } = Guid.NewGuid();
    
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
    
    [BsonRepresentation(BsonType.String)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Embedded - always loaded with instructor
    public List<Availability> Availabilities { get; set; } = [];
}

public class Availability
{
    public DayOfWeek DayOfWeek { get; set; }
    public string StartTime { get; set; } = string.Empty; // "08:00"
    public string EndTime { get; set; } = string.Empty;   // "18:00"
}

public class Student
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TaxId { get; set; } // CPF
    public DateTime? DateOfBirth { get; set; }
    public string? PhotoUrl { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Appointment
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [BsonRepresentation(BsonType.String)]
    public Guid InstructorId { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public Guid StudentId { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public DateTime DateTime { get; set; }
    
    public int DurationMinutes { get; set; } = 50;
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; set; }
    
    public string? Notes { get; set; }
    public string? MeetingAddress { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [BsonRepresentation(BsonType.String)]
    public DateTime? ConfirmedAt { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public DateTime? CompletedAt { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public DateTime? CancelledAt { get; set; }
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
