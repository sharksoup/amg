window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('main-video');
    const playPauseBtn = document.getElementById('play-pause');
    const seekBar = document.getElementById('seek-bar');
    const muteBtn = document.getElementById('mute');
    const volumeBar = document.getElementById('volume-bar');
    const fullscreenBtn = document.getElementById('fullscreen');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    video.addEventListener('play', () => {
        playPauseBtn.textContent = '⏸️';
    });
    video.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶️';
    });

    // Seek bar
    video.addEventListener('timeupdate', () => {
        seekBar.value = (video.currentTime / video.duration) * 100 || 0;
        currentTimeSpan.textContent = formatTime(video.currentTime);
    });

    seekBar.addEventListener('input', () => {
        video.currentTime = (seekBar.value / 100) * video.duration;
    });

    // Volume
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });

    volumeBar.addEventListener('input', () => {
        video.volume = volumeBar.value;
        video.muted = video.volume === 0;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });

    // Duration
    video.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(video.duration);
    });

    function formatTime(time) {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
});