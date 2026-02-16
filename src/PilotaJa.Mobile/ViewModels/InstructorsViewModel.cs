using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using PilotaJa.Mobile.Services;
using PilotaJa.Mobile.Views;
using PilotaJa.Shared.DTOs;

namespace PilotaJa.Mobile.ViewModels;

public partial class InstructorsViewModel : BaseViewModel
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private ObservableCollection<InstructorSummaryDto> _instructors = [];

    [ObservableProperty]
    private string _searchText = string.Empty;

    [ObservableProperty]
    private bool _isRefreshing;

    public InstructorsViewModel(IApiService apiService)
    {
        _apiService = apiService;
        Title = "Instrutores";
    }

    [RelayCommand]
    private async Task LoadInstructorsAsync()
    {
        await ExecuteAsync(async () =>
        {
            var response = await _apiService.GetInstructorsAsync(new ListInstructorsRequest
            {
                City = string.IsNullOrWhiteSpace(SearchText) ? null : SearchText
            });

            Instructors.Clear();
            foreach (var instructor in response.Instructors)
            {
                Instructors.Add(instructor);
            }
        }, "Erro ao carregar instrutores");

        IsRefreshing = false;
    }

    [RelayCommand]
    private async Task SearchAsync()
    {
        await LoadInstructorsAsync();
    }

    [RelayCommand]
    private async Task SelectInstructorAsync(InstructorSummaryDto instructor)
    {
        if (instructor == null) return;

        await Shell.Current.GoToAsync($"{nameof(InstructorDetailPage)}?id={instructor.Id}");
    }
}
