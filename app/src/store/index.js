import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        applications: [],
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0,
    },
    mutations: {
        setApplications(state, applications) {
            state.applications = applications;
        },
        setItemsPerPage(state, itemsPerPage) {
            state.itemsPerPage = itemsPerPage;
        },
        setCurrentPage(state, currentPage) {
            state.currentPage = currentPage;
        },
        setTotalItems(state, totalItems) {
            state.totalItems = totalItems;
        },
    },
    actions: {
        fetchApplications({ commit, state }) {
            axios
                .get('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                    params: {
                        page: state.currentPage,
                        page_size: state.itemsPerPage,
                    },
                })
                .then((response) => {
                    commit('setApplications', response.data.results);
                    commit('setTotalItems', response.data.count); // Устанавливаем общее количество заявок
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        updateItemsPerPage({ commit, dispatch }, itemsPerPage) {
            commit('setItemsPerPage', itemsPerPage);
            commit('setCurrentPage', 1); // Сброс текущей страницы на первую
            dispatch('fetchApplications'); // Запрашиваем новые данные
        },
        updateCurrentPage({ commit, dispatch }, currentPage) {
            commit('setCurrentPage', currentPage);
            dispatch('fetchApplications'); // Запрашиваем новые данные
        },
    },
});
