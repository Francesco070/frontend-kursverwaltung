import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useLaender = defineStore('leander', () => {
    const url = import.meta.env.VITE_API_URL + "/laender";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getLaender = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getLaender,
        loading,
        execute
    };
});
