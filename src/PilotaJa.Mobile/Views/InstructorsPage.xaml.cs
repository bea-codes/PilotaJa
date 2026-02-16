using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class InstructorsPage : ContentPage
{
    public InstructorsPage(InstructorsViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is InstructorsViewModel vm)
        {
            vm.LoadInstructorsCommand.Execute(null);
        }
    }
}
