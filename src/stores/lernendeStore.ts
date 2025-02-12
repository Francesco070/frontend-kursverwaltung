import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useLernende = defineStore('lernende', () => {
    const url = import.meta.env.VITE_API_URL + "/lernende";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getLernende = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getLernende,
        loading,
        execute
    };
});
