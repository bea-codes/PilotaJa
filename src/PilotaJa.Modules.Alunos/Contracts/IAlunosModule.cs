namespace PilotaJa.Modules.Alunos.Contracts;

/// <summary>
/// Contrato público do módulo Alunos.
/// </summary>
public interface IAlunosModule
{
    Task<AlunoInfo?> GetAlunoAsync(Guid id);
    Task<bool> ExisteAsync(Guid id);
}

/// <summary>
/// DTO público para informações do aluno
/// </summary>
public record AlunoInfo(
    Guid Id,
    string Nome,
    string Email,
    string Telefone
);
