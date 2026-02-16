using Microsoft.EntityFrameworkCore;
using PilotaJa.Modules.Instrutores.Domain;

namespace PilotaJa.Modules.Instrutores.Persistence;

public class InstrutoresDbContext : DbContext
{
    public const string Schema = "instrutores";
    
    public InstrutoresDbContext(DbContextOptions<InstrutoresDbContext> options) 
        : base(options) { }

    public DbSet<Instrutor> Instrutores => Set<Instrutor>();
    public DbSet<Disponibilidade> Disponibilidades => Set<Disponibilidade>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);

        modelBuilder.Entity<Instrutor>(entity =>
        {
            entity.ToTable("Instrutores");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Telefone).HasMaxLength(20);
            entity.Property(e => e.CNH).HasMaxLength(20);
            entity.Property(e => e.CategoriaCNH).HasMaxLength(5);
            entity.Property(e => e.PrecoHora).HasPrecision(10, 2);
            entity.Property(e => e.Cidade).HasMaxLength(100);
            entity.Property(e => e.Estado).HasMaxLength(2);
            
            entity.HasMany(e => e.Disponibilidades)
                  .WithOne(e => e.Instrutor)
                  .HasForeignKey(e => e.InstrutorId);
        });

        modelBuilder.Entity<Disponibilidade>(entity =>
        {
            entity.ToTable("Disponibilidades");
            entity.HasKey(e => e.Id);
        });
    }
}
