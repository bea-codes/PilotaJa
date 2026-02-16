using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

public partial class AppointmentsViewModel : BaseViewModel
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private ObservableCollection<AppointmentDto> _appointments = [];

    [ObservableProperty]
    private bool _isRefreshing;

    public AppointmentsViewModel(IApiService apiService)
    {
        _apiService = apiService;
        Title = "Meus Agendamentos";
    }

    [RelayCommand]
    private async Task LoadAppointmentsAsync()
    {
        await ExecuteAsync(async () =>
        {
            var list = await _apiService.GetAppointmentsAsync();

            Appointments.Clear();
            foreach (var appointment in list.OrderByDescending(a => a.DateTime))
            {
                Appointments.Add(appointment);
            }
        }, "Erro ao carregar agendamentos");

        IsRefreshing = false;
    }
}
