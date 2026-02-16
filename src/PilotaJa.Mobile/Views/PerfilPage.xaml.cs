using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class PerfilPage : ContentPage
{
    public PerfilPage(PerfilViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is PerfilViewModel vm)
        {
            vm.LoadPerfilCommand.Execute(null);
        }
    }
}
