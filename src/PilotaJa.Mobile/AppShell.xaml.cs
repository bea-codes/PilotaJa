using PilotaJa.Mobile.Views;

namespace PilotaJa.Mobile;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        
        // Register routes for navigation
        Routing.RegisterRoute(nameof(InstructorsPage), typeof(InstructorsPage));
        Routing.RegisterRoute(nameof(InstructorDetailPage), typeof(InstructorDetailPage));
        Routing.RegisterRoute(nameof(AppointmentsPage), typeof(AppointmentsPage));
        Routing.RegisterRoute(nameof(ProfilePage), typeof(ProfilePage));
    }
}
