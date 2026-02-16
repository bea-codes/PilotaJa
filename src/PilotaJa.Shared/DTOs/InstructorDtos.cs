namespace PilotaJa.Shared.DTOs;

public class InstructorSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public double Rating { get; set; }
    public int TotalLessons { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
}

public class InstructorDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string LicenseCategory { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
    public double Rating { get; set; }
    public int TotalLessons { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int ServiceRadiusKm { get; set; }
    public List<AvailabilityDto> Availabilities { get; set; } = [];
}

public class AvailabilityDto
{
    public DayOfWeek DayOfWeek { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
}

public class ListInstructorsRequest
{
    public string? City { get; set; }
    public string? State { get; set; }
    public decimal? MaxPrice { get; set; }
    public double? MinRating { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class ListInstructorsResponse
{
    public List<InstructorSummaryDto> Instructors { get; set; } = [];
    public int Total { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
}
