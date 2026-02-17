using System.Net.Http.Json;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.Services;

public class AuthService : IAuthService
{
    private readonly HttpClient _httpClient;
    private const string TokenKey = "auth_token";
    private const string RefreshTokenKey = "refresh_token";
    private const string BaseUrl = "http://10.0.2.2:5000";

    public AuthService()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(BaseUrl)
        };
        
        // Load saved token from secure storage
        LoadTokenAsync().ConfigureAwait(false);
    }

    public bool IsLoggedIn => !string.IsNullOrEmpty(Token);
    public string? Token { get; private set; }

    private async Task LoadTokenAsync()
    {
        try
        {
            Token = await SecureStorage.GetAsync(TokenKey);
        }
        catch (Exception)
        {
            // SecureStorage not available (older devices, etc.)
            Token = null;
        }
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/auth/login", request);
        response.EnsureSuccessStatusCode();

        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>()
            ?? throw new Exception("Login failed");

        // Save tokens securely
        await SaveTokensAsync(loginResponse.Token, loginResponse.RefreshToken);

        return loginResponse;
    }

    private async Task SaveTokensAsync(string token, string refreshToken)
    {
        try
        {
            await SecureStorage.SetAsync(TokenKey, token);
            await SecureStorage.SetAsync(RefreshTokenKey, refreshToken);
            Token = token;
        }
        catch (Exception)
        {
            // Fallback to Preferences if SecureStorage fails
            Preferences.Set(TokenKey, token);
            Preferences.Set(RefreshTokenKey, refreshToken);
            Token = token;
        }
    }

    public async Task LogoutAsync()
    {
        Token = null;
        
        try
        {
            SecureStorage.Remove(TokenKey);
            SecureStorage.Remove(RefreshTokenKey);
        }
        catch (Exception)
        {
            Preferences.Remove(TokenKey);
            Preferences.Remove(RefreshTokenKey);
        }
        
        await Task.CompletedTask;
    }
}
