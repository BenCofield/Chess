using Microsoft.AspNetCore.Components;

namespace Chess.Components
{
    public class LobbyComponent : ComponentBase
    {
        private Timer timer;
        private int secondsElapsed = 0;

        public string Time 
        {
            get => $"{secondsElapsed / 60}:{secondsElapsed % 60}";
        }

        protected override void OnInitialized()
        {
            timer = new Timer(async _ =>
            {
                await OnAddSecond();
            }, null, 0, 1000);

        }

        private async Task OnAddSecond()
        {
            secondsElapsed += 1;
            await InvokeAsync(StateHasChanged);
        }

        public void Dispose()
        {
            timer?.Dispose();
        }
    }
}
