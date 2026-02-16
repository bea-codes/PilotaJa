using FastEndpoints;
using PilotaJa.API.Domain;
using PilotaJa.API.Infrastructure.Persistence;

namespace PilotaJa.API.Features.Admin;

public class SeedDataEndpoint : EndpointWithoutRequest
{
    private readonly IRepository<Instructor> _instructorRepo;
    private readonly IRepository<Student> _studentRepo;

    public SeedDataEndpoint(
        IRepository<Instructor> instructorRepo,
        IRepository<Student> studentRepo)
    {
        _instructorRepo = instructorRepo;
        _studentRepo = studentRepo;
    }

    public override void Configure()
    {
        Post("/api/admin/seed");
        AllowAnonymous(); // TODO: Secure in production
        Summary(s =>
        {
            s.Summary = "Seed database with sample data";
            s.Description = "Creates sample instructors and students for testing";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        // Check if already seeded
        var existing = await _instructorRepo.CountAsync();
        if (existing > 0)
        {
            await SendAsync(new { Message = "Database already seeded", InstructorCount = existing }, cancellation: ct);
            return;
        }

        // Sample instructors
        var instructors = new List<Instructor>
        {
            new()
            {
                Name = "João Silva",
                Email = "joao.silva@email.com",
                Phone = "(11) 99999-1111",
                LicenseCategory = "AB",
                HourlyRate = 80.00m,
                Bio = "10 anos de experiência, especialista em alunos nervosos. Paciência é minha maior qualidade!",
                Rating = 4.8,
                TotalLessons = 150,
                City = "São Paulo",
                State = "SP",
                ServiceRadiusKm = 15,
                Availabilities =
                [
                    new() { DayOfWeek = DayOfWeek.Monday, StartTime = "08:00", EndTime = "18:00" },
                    new() { DayOfWeek = DayOfWeek.Tuesday, StartTime = "08:00", EndTime = "18:00" },
                    new() { DayOfWeek = DayOfWeek.Wednesday, StartTime = "08:00", EndTime = "18:00" },
                    new() { DayOfWeek = DayOfWeek.Thursday, StartTime = "08:00", EndTime = "18:00" },
                    new() { DayOfWeek = DayOfWeek.Friday, StartTime = "08:00", EndTime = "18:00" },
                    new() { DayOfWeek = DayOfWeek.Saturday, StartTime = "08:00", EndTime = "12:00" }
                ]
            },
            new()
            {
                Name = "Maria Santos",
                Email = "maria.santos@email.com",
                Phone = "(11) 99999-2222",
                LicenseCategory = "AB",
                HourlyRate = 90.00m,
                Bio = "Instrutora certificada com carro adaptado disponível. Especialista em pessoas com deficiência.",
                Rating = 4.9,
                TotalLessons = 230,
                City = "São Paulo",
                State = "SP",
                ServiceRadiusKm = 20,
                Availabilities =
                [
                    new() { DayOfWeek = DayOfWeek.Monday, StartTime = "07:00", EndTime = "19:00" },
                    new() { DayOfWeek = DayOfWeek.Tuesday, StartTime = "07:00", EndTime = "19:00" },
                    new() { DayOfWeek = DayOfWeek.Wednesday, StartTime = "07:00", EndTime = "19:00" },
                    new() { DayOfWeek = DayOfWeek.Thursday, StartTime = "07:00", EndTime = "19:00" },
                    new() { DayOfWeek = DayOfWeek.Friday, StartTime = "07:00", EndTime = "19:00" }
                ]
            },
            new()
            {
                Name = "Carlos Oliveira",
                Email = "carlos.oliveira@email.com",
                Phone = "(11) 99999-3333",
                LicenseCategory = "B",
                HourlyRate = 70.00m,
                Bio = "Instrutor jovem e dinâmico. Aulas descontraídas sem perder a seriedade.",
                Rating = 4.5,
                TotalLessons = 80,
                City = "Guarulhos",
                State = "SP",
                ServiceRadiusKm = 10,
                Availabilities =
                [
                    new() { DayOfWeek = DayOfWeek.Monday, StartTime = "14:00", EndTime = "20:00" },
                    new() { DayOfWeek = DayOfWeek.Tuesday, StartTime = "14:00", EndTime = "20:00" },
                    new() { DayOfWeek = DayOfWeek.Wednesday, StartTime = "14:00", EndTime = "20:00" },
                    new() { DayOfWeek = DayOfWeek.Thursday, StartTime = "14:00", EndTime = "20:00" },
                    new() { DayOfWeek = DayOfWeek.Friday, StartTime = "14:00", EndTime = "20:00" },
                    new() { DayOfWeek = DayOfWeek.Saturday, StartTime = "09:00", EndTime = "17:00" },
                    new() { DayOfWeek = DayOfWeek.Sunday, StartTime = "09:00", EndTime = "14:00" }
                ]
            }
        };

        foreach (var instructor in instructors)
        {
            await _instructorRepo.CreateAsync(instructor);
        }

        // Sample student
        var student = new Student
        {
            Name = "Ana Costa",
            Email = "ana.costa@email.com",
            Phone = "(11) 98888-1111",
            TaxId = "123.456.789-00",
            DateOfBirth = new DateTime(1995, 5, 15)
        };
        await _studentRepo.CreateAsync(student);

        await SendAsync(new 
        { 
            Message = "Database seeded successfully",
            InstructorsCreated = instructors.Count,
            StudentsCreated = 1
        }, cancellation: ct);
    }
}
