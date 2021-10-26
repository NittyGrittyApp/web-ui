import { createStore } from "vuex";

export default createStore({
    state: {
        status: "",
        channels: [],
        entries: [],
    },
    getters: {
        entries: (state) => state.entries,
        channels: (state) => state.channels,
    },
    mutations: {
        channels_request: (state) => (state.status = "loading"),
        channels_success: (state, data) => {
            state.status = "success";
            state.channels = data.results;
        },
        channels_error: (state) => (state.status = "error"),
        entries_request: (state) => (state.status = "loading"),
        entries_success: (state, data) => {
            state.status = "success";
            state.entries = data.results.map((item) => {
                return { ...item, isFocused: false, isOpened: false };
            });
        },
        entries_error: (state) => (state.status = "error"),
    },
    actions: {
        channels_request: ({ commit }) => {
            fetch("http://127.0.0.1:8000/api/v1/channels/?limit=200")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    commit("channels_success", data);
                })
                .catch(() => {
                    commit("channels_error");
                });
        },
        entries_request: ({ commit }, param) => {
            const base = "http://127.0.0.1:8000/api/v1/entries/";
            const url = param && param.query ? `${base}?${param.query}` : base;
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    commit("entries_success", data);
                })
                .catch(() => {
                    commit("entries_error");
                });
        },
    },
});
