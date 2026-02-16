namespace PilotaJa.API.Domain;

public class Instrutor
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string CNH { get; set; } = string.Empty;
    public string CategoriaCNH { get; set; } = string.Empty; // A, B, AB, etc.
    public decimal PrecoHora { get; set; }
    public string? FotoUrl { get; set; }
    public string? Bio { get; set; }
    public double Avaliacao { get; set; }
    public int TotalAulas { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    
    // Localização
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int RaioAtendimentoKm { get; set; } = 10;
    
    // Navegação
    public ICollection<Disponibilidade> Disponibilidades { get; set; } = [];
    public ICollection<Agendamento> Agendamentos { get; set; } = [];
}

public class Aluno
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string? CPF { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? FotoUrl { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    
    // Navegação
    public ICollection<Agendamento> Agendamentos { get; set; } = [];
}

public class Disponibilidade
{
    public Guid Id { get; set; }
    public Guid InstrutorId { get; set; }
    public DayOfWeek DiaSemana { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    
    // Navegação
    public Instrutor Instrutor { get; set; } = null!;
}

public class Agendamento
{
    public Guid Id { get; set; }
    public Guid InstrutorId { get; set; }
    public Guid AlunoId { get; set; }
    public DateTime DataHora { get; set; }
    public int DuracaoMinutos { get; set; } = 50; // Aula padrão de 50 min
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
    public int? AvaliacaoNota { get; set; } // 1-5
    public string? AvaliacaoComentario { get; set; }
    
    // Navegação
    public Instrutor Instrutor { get; set; } = null!;
    public Aluno Aluno { get; set; } = null!;
}

public enum StatusAgendamento
{
    Pendente,      // Aguardando confirmação do instrutor
    Confirmado,    // Instrutor confirmou
    EmAndamento,   // Aula iniciada
    Concluido,     // Aula finalizada
    Cancelado,     // Cancelado por aluno ou instrutor
    NaoCompareceu  // No-show
}
