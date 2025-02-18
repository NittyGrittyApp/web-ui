import axios from "axios";
import qs from "qs";

import { getPagedResults } from "../../utils";

import {
    GET_MAINTENANCE_CHANNELS,
    MUTATION_MAINTENANCE_CHANNELS_REQUEST,
    MUTATION_MAINTENANCE_CHANNELS_SUCCESS,
    MUTATION_MAINTENANCE_CHANNELS_ERROR,
    MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS,
    MUTATION_MAINTENANCE_CHANNELS_DELETE_SUCCESS,
    MUTATION_MAINTENANCE_SET_LAST_GET_URL,
    ACTION_MAINTENANCE_CHANNELS_GET_REQUEST,
    ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST,
    ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST,
    ACTION_MAINTENANCE_CHANNELS_DELETE_REQUEST,
} from "../../types";

const state = {
    status: "",
    maintenance_last_get_url: "",
    maintenance_channels: [],
};

const getters = {
    [GET_MAINTENANCE_CHANNELS]: (state) => state.maintenance_channels,
};

const mutations = {
    [MUTATION_MAINTENANCE_CHANNELS_REQUEST]: (state) =>
        (state.status = "loading"),
    [MUTATION_MAINTENANCE_CHANNELS_SUCCESS]: (state, data) => {
        state.status = "success";
        state.maintenance_channels = data;
    },
    [MUTATION_MAINTENANCE_CHANNELS_ERROR]: (state) => (state.status = "error"),
    [MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS]: (state) =>
        (state.status = "success"),
    [MUTATION_MAINTENANCE_SET_LAST_GET_URL]: (state, last_url) => {
        state.maintenance_last_get_url = last_url;
    },
};

const actions = {
    [ACTION_MAINTENANCE_CHANNELS_GET_REQUEST]: ({ commit, state }, param) => {
        let url;
        if (param === undefined) {
            // channel was modified and we are on channels maintenance page
            // request fresh list of channels
            url = state.maintenance_last_get_url;
        } else {
            // we navigated to channels maintenance page
            const query = qs.stringify(param.query);
            url = `channels/?${query}`;
            state.maintenance_last_get_url = url;
        }
        getPagedResults(url, [])
            .then((channels) => {
                const filtered_channels = channels.filter(
                    (channel) => channel.channel_type !== "manual",
                );
                commit(
                    MUTATION_MAINTENANCE_CHANNELS_SUCCESS,
                    filtered_channels,
                );
            })
            .catch(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_ERROR);
            });
    },
    [ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST]: ({ commit }, param) => {
        const query = qs.stringify(param.query);
        const url = `channels/inactivate?${query}`;
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .post(url, options)
            .then((response) => response)
            .then(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS);
            })
            .catch(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_ERROR);
            });
    },
    [ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST]: ({ commit }, param) => {
        const query = qs.stringify(param.query);
        const url = `channels/activate?${query}`;
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .post(url, options)
            .then((response) => response)
            .then(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS);
            })
            .catch(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_ERROR);
            });
    },
    [ACTION_MAINTENANCE_CHANNELS_DELETE_REQUEST]: ({ commit }, param) => {
        const query = qs.stringify(param.query);
        const url = `channels/delete?${query}`;
        const data = {
            keep_tagged_entries: param.keep_tagged_entries,
        };
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .post(url, data, options)
            .then((response) => {
                commit(
                    MUTATION_MAINTENANCE_CHANNELS_DELETE_SUCCESS,
                    response.data,
                );
                commit(MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS);
            })
            .catch(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_ERROR);
            });
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
