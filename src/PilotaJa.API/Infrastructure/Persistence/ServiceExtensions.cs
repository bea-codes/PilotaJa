using PilotaJa.API.Domain;

namespace PilotaJa.API.Infrastructure.Persistence;

public static class ServiceExtensions
{
    public static IServiceCollection AddMongoDb(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MongoDbSettings>(configuration.GetSection("MongoDB"));
        services.AddSingleton<MongoDbContext>();
        
        // Register repositories
        services.AddScoped<IRepository<Instructor>>(sp =>
        {
            var context = sp.GetRequiredService<MongoDbContext>();
            return new MongoRepository<Instructor>(context.Instructors);
        });
        
        services.AddScoped<IRepository<Student>>(sp =>
        {
            var context = sp.GetRequiredService<MongoDbContext>();
            return new MongoRepository<Student>(context.Students);
        });
        
        services.AddScoped<IRepository<Appointment>>(sp =>
        {
            var context = sp.GetRequiredService<MongoDbContext>();
            return new MongoRepository<Appointment>(context.Appointments);
        });
        
        return services;
    }
}
