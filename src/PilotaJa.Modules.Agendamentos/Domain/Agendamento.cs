namespace PilotaJa.Modules.Agendamentos.Domain;

public class Agendamento
{
    public Guid Id { get; set; }
    
    // Apenas IDs - sem navegação para entidades de outros módulos!
    public Guid InstrutorId { get; set; }
    public Guid AlunoId { get; set; }
    
    public DateTime DataHora { get; set; }
    public int DuracaoMinutos { get; set; } = 50;
    public StatusAgendamento Status { get; set; } = StatusAgendamento.Pendente;
    public decimal Valor { get; set; }
    public string? Observacoes { get; set; }
    public string? EnderecoEncontro { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmadoEm { get; set; }
    public DateTime? ConcluidoEm { get; set; }
    public DateTime? CanceladoEm { get; set; }
    public string? MotivoCancelamento { get; set; }
    
    // Avaliação
    public int? AvaliacaoNota { get; set; }
    public string? AvaliacaoComentario { get; set; }
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
