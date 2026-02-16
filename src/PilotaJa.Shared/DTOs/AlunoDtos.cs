namespace PilotaJa.Shared.DTOs;

public class AlunoDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string? CPF { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? FotoUrl { get; set; }
}

public class CriarAlunoRequest
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string? CPF { get; set; }
    public DateTime? DataNascimento { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public AlunoDto Usuario { get; set; } = null!;
    public DateTime ExpiraEm { get; set; }
}
