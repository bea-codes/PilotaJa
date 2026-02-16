using System.Linq.Expressions;

namespace PilotaJa.API.Infrastructure.Persistence;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> CreateAsync(T entity);
    Task UpdateAsync(Guid id, T entity);
    Task DeleteAsync(Guid id);
    Task<long> CountAsync(Expression<Func<T, bool>>? predicate = null);
}
