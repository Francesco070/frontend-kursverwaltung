import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";

export const useLehrbetriebe = defineStore('lehrbetriebe', () => {
    const url = import.meta.env.VITE_API_URL + "/lehrbetriebe";
    const {data, isFetching: loading, execute} = useFetch(url).get().json();

    const getLehrbetriebe = computed(() => (data.value && !loading.value) ? data?.value["data"] : [])

    return {
        getLehrbetriebe,
        loading,
        execute
    };
});
