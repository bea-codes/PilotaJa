using PilotaJa.Mobile.Views;

namespace PilotaJa.Mobile;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        
        // Registrar rotas para navegação
        Routing.RegisterRoute(nameof(InstrutoresPage), typeof(InstrutoresPage));
        Routing.RegisterRoute(nameof(InstrutorDetalhePage), typeof(InstrutorDetalhePage));
        Routing.RegisterRoute(nameof(AgendamentosPage), typeof(AgendamentosPage));
        Routing.RegisterRoute(nameof(PerfilPage), typeof(PerfilPage));
    }
}
