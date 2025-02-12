import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useKurseLernende = defineStore('kurseLernende', () => {
    const url = import.meta.env.VITE_API_URL + "/kurse_lernende";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getKurseLernende = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getKurseLernende,
        loading,
        execute
    };
});
