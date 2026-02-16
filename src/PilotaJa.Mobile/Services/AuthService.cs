using System.Net.Http.Json;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.Services;

public class AuthService : IAuthService
{
    private readonly HttpClient _httpClient;
    private const string TokenKey = "auth_token";
    private const string BaseUrl = "http://10.0.2.2:5000";

    public AuthService()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(BaseUrl)
        };
        
        // Carregar token salvo
        Token = Preferences.Get(TokenKey, null);
    }

    public bool IsLoggedIn => !string.IsNullOrEmpty(Token);
    public string? Token { get; private set; }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/auth/login", request);
        response.EnsureSuccessStatusCode();

        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>()
            ?? throw new Exception("Erro no login");

        // Salvar token
        Token = loginResponse.Token;
        Preferences.Set(TokenKey, Token);

        return loginResponse;
    }

    public Task LogoutAsync()
    {
        Token = null;
        Preferences.Remove(TokenKey);
        return Task.CompletedTask;
    }
}
