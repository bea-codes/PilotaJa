using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.Services;

public interface IApiService
{
    Task<ListarInstrutoresResponse> GetInstrutoresAsync(ListarInstrutoresRequest? request = null);
    Task<InstrutorDetalheDto> GetInstrutorAsync(Guid id);
    Task<List<AgendamentoDto>> GetAgendamentosAsync();
    Task<CriarAgendamentoResponse> CriarAgendamentoAsync(CriarAgendamentoRequest request);
    Task<AlunoDto> GetPerfilAsync();
}

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync();
    bool IsLoggedIn { get; }
    string? Token { get; }
}
