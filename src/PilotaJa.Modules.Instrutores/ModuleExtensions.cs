using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PilotaJa.Modules.Instrutores.Contracts;
using PilotaJa.Modules.Instrutores.Persistence;

namespace PilotaJa.Modules.Instrutores;

public static class ModuleExtensions
{
    public static IServiceCollection AddInstrutoresModule(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<InstrutoresDbContext>(options =>
            options.UseSqlServer(connectionString, sql =>
                sql.MigrationsHistoryTable("__EFMigrationsHistory", InstrutoresDbContext.Schema)));

        services.AddScoped<IInstrutoresModule, InstrutoresModule>();

        return services;
    }
}
