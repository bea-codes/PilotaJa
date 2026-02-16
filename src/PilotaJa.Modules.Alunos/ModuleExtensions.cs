using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PilotaJa.Modules.Alunos.Contracts;
using PilotaJa.Modules.Alunos.Persistence;

namespace PilotaJa.Modules.Alunos;

public static class ModuleExtensions
{
    public static IServiceCollection AddAlunosModule(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AlunosDbContext>(options =>
            options.UseSqlServer(connectionString, sql =>
                sql.MigrationsHistoryTable("__EFMigrationsHistory", AlunosDbContext.Schema)));

        services.AddScoped<IAlunosModule, AlunosModule>();

        return services;
    }
}
