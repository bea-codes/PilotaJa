using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

[QueryProperty(nameof(InstrutorId), "id")]
public partial class InstrutorDetalheViewModel : BaseViewModel
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private string _instrutorId = string.Empty;

    [ObservableProperty]
    private InstrutorDetalheDto? _instrutor;

    [ObservableProperty]
    private DateTime _dataSelecionada = DateTime.Today;

    [ObservableProperty]
    private TimeSpan _horaSelecionada = new(9, 0, 0);

    public InstrutorDetalheViewModel(IApiService apiService)
    {
        _apiService = apiService;
    }

    partial void OnInstrutorIdChanged(string value)
    {
        if (Guid.TryParse(value, out _))
        {
            LoadInstrutorCommand.Execute(null);
        }
    }

    [RelayCommand]
    private async Task LoadInstrutorAsync()
    {
        if (!Guid.TryParse(InstrutorId, out var id)) return;

        await ExecuteAsync(async () =>
        {
            Instrutor = await _apiService.GetInstrutorAsync(id);
            Title = Instrutor.Nome;
        }, "Erro ao carregar instrutor");
    }

    [RelayCommand]
    private async Task AgendarAulaAsync()
    {
        if (Instrutor == null) return;

        var dataHora = DataSelecionada.Date + HoraSelecionada;

        await ExecuteAsync(async () =>
        {
            var response = await _apiService.CriarAgendamentoAsync(new CriarAgendamentoRequest
            {
                InstrutorId = Instrutor.Id,
                AlunoId = Guid.NewGuid(), // TODO: Pegar do usuário logado
                DataHora = dataHora,
                DuracaoMinutos = 50
            });

            await Shell.Current.DisplayAlert(
                "Sucesso!", 
                response.Mensagem, 
                "OK");

            await Shell.Current.GoToAsync("..");
        }, "Erro ao agendar aula");
    }
}
