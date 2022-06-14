export default {
    ISLOGIN(state, params){
        state.login.is_login = true;
    },
    HEADCOVER(state, params){
        state.head_cover = params;
    },
}