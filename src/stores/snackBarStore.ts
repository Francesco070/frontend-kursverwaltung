import {computed, ref} from 'vue';
import {defineStore} from 'pinia';

type SnackBarType = 'error' | 'success' | 'warning';

interface SnackBarItem {
    id: number;
    type: SnackBarType;
    message: string;
    show: boolean;
}

export const useSnackBar = defineStore('snackBar', () => {
    const snackbars = ref<SnackBarItem[]>([]);
    let nextId = 0;

    function addSnackBar(type: SnackBarType, message: string) {
        if (type === 'error') {
            const currentErrors = snackbars.value.filter(
                (snack) => snack.type === 'error' && snack.show
            );
            if (currentErrors.length >= 3) return;
        }

        const id = nextId++;
        snackbars.value.push({
            id,
            type,
            message,
            show: true,
        });

        setTimeout(() => {
            removeSnackBar(id);
        }, 5000);
    }

    function removeSnackBar(id: number) {
        const index = snackbars.value.findIndex((snack) => snack.id === id);
        if (index !== -1) {
            snackbars.value[index].show = false;
            setTimeout(() => {
                snackbars.value = snackbars.value.filter((snack) => snack.id !== id);
            }, 300);
        }
    }

    const getSnackBars = computed(() => snackbars.value);

    return {
        getSnackBars,
        addSnackBar,
        removeSnackBar,
    };
});