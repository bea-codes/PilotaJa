using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PilotaJa.Modules.Agendamentos.Contracts;
using PilotaJa.Modules.Agendamentos.Persistence;

namespace PilotaJa.Modules.Agendamentos;

public static class ModuleExtensions
{
    public static IServiceCollection AddAgendamentosModule(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AgendamentosDbContext>(options =>
            options.UseSqlServer(connectionString, sql =>
                sql.MigrationsHistoryTable("__EFMigrationsHistory", AgendamentosDbContext.Schema)));

        services.AddScoped<IAgendamentosModule, AgendamentosModule>();

        return services;
    }
}
