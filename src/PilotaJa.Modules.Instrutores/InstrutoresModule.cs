using Microsoft.EntityFrameworkCore;
using PilotaJa.Modules.Instrutores.Contracts;
using PilotaJa.Modules.Instrutores.Persistence;

namespace PilotaJa.Modules.Instrutores;

public class InstrutoresModule : IInstrutoresModule
{
    private readonly InstrutoresDbContext _context;

    public InstrutoresModule(InstrutoresDbContext context)
    {
        _context = context;
    }

    public async Task<InstrutorInfo?> GetInstrutorAsync(Guid id)
    {
        var instrutor = await _context.Instrutores
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);

        if (instrutor == null) return null;

        return new InstrutorInfo(
            instrutor.Id,
            instrutor.Nome,
            instrutor.Telefone,
            instrutor.FotoUrl,
            instrutor.PrecoHora
        );
    }

    public async Task<decimal> GetPrecoHoraAsync(Guid instrutorId)
    {
        var instrutor = await _context.Instrutores
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == instrutorId);

        return instrutor?.PrecoHora ?? 0;
    }

    public async Task<bool> VerificarDisponibilidadeAsync(Guid instrutorId, DateTime dataHora, int duracaoMinutos)
    {
        var diaSemana = dataHora.DayOfWeek;
        var hora = TimeOnly.FromDateTime(dataHora);

        var disponibilidade = await _context.Disponibilidades
            .AsNoTracking()
            .FirstOrDefaultAsync(d => 
                d.InstrutorId == instrutorId &&
                d.DiaSemana == diaSemana &&
                d.HoraInicio <= hora &&
                d.HoraFim >= hora.AddMinutes(duracaoMinutos));

        return disponibilidade != null;
    }

    public async Task AtualizarTotalAulasAsync(Guid instrutorId, int incremento)
    {
        var instrutor = await _context.Instrutores.FindAsync(instrutorId);
        if (instrutor != null)
        {
            instrutor.TotalAulas += incremento;
            await _context.SaveChangesAsync();
        }
    }

    public async Task AtualizarAvaliacaoAsync(Guid instrutorId, double novaMedia)
    {
        var instrutor = await _context.Instrutores.FindAsync(instrutorId);
        if (instrutor != null)
        {
            instrutor.Avaliacao = novaMedia;
            await _context.SaveChangesAsync();
        }
    }
}
