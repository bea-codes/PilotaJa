using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class AppointmentsPage : ContentPage
{
    public AppointmentsPage(AppointmentsViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is AppointmentsViewModel vm)
        {
            vm.LoadAppointmentsCommand.Execute(null);
        }
    }
}
