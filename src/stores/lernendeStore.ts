import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useLernenden = defineStore('lernenden', () => {
    const url = import.meta.env.VITE_API_URL + "/lernende";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getLernenden = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getLernenden,
        loading,
        execute
    };
});
