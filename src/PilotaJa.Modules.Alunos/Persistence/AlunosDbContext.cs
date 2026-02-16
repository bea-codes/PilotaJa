using Microsoft.EntityFrameworkCore;
using PilotaJa.Modules.Alunos.Domain;

namespace PilotaJa.Modules.Alunos.Persistence;

public class AlunosDbContext : DbContext
{
    public const string Schema = "alunos";
    
    public AlunosDbContext(DbContextOptions<AlunosDbContext> options) 
        : base(options) { }

    public DbSet<Aluno> Alunos => Set<Aluno>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);

        modelBuilder.Entity<Aluno>(entity =>
        {
            entity.ToTable("Alunos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Telefone).HasMaxLength(20);
            entity.Property(e => e.CPF).HasMaxLength(14);
        });
    }
}
