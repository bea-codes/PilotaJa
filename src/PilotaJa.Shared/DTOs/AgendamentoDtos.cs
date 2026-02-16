namespace PilotaJa.Shared.DTOs;

public class CriarAgendamentoRequest
{
    public Guid InstrutorId { get; set; }
    public Guid AlunoId { get; set; }
    public DateTime DataHora { get; set; }
    public int DuracaoMinutos { get; set; } = 50;
    public string? Observacoes { get; set; }
    public string? EnderecoEncontro { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

public class AgendamentoDto
{
    public Guid Id { get; set; }
    public Guid InstrutorId { get; set; }
    public string InstrutorNome { get; set; } = string.Empty;
    public string? InstrutorFotoUrl { get; set; }
    public Guid AlunoId { get; set; }
    public string AlunoNome { get; set; } = string.Empty;
    public DateTime DataHora { get; set; }
    public int DuracaoMinutos { get; set; }
    public StatusAgendamento Status { get; set; }
    public decimal Valor { get; set; }
    public string? Observacoes { get; set; }
    public string? EnderecoEncontro { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CriadoEm { get; set; }
}

public class CriarAgendamentoResponse
{
    public Guid Id { get; set; }
    public StatusAgendamento Status { get; set; }
    public decimal Valor { get; set; }
    public string Mensagem { get; set; } = string.Empty;
}

public enum StatusAgendamento
{
    Pendente,
    Confirmado,
    EmAndamento,
    Concluido,
    Cancelado,
    NaoCompareceu
}
