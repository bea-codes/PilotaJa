using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.Services;

public interface IApiService
{
    Task<ListInstructorsResponse> GetInstructorsAsync(ListInstructorsRequest? request = null);
    Task<InstructorDetailDto> GetInstructorAsync(Guid id);
    Task<List<AppointmentDto>> GetAppointmentsAsync();
    Task<CreateAppointmentResponse> CreateAppointmentAsync(CreateAppointmentRequest request);
    Task<StudentDto> GetProfileAsync();
}

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync();
    bool IsLoggedIn { get; }
    string? Token { get; }
}
