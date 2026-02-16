using FastEndpoints;
using PilotaJa.API.Domain;

namespace PilotaJa.API.Features.Agendamentos;

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

public class CriarAgendamentoResponse
{
    public Guid Id { get; set; }
    public StatusAgendamento Status { get; set; }
    public decimal Valor { get; set; }
    public string Mensagem { get; set; } = string.Empty;
}

public class CriarAgendamentoEndpoint : Endpoint<CriarAgendamentoRequest, CriarAgendamentoResponse>
{
    public override void Configure()
    {
        Post("/api/agendamentos");
        AllowAnonymous(); // TODO: Trocar para autenticação
        Summary(s =>
        {
            s.Summary = "Cria um novo agendamento";
            s.Description = "Solicita agendamento de aula com um instrutor. O instrutor precisa confirmar.";
        });
    }

    public override async Task HandleAsync(CriarAgendamentoRequest req, CancellationToken ct)
    {
        // TODO: Validar disponibilidade do instrutor
        // TODO: Calcular valor baseado no preço/hora do instrutor
        // TODO: Persistir no banco
        // TODO: Notificar instrutor
        
        var agendamento = new CriarAgendamentoResponse
        {
            Id = Guid.NewGuid(),
            Status = StatusAgendamento.Pendente,
            Valor = 80.00m, // TODO: Buscar do instrutor
            Mensagem = "Agendamento criado! Aguardando confirmação do instrutor."
        };

        await SendCreatedAtAsync<BuscarAgendamentoEndpoint>(
            new { Id = agendamento.Id },
            agendamento,
            cancellation: ct);
    }
}

public class BuscarAgendamentoEndpoint : EndpointWithoutRequest<Agendamento>
{
    public override void Configure()
    {
        Get("/api/agendamentos/{Id}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<Guid>("Id");
        
        // TODO: Buscar no banco
        await SendAsync(new Agendamento { Id = id }, cancellation: ct);
    }
}
