using FastEndpoints;
using PilotaJa.API.Domain;

namespace PilotaJa.API.Features.Instrutores;

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

public class ListarInstrutoresEndpoint : Endpoint<ListarInstrutoresRequest, ListarInstrutoresResponse>
{
    public override void Configure()
    {
        Get("/api/instrutores");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "Lista instrutores disponíveis";
            s.Description = "Retorna lista de instrutores com filtros opcionais por localização, preço e avaliação";
        });
    }

    public override async Task HandleAsync(ListarInstrutoresRequest req, CancellationToken ct)
    {
        // TODO: Implementar busca no banco
        // Por enquanto retorna dados mockados
        
        var instrutores = new List<InstrutorResumoDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Nome = "João Silva",
                Cidade = "São Paulo",
                Estado = "SP",
                PrecoHora = 80.00m,
                Avaliacao = 4.8,
                TotalAulas = 150,
                Bio = "10 anos de experiência, especialista em alunos nervosos"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Nome = "Maria Santos",
                Cidade = "São Paulo",
                Estado = "SP",
                PrecoHora = 90.00m,
                Avaliacao = 4.9,
                TotalAulas = 230,
                Bio = "Instrutora certificada, carro adaptado disponível"
            }
        };

        await SendAsync(new ListarInstrutoresResponse
        {
            Instrutores = instrutores,
            Total = instrutores.Count,
            Pagina = req.Pagina,
            TotalPaginas = 1
        }, cancellation: ct);
    }
}
