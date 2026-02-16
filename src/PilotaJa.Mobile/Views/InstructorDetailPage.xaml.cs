using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class InstructorDetailPage : ContentPage
{
    public InstructorDetailPage(InstructorDetailViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
