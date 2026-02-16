using PilotaJa.Mobile.ViewModels;

namespace PilotaJa.Mobile.Views;

public partial class InstrutorDetalhePage : ContentPage
{
    public InstrutorDetalhePage(InstrutorDetalheViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
