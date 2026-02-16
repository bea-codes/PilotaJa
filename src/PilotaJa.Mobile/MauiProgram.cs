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
        builder.Services.AddTransient<InstrutoresViewModel>();
        builder.Services.AddTransient<InstrutorDetalheViewModel>();
        builder.Services.AddTransient<AgendamentosViewModel>();
        builder.Services.AddTransient<PerfilViewModel>();

        // Views
        builder.Services.AddTransient<HomePage>();
        builder.Services.AddTransient<InstrutoresPage>();
        builder.Services.AddTransient<InstrutorDetalhePage>();
        builder.Services.AddTransient<AgendamentosPage>();
        builder.Services.AddTransient<PerfilPage>();

        return builder.Build();
    }
}
