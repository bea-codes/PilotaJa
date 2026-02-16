using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

public partial class AgendamentosViewModel : BaseViewModel
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private ObservableCollection<AgendamentoDto> _agendamentos = [];

    [ObservableProperty]
    private bool _isRefreshing;

    public AgendamentosViewModel(IApiService apiService)
    {
        _apiService = apiService;
        Title = "Meus Agendamentos";
    }

    [RelayCommand]
    private async Task LoadAgendamentosAsync()
    {
        await ExecuteAsync(async () =>
        {
            var lista = await _apiService.GetAgendamentosAsync();

            Agendamentos.Clear();
            foreach (var agendamento in lista.OrderByDescending(a => a.DataHora))
            {
                Agendamentos.Add(agendamento);
            }
        }, "Erro ao carregar agendamentos");

        IsRefreshing = false;
    }
}
