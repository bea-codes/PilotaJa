using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

public partial class PerfilViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly IAuthService _authService;

    [ObservableProperty]
    private AlunoDto? _perfil;

    [ObservableProperty]
    private bool _isLoggedIn;

    public PerfilViewModel(IApiService apiService, IAuthService authService)
    {
        _apiService = apiService;
        _authService = authService;
        Title = "Meu Perfil";
        IsLoggedIn = _authService.IsLoggedIn;
    }

    [RelayCommand]
    private async Task LoadPerfilAsync()
    {
        if (!_authService.IsLoggedIn)
        {
            IsLoggedIn = false;
            return;
        }

        await ExecuteAsync(async () =>
        {
            Perfil = await _apiService.GetPerfilAsync();
            IsLoggedIn = true;
        }, "Erro ao carregar perfil");
    }

    [RelayCommand]
    private async Task LogoutAsync()
    {
        await _authService.LogoutAsync();
        IsLoggedIn = false;
        Perfil = null;
    }
}
