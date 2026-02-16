using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class InstrutoresPage : ContentPage
{
    public InstrutoresPage(InstrutoresViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is InstrutoresViewModel vm)
        {
            vm.LoadInstrutoresCommand.Execute(null);
        }
    }
}
