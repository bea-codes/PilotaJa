using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace PilotaJa.Mobile.ViewModels;

public partial class ProfileViewModel : BaseViewModel
{
    public ProfileViewModel()
    {
        Title = "Meu Perfil";
        LoadMockData();
    }

    [ObservableProperty]
    private string _name = string.Empty;

    [ObservableProperty]
    private string _email = string.Empty;

    [ObservableProperty]
    private string _phone = string.Empty;

    [ObservableProperty]
    private string _taxId = string.Empty;

    [ObservableProperty]
    private DateTime _dateOfBirth = DateTime.Today;

    [ObservableProperty]
    private bool _isEditing;

    // Backup for cancel
    private string _backupName = string.Empty;
    private string _backupEmail = string.Empty;
    private string _backupPhone = string.Empty;
    private string _backupTaxId = string.Empty;
    private DateTime _backupDateOfBirth;

    public string FormattedDateOfBirth => DateOfBirth.ToString("dd/MM/yyyy");
    
    public int Age
    {
        get
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Year;
            if (DateOfBirth > today.AddYears(-age)) age--;
            return age;
        }
    }

    private void LoadMockData()
    {
        // Mock data - will come from API later
        Name = "Ana Costa";
        Email = "ana.costa@email.com";
        Phone = "(11) 98888-1111";
        TaxId = "123.456.789-00";
        DateOfBirth = new DateTime(1995, 5, 15);
    }

    [RelayCommand]
    private void StartEditing()
    {
        // Backup current values
        _backupName = Name;
        _backupEmail = Email;
        _backupPhone = Phone;
        _backupTaxId = TaxId;
        _backupDateOfBirth = DateOfBirth;
        
        IsEditing = true;
    }

    [RelayCommand]
    private async Task SaveAsync()
    {
        // TODO: API call to save
        IsEditing = false;
        await Shell.Current.DisplayAlert("Sucesso", "Perfil atualizado! (mock)", "OK");
        OnPropertyChanged(nameof(FormattedDateOfBirth));
        OnPropertyChanged(nameof(Age));
    }

    [RelayCommand]
    private void CancelEditing()
    {
        // Restore backup
        Name = _backupName;
        Email = _backupEmail;
        Phone = _backupPhone;
        TaxId = _backupTaxId;
        DateOfBirth = _backupDateOfBirth;
        
        IsEditing = false;
    }

    [RelayCommand]
    private async Task GoToInstructorsAsync()
    {
        await Shell.Current.GoToAsync("//instructors");
    }

    [RelayCommand]
    private async Task GoToAppointmentsAsync()
    {
        await Shell.Current.GoToAsync("//appointments");
    }
}
