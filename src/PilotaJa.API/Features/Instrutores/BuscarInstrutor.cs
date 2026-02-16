using FastEndpoints;
using PilotaJa.API.Domain;

namespace PilotaJa.API.Features.Instrutores;

public class BuscarInstrutorRequest
{
    public Guid Id { get; set; }
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

public class BuscarInstrutorEndpoint : Endpoint<BuscarInstrutorRequest, InstrutorDetalheDto>
{
    public override void Configure()
    {
        Get("/api/instrutores/{Id}");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "Busca instrutor por ID";
            s.Description = "Retorna detalhes completos do instrutor incluindo disponibilidades";
        });
    }

    public override async Task HandleAsync(BuscarInstrutorRequest req, CancellationToken ct)
    {
        // TODO: Buscar no banco
        
        var instrutor = new InstrutorDetalheDto
        {
            Id = req.Id,
            Nome = "João Silva",
            Email = "joao@email.com",
            Telefone = "(11) 99999-9999",
            CategoriaCNH = "AB",
            PrecoHora = 80.00m,
            Bio = "10 anos de experiência, especialista em alunos nervosos",
            Avaliacao = 4.8,
            TotalAulas = 150,
            Cidade = "São Paulo",
            Estado = "SP",
            RaioAtendimentoKm = 15,
            Disponibilidades =
            [
                new() { DiaSemana = DayOfWeek.Monday, HoraInicio = "08:00", HoraFim = "18:00" },
                new() { DiaSemana = DayOfWeek.Tuesday, HoraInicio = "08:00", HoraFim = "18:00" },
                new() { DiaSemana = DayOfWeek.Wednesday, HoraInicio = "08:00", HoraFim = "18:00" },
                new() { DiaSemana = DayOfWeek.Thursday, HoraInicio = "08:00", HoraFim = "18:00" },
                new() { DiaSemana = DayOfWeek.Friday, HoraInicio = "08:00", HoraFim = "18:00" },
                new() { DiaSemana = DayOfWeek.Saturday, HoraInicio = "08:00", HoraFim = "12:00" },
            ]
        };

        await SendAsync(instrutor, cancellation: ct);
    }
}
