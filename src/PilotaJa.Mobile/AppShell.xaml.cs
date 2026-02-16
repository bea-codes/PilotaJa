using PilotaJa.Mobile.Views;

namespace PilotaJa.Mobile;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        
        // Registrar rotas para navegação
        Routing.RegisterRoute(nameof(InstrutorDetalhePage), typeof(InstrutorDetalhePage));
    }
}
