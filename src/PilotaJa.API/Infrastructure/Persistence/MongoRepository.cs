using System.Linq.Expressions;
using MongoDB.Driver;

namespace PilotaJa.API.Infrastructure.Persistence;

public class MongoRepository<T> : IRepository<T> where T : class
{
    protected readonly IMongoCollection<T> _collection;

    public MongoRepository(IMongoCollection<T> collection)
    {
        _collection = collection;
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        var filter = Builders<T>.Filter.Eq("Id", id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.Find(predicate).ToListAsync();
    }

    public async Task<T> CreateAsync(T entity)
    {
        await _collection.InsertOneAsync(entity);
        return entity;
    }

    public async Task UpdateAsync(Guid id, T entity)
    {
        var filter = Builders<T>.Filter.Eq("Id", id);
        await _collection.ReplaceOneAsync(filter, entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var filter = Builders<T>.Filter.Eq("Id", id);
        await _collection.DeleteOneAsync(filter);
    }

    public async Task<long> CountAsync(Expression<Func<T, bool>>? predicate = null)
    {
        if (predicate == null)
            return await _collection.CountDocumentsAsync(_ => true);
        
        return await _collection.CountDocumentsAsync(predicate);
    }
}
