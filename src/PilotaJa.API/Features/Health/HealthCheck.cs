using FastEndpoints;

namespace PilotaJa.API.Features.Health;

public class HealthCheckEndpoint : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("/health");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await SendAsync(new 
        { 
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Version = "1.0.0"
        }, cancellation: ct);
    }
}
