using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class AgendamentosPage : ContentPage
{
    public AgendamentosPage(AgendamentosViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is AgendamentosViewModel vm)
        {
            vm.LoadAgendamentosCommand.Execute(null);
        }
    }
}
