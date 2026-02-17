using FastEndpoints;
using PilotaJa.API.Domain;
using PilotaJa.API.Infrastructure.Persistence;

namespace PilotaJa.API.Features.Appointments;

public class UpdateAppointmentStatusRequest
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty; // Confirmed, Cancelled, Completed
    public string? CancellationReason { get; set; }
}

public class UpdateAppointmentStatusResponse
{
    public Guid Id { get; set; }
    public AppointmentStatus NewStatus { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class UpdateAppointmentStatusEndpoint : Endpoint<UpdateAppointmentStatusRequest, UpdateAppointmentStatusResponse>
{
    private readonly IRepository<Appointment> _appointmentRepo;

    public UpdateAppointmentStatusEndpoint(IRepository<Appointment> appointmentRepo)
    {
        _appointmentRepo = appointmentRepo;
    }

    public override void Configure()
    {
        Patch("/api/appointments/{Id}/status");
        AllowAnonymous(); // TODO: Require instructor authentication
        Summary(s =>
        {
            s.Summary = "Update appointment status";
            s.Description = "Confirm, cancel or complete an appointment. Instructors use this to manage their bookings.";
        });
    }

    public override async Task HandleAsync(UpdateAppointmentStatusRequest req, CancellationToken ct)
    {
        var appointment = await _appointmentRepo.GetByIdAsync(req.Id);
        if (appointment == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        if (!Enum.TryParse<AppointmentStatus>(req.Status, true, out var newStatus))
        {
            AddError("Status", "Invalid status. Use: Confirmed, Cancelled, Completed");
            await SendErrorsAsync(cancellation: ct);
            return;
        }

        // Validate status transitions
        var validTransitions = new Dictionary<AppointmentStatus, AppointmentStatus[]>
        {
            { AppointmentStatus.Pending, new[] { AppointmentStatus.Confirmed, AppointmentStatus.Cancelled } },
            { AppointmentStatus.Confirmed, new[] { AppointmentStatus.Completed, AppointmentStatus.Cancelled } },
            { AppointmentStatus.Completed, Array.Empty<AppointmentStatus>() },
            { AppointmentStatus.Cancelled, Array.Empty<AppointmentStatus>() }
        };

        if (!validTransitions[appointment.Status].Contains(newStatus))
        {
            AddError("Status", $"Cannot change from {appointment.Status} to {newStatus}");
            await SendErrorsAsync(cancellation: ct);
            return;
        }

        appointment.Status = newStatus;
        
        if (newStatus == AppointmentStatus.Cancelled && !string.IsNullOrEmpty(req.CancellationReason))
        {
            appointment.Notes = $"{appointment.Notes}\n[Cancelado: {req.CancellationReason}]".Trim();
        }

        await _appointmentRepo.UpdateAsync(appointment.Id, appointment);

        var message = newStatus switch
        {
            AppointmentStatus.Confirmed => "Agendamento confirmado! O aluno será notificado.",
            AppointmentStatus.Cancelled => "Agendamento cancelado.",
            AppointmentStatus.Completed => "Aula marcada como concluída.",
            _ => "Status atualizado."
        };

        await SendAsync(new UpdateAppointmentStatusResponse
        {
            Id = appointment.Id,
            NewStatus = newStatus,
            Message = message
        }, cancellation: ct);
    }
}
