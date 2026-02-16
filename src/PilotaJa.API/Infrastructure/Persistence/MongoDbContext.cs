using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PilotaJa.API.Domain;

namespace PilotaJa.API.Infrastructure.Persistence;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<Instructor> Instructors => _database.GetCollection<Instructor>("instructors");
    public IMongoCollection<Student> Students => _database.GetCollection<Student>("students");
    public IMongoCollection<Appointment> Appointments => _database.GetCollection<Appointment>("appointments");
}
