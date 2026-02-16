using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace PilotaJa.Mobile.ViewModels;

public partial class HomeViewModel : BaseViewModel
{
    public HomeViewModel()
    {
        Title = "PilotaJá";
    }

    [RelayCommand]
    private async Task BuscarInstrutoresAsync()
    {
        // Navega para a tab de Instrutores
        await Shell.Current.GoToAsync("//InstrutoresPage");
    }

    [RelayCommand]
    private async Task VerAgendamentosAsync()
    {
        // Navega para a tab de Agendamentos
        await Shell.Current.GoToAsync("//AgendamentosPage");
    }
}
