using Microsoft.EntityFrameworkCore;
using PilotaJa.Modules.Agendamentos.Contracts;
using PilotaJa.Modules.Agendamentos.Domain;
using PilotaJa.Modules.Agendamentos.Persistence;
using PilotaJa.Modules.Instrutores.Contracts;
using PilotaJa.Modules.Alunos.Contracts;

namespace PilotaJa.Modules.Agendamentos;

public class AgendamentosModule : IAgendamentosModule
{
    private readonly AgendamentosDbContext _context;
    private readonly IInstrutoresModule _instrutoresModule;
    private readonly IAlunosModule _alunosModule;

    public AgendamentosModule(
        AgendamentosDbContext context,
        IInstrutoresModule instrutoresModule,
        IAlunosModule alunosModule)
    {
        _context = context;
        _instrutoresModule = instrutoresModule;
        _alunosModule = alunosModule;
    }

    public async Task<AgendamentoInfo?> GetAsync(Guid id)
    {
        var agendamento = await _context.Agendamentos
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        if (agendamento == null) return null;

        return ToInfo(agendamento);
    }

    public async Task<IEnumerable<AgendamentoInfo>> ListarPorAlunoAsync(Guid alunoId)
    {
        var agendamentos = await _context.Agendamentos
            .AsNoTracking()
            .Where(a => a.AlunoId == alunoId)
            .OrderByDescending(a => a.DataHora)
            .ToListAsync();

        return agendamentos.Select(ToInfo);
    }

    public async Task<IEnumerable<AgendamentoInfo>> ListarPorInstrutorAsync(Guid instrutorId)
    {
        var agendamentos = await _context.Agendamentos
            .AsNoTracking()
            .Where(a => a.InstrutorId == instrutorId)
            .OrderByDescending(a => a.DataHora)
            .ToListAsync();

        return agendamentos.Select(ToInfo);
    }

    public async Task<Guid> CriarAsync(CriarAgendamentoCommand command)
    {
        // Valida via contratos dos outros módulos (sem acessar tabelas deles)
        var instrutor = await _instrutoresModule.GetInstrutorAsync(command.InstrutorId)
            ?? throw new InvalidOperationException("Instrutor não encontrado");

        var alunoExiste = await _alunosModule.ExisteAsync(command.AlunoId);
        if (!alunoExiste)
            throw new InvalidOperationException("Aluno não encontrado");

        // Verifica disponibilidade
        var disponivel = await _instrutoresModule.VerificarDisponibilidadeAsync(
            command.InstrutorId, command.DataHora, command.DuracaoMinutos);
        
        if (!disponivel)
            throw new InvalidOperationException("Instrutor não disponível neste horário");

        // Calcula valor
        var valorHora = await _instrutoresModule.GetPrecoHoraAsync(command.InstrutorId);
        var valor = valorHora * command.DuracaoMinutos / 60;

        var agendamento = new Agendamento
        {
            Id = Guid.NewGuid(),
            InstrutorId = command.InstrutorId,
            AlunoId = command.AlunoId,
            DataHora = command.DataHora,
            DuracaoMinutos = command.DuracaoMinutos,
            Valor = valor,
            Observacoes = command.Observacoes,
            EnderecoEncontro = command.EnderecoEncontro,
            Latitude = command.Latitude,
            Longitude = command.Longitude
        };

        _context.Agendamentos.Add(agendamento);
        await _context.SaveChangesAsync();

        return agendamento.Id;
    }

    public async Task ConfirmarAsync(Guid id)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id)
            ?? throw new InvalidOperationException("Agendamento não encontrado");

        agendamento.Status = StatusAgendamento.Confirmado;
        agendamento.ConfirmadoEm = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task CancelarAsync(Guid id, string motivo)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id)
            ?? throw new InvalidOperationException("Agendamento não encontrado");

        agendamento.Status = StatusAgendamento.Cancelado;
        agendamento.CanceladoEm = DateTime.UtcNow;
        agendamento.MotivoCancelamento = motivo;
        await _context.SaveChangesAsync();
    }

    public async Task ConcluirAsync(Guid id)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id)
            ?? throw new InvalidOperationException("Agendamento não encontrado");

        agendamento.Status = StatusAgendamento.Concluido;
        agendamento.ConcluidoEm = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Atualiza contador do instrutor via contrato
        await _instrutoresModule.AtualizarTotalAulasAsync(agendamento.InstrutorId, 1);
    }

    public async Task AvaliarAsync(Guid id, int nota, string? comentario)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id)
            ?? throw new InvalidOperationException("Agendamento não encontrado");

        agendamento.AvaliacaoNota = nota;
        agendamento.AvaliacaoComentario = comentario;
        await _context.SaveChangesAsync();

        // TODO: Recalcular média do instrutor
    }

    private static AgendamentoInfo ToInfo(Agendamento a) => new(
        a.Id, a.InstrutorId, a.AlunoId, a.DataHora, 
        a.DuracaoMinutos, a.Status, a.Valor
    );
}
