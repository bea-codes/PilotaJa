using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Mobile.Views;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

public partial class InstrutoresViewModel : BaseViewModel
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private ObservableCollection<InstrutorResumoDto> _instrutores = [];

    [ObservableProperty]
    private string _searchText = string.Empty;

    [ObservableProperty]
    private bool _isRefreshing;

    public InstrutoresViewModel(IApiService apiService)
    {
        _apiService = apiService;
        Title = "Instrutores";
    }

    [RelayCommand]
    private async Task LoadInstrutoresAsync()
    {
        await ExecuteAsync(async () =>
        {
            var response = await _apiService.GetInstrutoresAsync(new ListarInstrutoresRequest
            {
                Cidade = string.IsNullOrWhiteSpace(SearchText) ? null : SearchText
            });

            Instrutores.Clear();
            foreach (var instrutor in response.Instrutores)
            {
                Instrutores.Add(instrutor);
            }
        }, "Erro ao carregar instrutores");

        IsRefreshing = false;
    }

    [RelayCommand]
    private async Task SearchAsync()
    {
        await LoadInstrutoresAsync();
    }

    [RelayCommand]
    private async Task SelectInstrutorAsync(InstrutorResumoDto instrutor)
    {
        if (instrutor == null) return;

        await Shell.Current.GoToAsync($"{nameof(InstrutorDetalhePage)}?id={instrutor.Id}");
    }
}
