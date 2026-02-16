using FastEndpoints;
using FastEndpoints.Swagger;
using PilotaJa.API.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// FastEndpoints
builder.Services.AddFastEndpoints();
builder.Services.SwaggerDocument(o =>
{
    o.DocumentSettings = s =>
    {
        s.Title = "PilotaJá API";
        s.Version = "v1";
        s.Description = "API for driving lesson scheduling with independent instructors";
    };
});

// MongoDB
builder.Services.AddMongoDb(builder.Configuration);

// CORS for React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Auth (placeholder - configure later)
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.UseFastEndpoints();
app.UseSwaggerGen();

app.Run();
