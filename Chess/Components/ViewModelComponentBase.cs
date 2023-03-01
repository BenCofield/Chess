using Chess.ViewModels;
using Microsoft.AspNetCore.Components;

namespace Chess.Components
{
    public class ViewModelComponentBase : ComponentBase
    {
        protected ViewModelBase viewModel { get; set; }

        protected override async Task OnInitializedAsync()
        {
            if (viewModel == null) return;

            if (!viewModel.Initialized) //Initialize once
            {
                await viewModel.InitializeAsync();
                viewModel.PropertyChanged += (s, e) => StateHasChanged();
            }
            await base.OnInitializedAsync();
        }
    }
}
