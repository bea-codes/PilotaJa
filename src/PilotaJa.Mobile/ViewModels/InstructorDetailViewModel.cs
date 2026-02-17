using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

public class DayAgenda
{
    public DateTime Date { get; set; }
    public string DayName { get; set; } = string.Empty;
    public string DayNumber { get; set; } = string.Empty;
    public bool IsToday { get; set; }
    public bool IsPast { get; set; }
    public string Status { get; set; } = "Livre";
    public List<AppointmentSummary> Appointments { get; set; } = new();
}

public class AppointmentSummary
{
    public string Time { get; set; } = string.Empty;
    public string StatusIcon { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
}

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

    [ObservableProperty]
    private ObservableCollection<DayAgenda> _weekAgenda = new();

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
            await LoadWeekAgendaAsync(id);
        }, "Erro ao carregar instrutor");
    }

    private async Task LoadWeekAgendaAsync(Guid instructorId)
    {
        try
        {
            var appointments = await _apiService.GetInstructorAppointmentsAsync(instructorId);
            var appointmentsByDate = appointments
                .GroupBy(a => a.DateTime.Date)
                .ToDictionary(g => g.Key, g => g.ToList());

            var weekDays = new[] { "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb" };
            var today = DateTime.Today;
            var agenda = new List<DayAgenda>();

            for (int i = -3; i <= 3; i++)
            {
                var date = today.AddDays(i);
                var dayAppointments = appointmentsByDate.TryGetValue(date, out var list) ? list : new();
                
                agenda.Add(new DayAgenda
                {
                    Date = date,
                    DayName = weekDays[(int)date.DayOfWeek],
                    DayNumber = $"{date.Day}/{date.Month}",
                    IsToday = date == today,
                    IsPast = date < today,
                    Status = dayAppointments.Count == 0 ? "Livre" : $"{dayAppointments.Count} aula{(dayAppointments.Count > 1 ? "s" : "")}",
                    Appointments = dayAppointments.Select(a => new AppointmentSummary
                    {
                        Time = a.DateTime.ToString("HH:mm"),
                        StatusIcon = a.Status switch
                        {
                            "Confirmed" => "✅",
                            "Pending" => "⏳",
                            "Completed" => "🏁",
                            _ => "❌"
                        },
                        DurationMinutes = a.DurationMinutes
                    }).ToList()
                });
            }

            WeekAgenda = new ObservableCollection<DayAgenda>(agenda);
        }
        catch
        {
            // Silently fail - agenda is optional
        }
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
