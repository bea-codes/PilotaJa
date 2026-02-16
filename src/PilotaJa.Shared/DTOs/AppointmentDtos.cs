namespace PilotaJa.Shared.DTOs;

public class CreateAppointmentRequest
{
    public Guid InstructorId { get; set; }
    public Guid StudentId { get; set; }
    public DateTime DateTime { get; set; }
    public int DurationMinutes { get; set; } = 50;
    public string? Notes { get; set; }
    public string? MeetingAddress { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public string? InstructorPhotoUrl { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }
    public int DurationMinutes { get; set; }
    public AppointmentStatus Status { get; set; }
    public decimal Price { get; set; }
    public string? Notes { get; set; }
    public string? MeetingAddress { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAppointmentResponse
{
    public Guid Id { get; set; }
    public AppointmentStatus Status { get; set; }
    public decimal Price { get; set; }
    public string Message { get; set; } = string.Empty;
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
