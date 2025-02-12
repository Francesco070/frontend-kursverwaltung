<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Lehrbetrieb Hinzufügen
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="lehrbetrieb.firma" label="Firma"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="lehrbetrieb.strasse" label="Strasse"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="lehrbetrieb.plz" label="PLZ"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="lehrbetrieb.ort" label="Ort"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn @click="dialog = false" class="me-2" color="secondary">Abbrechen</v-btn>
        <v-btn @click="addLehrbetrieb()" color="primary">Hinzufügen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {useFetch} from "@vueuse/core";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useLehrbetriebe} from "../../stores/lehrbetriebeStore.ts";

const props = defineProps<{ addLehrbetriebDialog: boolean }>();
const emit = defineEmits(['update:addLehrbetriebDialog']);

const dialog = computed({
  get: () => props.addLehrbetriebDialog,
  set: (value) => emit('update:addLehrbetriebDialog', value),
});

const useLehrbetriebeStore = useLehrbetriebe()

interface lehrbetrieb {
  firma: string,
  strasse: string,
  plz: string,
  ort: string,
}

const lehrbetrieb = ref<lehrbetrieb>({
  firma: "",
  strasse: "",
  plz: "",
  ort: "",
});

const url = import.meta.env.VITE_API_URL + "/lehrbetriebe";
const {addSnackBar} = useSnackBar();

async function addLehrbetrieb() {
  let errorInAddLehrbetriebe = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).post(lehrbetrieb.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim hinzufügen von Lehrbetrieb.`);
    errorInAddLehrbetriebe = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim hinzufügen von Lehrbetrieb.`);
    errorInAddLehrbetriebe = true;
  }

  if (!errorInAddLehrbetriebe) {
    addSnackBar('success', 'Lehrbetrieb erfolgreich hinzugefügt.');
  }

  await useLehrbetriebeStore.execute();

  dialog.value = false;

  lehrbetrieb.value = {
    firma: "",
    strasse: "",
    plz: "",
    ort: "",
  };
}
</script>

