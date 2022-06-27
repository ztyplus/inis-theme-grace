export default {
    is_login: state => state.login.is_login,
    head_cover: state => state.head_cover,
    send_talk: state => state.send_talk,
    is_play: state => state.music.is_play,
    music_info: state => state.music.music_info,
    duration: state => state.music_control.duration,
    currentTime: state => state.music_control.currentTime,
    ended: state => state.music_progress.ended,
    volume: state => state.music.volume,
}