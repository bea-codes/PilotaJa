using FastEndpoints;
using PilotaJa.API.Domain;

namespace PilotaJa.API.Features.Instructors;

public class GetInstructorRequest
{
    public Guid Id { get; set; }
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

public class GetInstructorEndpoint : Endpoint<GetInstructorRequest, InstructorDetailDto>
{
    public override void Configure()
    {
        Get("/api/instructors/{Id}");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "Get instructor by ID";
            s.Description = "Returns full instructor details including availability schedule";
        });
    }

    public override async Task HandleAsync(GetInstructorRequest req, CancellationToken ct)
    {
        // TODO: Query database
        
        var instructor = new InstructorDetailDto
        {
            Id = req.Id,
            Name = "João Silva",
            Email = "joao@email.com",
            Phone = "(11) 99999-9999",
            LicenseCategory = "AB",
            HourlyRate = 80.00m,
            Bio = "10 years of experience, specialist with nervous students",
            Rating = 4.8,
            TotalLessons = 150,
            City = "São Paulo",
            State = "SP",
            ServiceRadiusKm = 15,
            Availabilities =
            [
                new() { DayOfWeek = DayOfWeek.Monday, StartTime = "08:00", EndTime = "18:00" },
                new() { DayOfWeek = DayOfWeek.Tuesday, StartTime = "08:00", EndTime = "18:00" },
                new() { DayOfWeek = DayOfWeek.Wednesday, StartTime = "08:00", EndTime = "18:00" },
                new() { DayOfWeek = DayOfWeek.Thursday, StartTime = "08:00", EndTime = "18:00" },
                new() { DayOfWeek = DayOfWeek.Friday, StartTime = "08:00", EndTime = "18:00" },
                new() { DayOfWeek = DayOfWeek.Saturday, StartTime = "08:00", EndTime = "12:00" },
            ]
        };

        await SendAsync(instructor, cancellation: ct);
    }
}
