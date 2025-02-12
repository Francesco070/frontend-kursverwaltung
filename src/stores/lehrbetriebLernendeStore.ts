import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useLehrbetriebLernende = defineStore('lehrbetriebLernende', () => {
    const url = import.meta.env.VITE_API_URL + "/lehrbetrieb_lernende";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getLehrbetriebLernende = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getLehrbetriebLernende,
        loading,
        execute
    };
});
