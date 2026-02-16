using FastEndpoints;
using PilotaJa.API.Domain;
using PilotaJa.API.Infrastructure.Persistence;

namespace PilotaJa.API.Features.Instructors;

public class CreateInstructorRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string LicenseCategory { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int ServiceRadiusKm { get; set; } = 10;
    public List<AvailabilityDto> Availabilities { get; set; } = [];
}

public class CreateInstructorResponse
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class CreateInstructorEndpoint : Endpoint<CreateInstructorRequest, CreateInstructorResponse>
{
    private readonly IRepository<Instructor> _repository;

    public CreateInstructorEndpoint(IRepository<Instructor> repository)
    {
        _repository = repository;
    }

    public override void Configure()
    {
        Post("/api/instructors");
        AllowAnonymous(); // TODO: Require admin auth
        Summary(s =>
        {
            s.Summary = "Create a new instructor";
            s.Description = "Registers a new instructor in the system";
        });
    }

    public override async Task HandleAsync(CreateInstructorRequest req, CancellationToken ct)
    {
        var instructor = new Instructor
        {
            Name = req.Name,
            Email = req.Email,
            Phone = req.Phone,
            LicenseCategory = req.LicenseCategory,
            HourlyRate = req.HourlyRate,
            PhotoUrl = req.PhotoUrl,
            Bio = req.Bio,
            City = req.City,
            State = req.State,
            ServiceRadiusKm = req.ServiceRadiusKm,
            Availabilities = req.Availabilities.Select(a => new Availability
            {
                DayOfWeek = a.DayOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime
            }).ToList()
        };

        await _repository.CreateAsync(instructor);

        await SendCreatedAtAsync<GetInstructorEndpoint>(
            new { Id = instructor.Id },
            new CreateInstructorResponse
            {
                Id = instructor.Id,
                Message = "Instructor created successfully"
            },
            cancellation: ct);
    }
}
