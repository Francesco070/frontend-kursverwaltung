import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useKurse = defineStore('kurse', () => {
    const url = import.meta.env.VITE_API_URL + "/kurse";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getKurse = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getKurse,
        loading,
        execute
    };
});
