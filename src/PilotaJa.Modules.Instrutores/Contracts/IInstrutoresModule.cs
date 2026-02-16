namespace PilotaJa.Modules.Instrutores.Contracts;

/// <summary>
/// Contrato público do módulo Instrutores.
/// Outros módulos usam esta interface para se comunicar.
/// </summary>
public interface IInstrutoresModule
{
    Task<InstrutorInfo?> GetInstrutorAsync(Guid id);
    Task<decimal> GetPrecoHoraAsync(Guid instrutorId);
    Task<bool> VerificarDisponibilidadeAsync(Guid instrutorId, DateTime dataHora, int duracaoMinutos);
    Task AtualizarTotalAulasAsync(Guid instrutorId, int incremento);
    Task AtualizarAvaliacaoAsync(Guid instrutorId, double novaMedia);
}

/// <summary>
/// DTO público para informações do instrutor (sem expor entidade interna)
/// </summary>
public record InstrutorInfo(
    Guid Id,
    string Nome,
    string Telefone,
    string? FotoUrl,
    decimal PrecoHora
);
