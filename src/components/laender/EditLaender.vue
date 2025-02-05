<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Land Bearbeiten
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="land.country" label="Land"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn @click="dialog = false" class="me-2" color="secondary">Abbrechen</v-btn>
        <v-btn @click="editLand()" color="primary">Bearbeiten</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useLaender} from "../../stores/laenderStore.ts";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useFetch} from "@vueuse/core";

const props = defineProps<{ editLandDialog: boolean, landId: number }>();
const emit = defineEmits(['update:editLandDialog']);

const dialog = computed({
  get: () => props.editLandDialog,
  set: (value) => emit('update:editLandDialog', value),
});

const useLaenderStore = useLaender();
const {getLaender} = storeToRefs(useLaenderStore);

interface land {
  id_countries?: string
  country: string,
}

const currentLand = computed(() => getLaender.value.find((l: land) => l.id_countries === props.landId));

const land = ref<land>({
  country: currentLand.value.country,
});

const url = import.meta.env.VITE_API_URL + "/laender/" + props.landId;
const {addSnackBar} = useSnackBar();

async function editLand() {
  let errorInEditLaender = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).put(land.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim bearbeiten von Land.`);
    errorInEditLaender = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim bearbeiten von Land.`);
    errorInEditLaender = true;
  }

  if (!errorInEditLaender) {
    addSnackBar('success', 'Land erfolgreich bearbeitet.');
  }

  await useLaenderStore.execute();

  dialog.value = false;
}
</script>

