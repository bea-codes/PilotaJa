using FastEndpoints;
using FastEndpoints.Swagger;
using PilotaJa.Modules.Instrutores;
using PilotaJa.Modules.Alunos;
using PilotaJa.Modules.Agendamentos;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string not found");

// FastEndpoints
builder.Services.AddFastEndpoints();
builder.Services.SwaggerDocument(o =>
{
    o.DocumentSettings = s =>
    {
        s.Title = "PilotaJá API";
        s.Version = "v1";
        s.Description = "API para gerenciamento de aulas de direção com instrutores autônomos";
    };
});

// CORS para o React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Auth (placeholder - configurar depois)
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

// Módulos independentes (cada um com seu schema no banco)
builder.Services.AddInstrutoresModule(connectionString);
builder.Services.AddAlunosModule(connectionString);
builder.Services.AddAgendamentosModule(connectionString);

var app = builder.Build();

app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.UseFastEndpoints();
app.UseSwaggerGen();

app.Run();
