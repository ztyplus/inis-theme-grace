export default {
    ISLOGIN(state, params){
        state.login.is_login = true;
    },
    HEADCOVER(state, params){
        state.head_cover = params;
    },
    SWTALK(state, params){
        state.send_talk = params;
    },
    MUSICPLAY(state, params){
        state.music.is_play = params;
    },
    GETMUSIC(state, params){
        state.music.music_info = params;
    },
    DURATION(state, params){
        state.music_control.duration = params;
    },
    CURRENTTIME(state, params){
        state.music_control.currentTime = params;
    },
    PLAYENDED(state, params){
        state.music_pregres.ended = params;
    },
    VOLUME(state, params){
        state.music_control.volume = params;
    },
}