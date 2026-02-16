using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Views;

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
        await Shell.Current.GoToAsync(nameof(InstrutoresPage));
    }

    [RelayCommand]
    private async Task VerAgendamentosAsync()
    {
        await Shell.Current.GoToAsync(nameof(AgendamentosPage));
    }
}
