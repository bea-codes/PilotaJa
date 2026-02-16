using Microsoft.EntityFrameworkCore;
using PilotaJa.Modules.Alunos.Contracts;
using PilotaJa.Modules.Alunos.Persistence;

namespace PilotaJa.Modules.Alunos;

public class AlunosModule : IAlunosModule
{
    private readonly AlunosDbContext _context;

    public AlunosModule(AlunosDbContext context)
    {
        _context = context;
    }

    public async Task<AlunoInfo?> GetAlunoAsync(Guid id)
    {
        var aluno = await _context.Alunos
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        if (aluno == null) return null;

        return new AlunoInfo(aluno.Id, aluno.Nome, aluno.Email, aluno.Telefone);
    }

    public async Task<bool> ExisteAsync(Guid id)
    {
        return await _context.Alunos.AnyAsync(a => a.Id == id);
    }
}
