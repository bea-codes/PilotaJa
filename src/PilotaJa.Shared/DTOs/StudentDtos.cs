namespace PilotaJa.Shared.DTOs;

public class StudentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TaxId { get; set; } // CPF
    public DateTime? DateOfBirth { get; set; }
    public string? PhotoUrl { get; set; }
}

public class CreateStudentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TaxId { get; set; }
    public DateTime? DateOfBirth { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public StudentDto User { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}
