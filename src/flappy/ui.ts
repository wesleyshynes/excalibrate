import { Resources } from "./resources";

export function initMuteButton() {
    const muteButton = document.getElementById('mute');
    if (muteButton) {
        muteButton.addEventListener('click', toggleButtonClickHandler);
        muteButton.addEventListener('keydown', toggleButtonKeydownHandler);
        muteButton.addEventListener('keyup', toggleButtonKeyupHandler);
    }
}

function toggleButtonClickHandler(event: any) {
    toggleButtonState(event!.currentTarget as HTMLButtonElement);
}

function toggleButtonKeydownHandler(event: KeyboardEvent) {
    if (event.code === 'Space') {
        event.preventDefault();
    } else if (event.code === 'KeyM') {
        event.preventDefault();
        toggleButtonState(event!.currentTarget as HTMLButtonElement);
    }
}

function toggleButtonKeyupHandler(event: KeyboardEvent) {
    // if (event.code === 'Space') {
    //     event.preventDefault();
    //     toggleButtonState(event!.currentTarget as HTMLButtonElement);
    // }
}

function toggleButtonState(button: HTMLElement) {
    const isAriaPressed = button.getAttribute('aria-pressed') === 'true';

    button.setAttribute('aria-pressed', isAriaPressed ? 'false' : 'true');

    if (!isAriaPressed) {
        Resources.BackgroundMusic.volume = 0;
        Resources.FlapSound.volume = 0;
        Resources.FailSound.volume = 0;
    } else {
        Resources.BackgroundMusic.volume = 1;
        Resources.FlapSound.volume = 1;
        Resources.FailSound.volume = 1;
    }
}