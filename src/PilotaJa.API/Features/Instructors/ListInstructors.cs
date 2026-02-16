using FastEndpoints;
using PilotaJa.API.Domain;
using PilotaJa.API.Infrastructure.Persistence;

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
    private readonly IRepository<Instructor> _repository;

    public ListInstructorsEndpoint(IRepository<Instructor> repository)
    {
        _repository = repository;
    }

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
        var instructors = await _repository.FindAsync(i => 
            i.IsActive &&
            (string.IsNullOrEmpty(req.City) || i.City.ToLower().Contains(req.City.ToLower())) &&
            (string.IsNullOrEmpty(req.State) || i.State.ToLower() == req.State.ToLower()) &&
            (!req.MaxPrice.HasValue || i.HourlyRate <= req.MaxPrice.Value) &&
            (!req.MinRating.HasValue || i.Rating >= req.MinRating.Value)
        );

        var total = instructors.Count();
        var paged = instructors
            .Skip((req.Page - 1) * req.PageSize)
            .Take(req.PageSize)
            .Select(i => new InstructorSummaryDto
            {
                Id = i.Id,
                Name = i.Name,
                City = i.City,
                State = i.State,
                HourlyRate = i.HourlyRate,
                Rating = i.Rating,
                TotalLessons = i.TotalLessons,
                PhotoUrl = i.PhotoUrl,
                Bio = i.Bio
            })
            .ToList();

        await SendAsync(new ListInstructorsResponse
        {
            Instructors = paged,
            Total = total,
            Page = req.Page,
            TotalPages = (int)Math.Ceiling(total / (double)req.PageSize)
        }, cancellation: ct);
    }
}
