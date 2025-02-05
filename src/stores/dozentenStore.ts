import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useDozenten = defineStore('dozenten', () => {
    const url = import.meta.env.VITE_API_URL + "/dozenten";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getDozenten = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getDozenten,
        loading,
        execute
    };
});
