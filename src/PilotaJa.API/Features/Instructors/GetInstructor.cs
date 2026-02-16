using FastEndpoints;
using PilotaJa.API.Domain;
using PilotaJa.API.Infrastructure.Persistence;

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
    private readonly IRepository<Instructor> _repository;

    public GetInstructorEndpoint(IRepository<Instructor> repository)
    {
        _repository = repository;
    }

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
        var instructor = await _repository.GetByIdAsync(req.Id);
        
        if (instructor == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var dto = new InstructorDetailDto
        {
            Id = instructor.Id,
            Name = instructor.Name,
            Email = instructor.Email,
            Phone = instructor.Phone,
            LicenseCategory = instructor.LicenseCategory,
            HourlyRate = instructor.HourlyRate,
            PhotoUrl = instructor.PhotoUrl,
            Bio = instructor.Bio,
            Rating = instructor.Rating,
            TotalLessons = instructor.TotalLessons,
            City = instructor.City,
            State = instructor.State,
            ServiceRadiusKm = instructor.ServiceRadiusKm,
            Availabilities = instructor.Availabilities.Select(a => new AvailabilityDto
            {
                DayOfWeek = a.DayOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime
            }).ToList()
        };

        await SendAsync(dto, cancellation: ct);
    }
}
