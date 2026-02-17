using System.Net.Http.Json;
using System.Text.Json;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.Services;

public class ApiService : IApiService
{
    private readonly HttpClient _httpClient;
    private readonly IAuthService _authService;
    private readonly JsonSerializerOptions _jsonOptions;

    // TODO: Move to configuration
    private const string BaseUrl = "http://10.0.2.2:5000"; // Android emulator
    // private const string BaseUrl = "http://localhost:5000"; // iOS simulator

    public ApiService(IAuthService authService)
    {
        _authService = authService;
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(BaseUrl)
        };
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    private void AddAuthHeader()
    {
        if (_authService.IsLoggedIn && !string.IsNullOrEmpty(_authService.Token))
        {
            _httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authService.Token);
        }
    }

    public async Task<ListInstructorsResponse> GetInstructorsAsync(ListInstructorsRequest? request = null)
    {
        var query = "";
        if (request != null)
        {
            var queryParams = new List<string>();
            if (!string.IsNullOrEmpty(request.City)) queryParams.Add($"city={request.City}");
            if (!string.IsNullOrEmpty(request.State)) queryParams.Add($"state={request.State}");
            if (request.MaxPrice.HasValue) queryParams.Add($"maxPrice={request.MaxPrice}");
            if (request.MinRating.HasValue) queryParams.Add($"minRating={request.MinRating}");
            queryParams.Add($"page={request.Page}");
            queryParams.Add($"pageSize={request.PageSize}");
            query = "?" + string.Join("&", queryParams);
        }

        var response = await _httpClient.GetAsync($"/api/instructors{query}");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<ListInstructorsResponse>(_jsonOptions) 
            ?? new ListInstructorsResponse();
    }

    public async Task<InstructorDetailDto> GetInstructorAsync(Guid id)
    {
        var response = await _httpClient.GetAsync($"/api/instructors/{id}");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<InstructorDetailDto>(_jsonOptions) 
            ?? throw new Exception("Instructor not found");
    }

    public async Task<List<AppointmentDto>> GetAppointmentsAsync()
    {
        AddAuthHeader();
        var response = await _httpClient.GetAsync("/api/appointments");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<List<AppointmentDto>>(_jsonOptions) 
            ?? [];
    }

    public async Task<List<InstructorAppointmentDto>> GetInstructorAppointmentsAsync(Guid instructorId)
    {
        var response = await _httpClient.GetAsync($"/api/instructors/{instructorId}/appointments");
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<InstructorAppointmentsResponse>(_jsonOptions);
        return result?.Appointments ?? [];
    }

    private class InstructorAppointmentsResponse
    {
        public List<InstructorAppointmentDto> Appointments { get; set; } = [];
    }

    public async Task<CreateAppointmentResponse> CreateAppointmentAsync(CreateAppointmentRequest request)
    {
        AddAuthHeader();
        var response = await _httpClient.PostAsJsonAsync("/api/appointments", request);
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<CreateAppointmentResponse>(_jsonOptions) 
            ?? throw new Exception("Error creating appointment");
    }

    public async Task<StudentDto> GetProfileAsync()
    {
        AddAuthHeader();
        var response = await _httpClient.GetAsync("/api/students/me");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<StudentDto>(_jsonOptions) 
            ?? throw new Exception("Profile not found");
    }
}
