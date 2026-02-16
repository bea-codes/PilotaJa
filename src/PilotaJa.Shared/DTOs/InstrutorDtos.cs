namespace PilotaJa.Shared.DTOs;

public class InstrutorResumoDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public decimal PrecoHora { get; set; }
    public double Avaliacao { get; set; }
    public int TotalAulas { get; set; }
    public string? FotoUrl { get; set; }
    public string? Bio { get; set; }
}

public class InstrutorDetalheDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string CategoriaCNH { get; set; } = string.Empty;
    public decimal PrecoHora { get; set; }
    public string? FotoUrl { get; set; }
    public string? Bio { get; set; }
    public double Avaliacao { get; set; }
    public int TotalAulas { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public int RaioAtendimentoKm { get; set; }
    public List<DisponibilidadeDto> Disponibilidades { get; set; } = [];
}

public class DisponibilidadeDto
{
    public DayOfWeek DiaSemana { get; set; }
    public string HoraInicio { get; set; } = string.Empty;
    public string HoraFim { get; set; } = string.Empty;
}

public class ListarInstrutoresRequest
{
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public decimal? PrecoMaximo { get; set; }
    public double? AvaliacaoMinima { get; set; }
    public int Pagina { get; set; } = 1;
    public int PorPagina { get; set; } = 20;
}

public class ListarInstrutoresResponse
{
    public List<InstrutorResumoDto> Instrutores { get; set; } = [];
    public int Total { get; set; }
    public int Pagina { get; set; }
    public int TotalPaginas { get; set; }
}
