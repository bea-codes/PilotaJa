using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.Services;

public interface IApiService
{
    Task<ListInstructorsResponse> GetInstructorsAsync(ListInstructorsRequest? request = null);
    Task<InstructorDetailDto> GetInstructorAsync(Guid id);
    Task<List<AppointmentDto>> GetAppointmentsAsync();
    Task<List<InstructorAppointmentDto>> GetInstructorAppointmentsAsync(Guid instructorId);
    Task<CreateAppointmentResponse> CreateAppointmentAsync(CreateAppointmentRequest request);
    Task<StudentDto> GetProfileAsync();
}

public class InstructorAppointmentDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }
    public int DurationMinutes { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync();
    bool IsLoggedIn { get; }
    string? Token { get; }
}
