using System.Net.Http.Json;
using System.Text.Json;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.Services;

public class ApiService : IApiService
{
    private readonly HttpClient _httpClient;
    private readonly IAuthService _authService;
    private readonly JsonSerializerOptions _jsonOptions;

    // TODO: Mover para configuração
    private const string BaseUrl = "http://10.0.2.2:5000"; // Android emulator
    // private const string BaseUrl = "http://localhost:5000"; // iOS simulator

    public ApiService(IAuthService authService)
    {
        _authService = authService;
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(BaseUrl)
        };
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    private void AddAuthHeader()
    {
        if (_authService.IsLoggedIn && !string.IsNullOrEmpty(_authService.Token))
        {
            _httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authService.Token);
        }
    }

    public async Task<ListarInstrutoresResponse> GetInstrutoresAsync(ListarInstrutoresRequest? request = null)
    {
        var query = "";
        if (request != null)
        {
            var queryParams = new List<string>();
            if (!string.IsNullOrEmpty(request.Cidade)) queryParams.Add($"cidade={request.Cidade}");
            if (!string.IsNullOrEmpty(request.Estado)) queryParams.Add($"estado={request.Estado}");
            if (request.PrecoMaximo.HasValue) queryParams.Add($"precoMaximo={request.PrecoMaximo}");
            if (request.AvaliacaoMinima.HasValue) queryParams.Add($"avaliacaoMinima={request.AvaliacaoMinima}");
            queryParams.Add($"pagina={request.Pagina}");
            queryParams.Add($"porPagina={request.PorPagina}");
            query = "?" + string.Join("&", queryParams);
        }

        var response = await _httpClient.GetAsync($"/api/instrutores{query}");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<ListarInstrutoresResponse>(_jsonOptions) 
            ?? new ListarInstrutoresResponse();
    }

    public async Task<InstrutorDetalheDto> GetInstrutorAsync(Guid id)
    {
        var response = await _httpClient.GetAsync($"/api/instrutores/{id}");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<InstrutorDetalheDto>(_jsonOptions) 
            ?? throw new Exception("Instrutor não encontrado");
    }

    public async Task<List<AgendamentoDto>> GetAgendamentosAsync()
    {
        AddAuthHeader();
        var response = await _httpClient.GetAsync("/api/agendamentos");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<List<AgendamentoDto>>(_jsonOptions) 
            ?? [];
    }

    public async Task<CriarAgendamentoResponse> CriarAgendamentoAsync(CriarAgendamentoRequest request)
    {
        AddAuthHeader();
        var response = await _httpClient.PostAsJsonAsync("/api/agendamentos", request);
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<CriarAgendamentoResponse>(_jsonOptions) 
            ?? throw new Exception("Erro ao criar agendamento");
    }

    public async Task<AlunoDto> GetPerfilAsync()
    {
        AddAuthHeader();
        var response = await _httpClient.GetAsync("/api/alunos/me");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<AlunoDto>(_jsonOptions) 
            ?? throw new Exception("Perfil não encontrado");
    }
}
