using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

[QueryProperty(nameof(InstructorId), "id")]
public partial class InstructorDetailViewModel : BaseViewModel
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private string _instructorId = string.Empty;

    [ObservableProperty]
    private InstructorDetailDto? _instructor;

    [ObservableProperty]
    private DateTime _selectedDate = DateTime.Today;

    [ObservableProperty]
    private TimeSpan _selectedTime = new(9, 0, 0);

    public InstructorDetailViewModel(IApiService apiService)
    {
        _apiService = apiService;
    }

    partial void OnInstructorIdChanged(string value)
    {
        if (Guid.TryParse(value, out _))
        {
            LoadInstructorCommand.Execute(null);
        }
    }

    [RelayCommand]
    private async Task LoadInstructorAsync()
    {
        if (!Guid.TryParse(InstructorId, out var id)) return;

        await ExecuteAsync(async () =>
        {
            Instructor = await _apiService.GetInstructorAsync(id);
            Title = Instructor.Name;
        }, "Erro ao carregar instrutor");
    }

    [RelayCommand]
    private async Task BookLessonAsync()
    {
        if (Instructor == null) return;

        var dateTime = SelectedDate.Date + SelectedTime;

        await ExecuteAsync(async () =>
        {
            var response = await _apiService.CreateAppointmentAsync(new CreateAppointmentRequest
            {
                InstructorId = Instructor.Id,
                StudentId = Guid.NewGuid(), // TODO: Get from logged user
                DateTime = dateTime,
                DurationMinutes = 50
            });

            await Shell.Current.DisplayAlert(
                "Sucesso!", 
                response.Message, 
                "OK");

            await Shell.Current.GoToAsync("..");
        }, "Erro ao agendar aula");
    }
}
