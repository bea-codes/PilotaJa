using FastEndpoints;
using PilotaJa.API.Domain;
using PilotaJa.API.Infrastructure.Persistence;

namespace PilotaJa.API.Features.Instructors;

public class GetInstructorAppointmentsRequest
{
    public Guid Id { get; set; }
    public string? Status { get; set; } // Optional filter: Pending, Confirmed, Completed, Cancelled
}

public class InstructorAppointmentDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string? StudentPhone { get; set; }
    public DateTime DateTime { get; set; }
    public int DurationMinutes { get; set; }
    public string Status { get; set; } = string.Empty; // "Pending", "Confirmed", etc.
    public decimal Price { get; set; }
    public string? Notes { get; set; }
    public string? MeetingAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GetInstructorAppointmentsResponse
{
    public List<InstructorAppointmentDto> Appointments { get; set; } = new();
    public int TotalCount { get; set; }
}

public class GetInstructorAppointmentsEndpoint : Endpoint<GetInstructorAppointmentsRequest, GetInstructorAppointmentsResponse>
{
    private readonly IRepository<Appointment> _appointmentRepo;
    private readonly IRepository<Student> _studentRepo;

    public GetInstructorAppointmentsEndpoint(
        IRepository<Appointment> appointmentRepo,
        IRepository<Student> studentRepo)
    {
        _appointmentRepo = appointmentRepo;
        _studentRepo = studentRepo;
    }

    public override void Configure()
    {
        Get("/api/instructors/{Id}/appointments");
        AllowAnonymous(); // TODO: Require instructor authentication
        Summary(s =>
        {
            s.Summary = "Get instructor's appointments";
            s.Description = "List all appointments for an instructor. Optionally filter by status.";
        });
    }

    public override async Task HandleAsync(GetInstructorAppointmentsRequest req, CancellationToken ct)
    {
        var allAppointments = await _appointmentRepo.GetAllAsync();
        var instructorAppointments = allAppointments
            .Where(a => a.InstructorId == req.Id)
            .OrderByDescending(a => a.DateTime)
            .ToList();

        // Filter by status if provided
        if (!string.IsNullOrEmpty(req.Status) && Enum.TryParse<AppointmentStatus>(req.Status, true, out var status))
        {
            instructorAppointments = instructorAppointments.Where(a => a.Status == status).ToList();
        }

        // Get student info for each appointment
        var students = await _studentRepo.GetAllAsync();
        var studentDict = students.ToDictionary(s => s.Id);

        var dtos = instructorAppointments.Select(a => new InstructorAppointmentDto
        {
            Id = a.Id,
            StudentId = a.StudentId,
            StudentName = studentDict.TryGetValue(a.StudentId, out var student) ? student.Name : "Aluno",
            StudentPhone = studentDict.TryGetValue(a.StudentId, out var s) ? s.Phone : null,
            DateTime = a.DateTime,
            DurationMinutes = a.DurationMinutes,
            Status = a.Status.ToString(), // Convert enum to string
            Price = a.Price,
            Notes = a.Notes,
            MeetingAddress = a.MeetingAddress,
            CreatedAt = a.CreatedAt
        }).ToList();

        await SendAsync(new GetInstructorAppointmentsResponse
        {
            Appointments = dtos,
            TotalCount = dtos.Count
        }, cancellation: ct);
    }
}
