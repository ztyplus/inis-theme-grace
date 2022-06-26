export default {
    isLogin(context, params = {}) {
        context.commit('ISLOGIN',params);
    },
    headCover(context, params = {}) {
        context.commit('HEADCOVER',params);
    },
    swTalk(context, params = {}) {
        context.commit('SWTALK',params);
    },
    musicPlay(context, params = {}) {
        context.commit('MUSICPLAY',params);
    },
    getMusic(context, params = {}) {
        context.commit('GETMUSIC',params);
    },
    duration(context, params = {}) {
        context.commit('DURATION',params);
    },
    currentTime(context, params = {}) {
        context.commit('CURRENTTIME',params);
    },
    playEnded(context, params = {}) {
        context.commit('PLAYENDED',params);
    },
    volume(context, params = {}) {
        context.commit('VOLUME',params);
    },
}