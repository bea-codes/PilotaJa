using FastEndpoints;
using PilotaJa.API.Domain;

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
        // TODO: Validate instructor availability
        // TODO: Calculate price based on instructor's hourly rate
        // TODO: Persist to database
        // TODO: Notify instructor
        
        var appointment = new CreateAppointmentResponse
        {
            Id = Guid.NewGuid(),
            Status = AppointmentStatus.Pending,
            Price = 80.00m, // TODO: Get from instructor
            Message = "Appointment created! Waiting for instructor confirmation."
        };

        await SendCreatedAtAsync<GetAppointmentEndpoint>(
            new { Id = appointment.Id },
            appointment,
            cancellation: ct);
    }
}

public class GetAppointmentEndpoint : EndpointWithoutRequest<Appointment>
{
    public override void Configure()
    {
        Get("/api/appointments/{Id}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<Guid>("Id");
        
        // TODO: Query database
        await SendAsync(new Appointment { Id = id }, cancellation: ct);
    }
}
