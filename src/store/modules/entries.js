import axios from "axios";

const state = {
    status: "",
    entries: [],
    entry: [],
};

const getters = {
    entries: (state) => state.entries,
    entry: (state) => state.entry,
};

const mutations = {
    entries_request: (state) => (state.status = "loading"),
    entries_success: (state, data) => {
        state.status = "success";
        state.entries = data.results.map((item) => {
            return { ...item, isFocused: false, isOpened: false };
        });
    },
    entries_error: (state) => (state.status = "error"),
    entry_request: (state) => (state.status = "loading"),
    entry_success: (state, data) => {
        state.status = "success";
        state.entry = data;
    },
    entry_error: (state) => (state.status = "error"),
};

const actions = {
    entries_request: ({ commit }, param) => {
        const base = "entries/";
        const url = param && param.query ? `${base}?${param.query}` : base;
        axios
            .get(url)
            .then((response) => {
                commit("entries_success", response.data);
            })
            .catch(() => {
                commit("entries_error");
            });
    },
    entry_request: ({ commit }, param) => {
        const url = `entries/${param.id}/`;
        axios
            .get(url)
            .then((response) => {
                commit("entry_success", response.data);
            })
            .catch(() => {
                commit("entry_error");
            });
    },
    entry_archived_request: ({ commit }, param) => {
        const url = `entries/${param.id}/`;
        const data = { archived: param.archived };
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        axios
            .patch(url, data, options)
            .then((response) => {
                commit("entry_success", response.data);
            })
            .catch(() => {
                commit("entry_error");
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
