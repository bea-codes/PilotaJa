using CommunityToolkit.Maui;
using PilotaJa.Mobile.Services;
using PilotaJa.Mobile.ViewModels;
using PilotaJa.Mobile.Views;

namespace PilotaJa.Mobile;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Services
        builder.Services.AddSingleton<IApiService, ApiService>();
        builder.Services.AddSingleton<IAuthService, AuthService>();

        // ViewModels
        builder.Services.AddTransient<HomeViewModel>();
        builder.Services.AddTransient<InstructorsViewModel>();
        builder.Services.AddTransient<InstructorDetailViewModel>();
        builder.Services.AddTransient<AppointmentsViewModel>();
        builder.Services.AddTransient<ProfileViewModel>();

        // Views
        builder.Services.AddTransient<HomePage>();
        builder.Services.AddTransient<InstructorsPage>();
        builder.Services.AddTransient<InstructorDetailPage>();
        builder.Services.AddTransient<AppointmentsPage>();
        builder.Services.AddTransient<ProfilePage>();

        return builder.Build();
    }
}
