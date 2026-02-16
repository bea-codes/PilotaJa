using PilotaJa.Modules.Agendamentos.Domain;

namespace PilotaJa.Modules.Agendamentos.Contracts;

/// <summary>
/// Contrato público do módulo Agendamentos.
/// </summary>
public interface IAgendamentosModule
{
    Task<AgendamentoInfo?> GetAsync(Guid id);
    Task<IEnumerable<AgendamentoInfo>> ListarPorAlunoAsync(Guid alunoId);
    Task<IEnumerable<AgendamentoInfo>> ListarPorInstrutorAsync(Guid instrutorId);
    Task<Guid> CriarAsync(CriarAgendamentoCommand command);
    Task ConfirmarAsync(Guid id);
    Task CancelarAsync(Guid id, string motivo);
    Task ConcluirAsync(Guid id);
    Task AvaliarAsync(Guid id, int nota, string? comentario);
}

public record CriarAgendamentoCommand(
    Guid InstrutorId,
    Guid AlunoId,
    DateTime DataHora,
    int DuracaoMinutos,
    string? Observacoes,
    string? EnderecoEncontro,
    double? Latitude,
    double? Longitude
);

public record AgendamentoInfo(
    Guid Id,
    Guid InstrutorId,
    Guid AlunoId,
    DateTime DataHora,
    int DuracaoMinutos,
    StatusAgendamento Status,
    decimal Valor
);
