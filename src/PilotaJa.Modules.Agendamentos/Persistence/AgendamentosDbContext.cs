using Microsoft.EntityFrameworkCore;
using PilotaJa.Modules.Agendamentos.Domain;

namespace PilotaJa.Modules.Agendamentos.Persistence;

public class AgendamentosDbContext : DbContext
{
    public const string Schema = "agendamentos";
    
    public AgendamentosDbContext(DbContextOptions<AgendamentosDbContext> options) 
        : base(options) { }

    public DbSet<Agendamento> Agendamentos => Set<Agendamento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);

        modelBuilder.Entity<Agendamento>(entity =>
        {
            entity.ToTable("Agendamentos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Valor).HasPrecision(10, 2);
            entity.Property(e => e.EnderecoEncontro).HasMaxLength(500);
            entity.Property(e => e.MotivoCancelamento).HasMaxLength(500);
            entity.Property(e => e.AvaliacaoComentario).HasMaxLength(1000);
            
            // Índices para busca
            entity.HasIndex(e => e.InstrutorId);
            entity.HasIndex(e => e.AlunoId);
            entity.HasIndex(e => e.DataHora);
            entity.HasIndex(e => e.Status);
        });
    }
}
