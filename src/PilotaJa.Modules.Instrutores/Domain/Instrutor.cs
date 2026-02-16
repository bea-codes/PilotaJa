namespace PilotaJa.Modules.Instrutores.Domain;

public class Instrutor
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string CNH { get; set; } = string.Empty;
    public string CategoriaCNH { get; set; } = string.Empty;
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
    
    // Navegação interna do módulo
    public ICollection<Disponibilidade> Disponibilidades { get; set; } = [];
}

public class Disponibilidade
{
    public Guid Id { get; set; }
    public Guid InstrutorId { get; set; }
    public DayOfWeek DiaSemana { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    
    // Navegação interna
    public Instrutor Instrutor { get; set; } = null!;
}
