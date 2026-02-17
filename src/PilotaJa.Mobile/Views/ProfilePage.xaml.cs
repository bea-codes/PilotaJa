using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class ProfilePage : ContentPage
{
    public ProfilePage(ProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
