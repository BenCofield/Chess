using Microsoft.AspNetCore.Components;

namespace Chess.Components
{
    public class LobbyComponent : ComponentBase
    {
        private Timer timer;

        public int time = 0;

        protected override void OnInitialized()
        {
            timer = new Timer(async _ =>
            {
                await OnAddSecond();
                await InvokeAsync(StateHasChanged);
            }, null, 0, 1000);

        }

        private async Task OnAddSecond()
        {
            time += 1;
        }

        public void Dispose()
        {
            timer?.Dispose();
        }
    }
}
