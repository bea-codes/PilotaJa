using FastEndpoints;
using PilotaJa.API.Domain;
using PilotaJa.API.Infrastructure.Persistence;

namespace PilotaJa.API.Features.Appointments;

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

public class CreateAppointmentResponse
{
    public Guid Id { get; set; }
    public AppointmentStatus Status { get; set; }
    public decimal Price { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class CreateAppointmentEndpoint : Endpoint<CreateAppointmentRequest, CreateAppointmentResponse>
{
    private readonly IRepository<Appointment> _appointmentRepo;
    private readonly IRepository<Instructor> _instructorRepo;

    public CreateAppointmentEndpoint(
        IRepository<Appointment> appointmentRepo,
        IRepository<Instructor> instructorRepo)
    {
        _appointmentRepo = appointmentRepo;
        _instructorRepo = instructorRepo;
    }

    public override void Configure()
    {
        Post("/api/appointments");
        AllowAnonymous(); // TODO: Require authentication
        Summary(s =>
        {
            s.Summary = "Create a new appointment";
            s.Description = "Request a driving lesson with an instructor. The instructor needs to confirm.";
        });
    }

    public override async Task HandleAsync(CreateAppointmentRequest req, CancellationToken ct)
    {
        // Get instructor to calculate price
        var instructor = await _instructorRepo.GetByIdAsync(req.InstructorId);
        if (instructor == null)
        {
            AddError("InstructorId", "Instructor not found");
            await SendErrorsAsync(cancellation: ct);
            return;
        }

        // Calculate price based on duration
        var hours = req.DurationMinutes / 60.0m;
        var price = instructor.HourlyRate * hours;

        var appointment = new Appointment
        {
            InstructorId = req.InstructorId,
            StudentId = req.StudentId,
            DateTime = req.DateTime,
            DurationMinutes = req.DurationMinutes,
            Price = price,
            Notes = req.Notes,
            MeetingAddress = req.MeetingAddress,
            Latitude = req.Latitude,
            Longitude = req.Longitude
        };

        await _appointmentRepo.CreateAsync(appointment);

        await SendCreatedAtAsync<GetAppointmentEndpoint>(
            new { Id = appointment.Id },
            new CreateAppointmentResponse
            {
                Id = appointment.Id,
                Status = appointment.Status,
                Price = price,
                Message = "Appointment created! Waiting for instructor confirmation."
            },
            cancellation: ct);
    }
}

public class GetAppointmentEndpoint : Endpoint<GetAppointmentRequest, AppointmentDto>
{
    private readonly IRepository<Appointment> _appointmentRepo;
    private readonly IRepository<Instructor> _instructorRepo;

    public GetAppointmentEndpoint(
        IRepository<Appointment> appointmentRepo,
        IRepository<Instructor> instructorRepo)
    {
        _appointmentRepo = appointmentRepo;
        _instructorRepo = instructorRepo;
    }

    public override void Configure()
    {
        Get("/api/appointments/{Id}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(GetAppointmentRequest req, CancellationToken ct)
    {
        var appointment = await _appointmentRepo.GetByIdAsync(req.Id);
        if (appointment == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var instructor = await _instructorRepo.GetByIdAsync(appointment.InstructorId);

        var dto = new AppointmentDto
        {
            Id = appointment.Id,
            InstructorId = appointment.InstructorId,
            InstructorName = instructor?.Name ?? "Unknown",
            InstructorPhotoUrl = instructor?.PhotoUrl,
            StudentId = appointment.StudentId,
            DateTime = appointment.DateTime,
            DurationMinutes = appointment.DurationMinutes,
            Status = appointment.Status,
            Price = appointment.Price,
            Notes = appointment.Notes,
            MeetingAddress = appointment.MeetingAddress,
            CreatedAt = appointment.CreatedAt
        };

        await SendAsync(dto, cancellation: ct);
    }
}

public class GetAppointmentRequest
{
    public Guid Id { get; set; }
}

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public string? InstructorPhotoUrl { get; set; }
    public Guid StudentId { get; set; }
    public DateTime DateTime { get; set; }
    public int DurationMinutes { get; set; }
    public AppointmentStatus Status { get; set; }
    public decimal Price { get; set; }
    public string? Notes { get; set; }
    public string? MeetingAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}
