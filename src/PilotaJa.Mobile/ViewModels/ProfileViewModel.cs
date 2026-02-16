using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

public partial class ProfileViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly IAuthService _authService;

    [ObservableProperty]
    private StudentDto? _profile;

    [ObservableProperty]
    private bool _isLoggedIn;

    public ProfileViewModel(IApiService apiService, IAuthService authService)
    {
        _apiService = apiService;
        _authService = authService;
        Title = "Meu Perfil";
        IsLoggedIn = _authService.IsLoggedIn;
    }

    [RelayCommand]
    private async Task LoadProfileAsync()
    {
        if (!_authService.IsLoggedIn)
        {
            IsLoggedIn = false;
            return;
        }

        await ExecuteAsync(async () =>
        {
            Profile = await _apiService.GetProfileAsync();
            IsLoggedIn = true;
        }, "Erro ao carregar perfil");
    }

    [RelayCommand]
    private async Task LogoutAsync()
    {
        await _authService.LogoutAsync();
        IsLoggedIn = false;
        Profile = null;
    }
}
