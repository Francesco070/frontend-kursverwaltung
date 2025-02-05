<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Land Hinzufügen
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
        <v-btn @click="addLand()" color="primary">Hinzufügen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {useLaender} from "../../stores/laenderStore.ts";
import {useFetch} from "@vueuse/core";
import {useSnackBar} from "../../stores/snackBarStore.ts";

const props = defineProps<{ addLandDialog: boolean }>();
const emit = defineEmits(['update:addLandDialog']);

const dialog = computed({
  get: () => props.addLandDialog,
  set: (value) => emit('update:addLandDialog', value),
});

const useLaenderStore = useLaender()

interface land {
  country: string,
}

const land = ref<land>({
  country: "",
});

const url = import.meta.env.VITE_API_URL + "/laender";
const {addSnackBar} = useSnackBar();

async function addLand() {
  let errorInAddLaender = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).post(land.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim hinzufügen von Land.`);
    errorInAddLaender = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim hinzufügen von Land.`);
    errorInAddLaender = true;
  }

  if (!errorInAddLaender) {
    addSnackBar('success', 'Land erfolgreich hinzugefügt.');
  }

  await useLaenderStore.execute();

  dialog.value = false;

  land.value = {
    country: "",
  };
}
</script>

