export default {
    isLogin(context, params = {}) {
        context.commit('ISLOGIN',params);
    },
    headCover(context, params = {}) {
        context.commit('HEADCOVER',params);
    },
}