using FastEndpoints;
using PilotaJa.API.Domain;

namespace PilotaJa.API.Features.Instructors;

public class ListInstructorsRequest
{
    public string? City { get; set; }
    public string? State { get; set; }
    public decimal? MaxPrice { get; set; }
    public double? MinRating { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class ListInstructorsResponse
{
    public List<InstructorSummaryDto> Instructors { get; set; } = [];
    public int Total { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
}

public class InstructorSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public double Rating { get; set; }
    public int TotalLessons { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
}

public class ListInstructorsEndpoint : Endpoint<ListInstructorsRequest, ListInstructorsResponse>
{
    public override void Configure()
    {
        Get("/api/instructors");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "List available instructors";
            s.Description = "Returns a paginated list of instructors with optional filters";
        });
    }

    public override async Task HandleAsync(ListInstructorsRequest req, CancellationToken ct)
    {
        // TODO: Implement database query
        // For now, return mock data
        
        var instructors = new List<InstructorSummaryDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "João Silva",
                City = "São Paulo",
                State = "SP",
                HourlyRate = 80.00m,
                Rating = 4.8,
                TotalLessons = 150,
                Bio = "10 years of experience, specialist with nervous students"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Maria Santos",
                City = "São Paulo",
                State = "SP",
                HourlyRate = 90.00m,
                Rating = 4.9,
                TotalLessons = 230,
                Bio = "Certified instructor, adapted car available"
            }
        };

        await SendAsync(new ListInstructorsResponse
        {
            Instructors = instructors,
            Total = instructors.Count,
            Page = req.Page,
            TotalPages = 1
        }, cancellation: ct);
    }
}
