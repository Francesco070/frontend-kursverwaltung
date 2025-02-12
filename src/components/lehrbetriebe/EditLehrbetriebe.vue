<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Lehrbetrieb Bearbeiten
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
        <v-btn @click="editLehrbetrieb()" color="primary">Bearbeiten</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useFetch} from "@vueuse/core";
import {useLehrbetriebe} from "../../stores/lehrbetriebeStore.ts";

const props = defineProps<{ editLehrbetriebDialog: boolean, lehrbetriebeId: number }>();

const emit = defineEmits(['update:editLehrbetriebDialog']);

const dialog = computed({
  get: () => props.editLehrbetriebDialog,
  set: (value) => emit('update:editLehrbetriebDialog', value),
});

const useLehrbetriebeStore = useLehrbetriebe()
const {getLehrbetriebe} = storeToRefs(useLehrbetriebeStore);

interface lehrbetrieb {
  id_lehrbetrieb?: number,
  firma: string,
  strasse: string,
  plz: string,
  ort: string,
}

const currentLehrbetrieb = computed(() => getLehrbetriebe.value.find((l: lehrbetrieb) => l.id_lehrbetrieb === props.lehrbetriebeId));

const lehrbetrieb = ref<lehrbetrieb>({
  firma: currentLehrbetrieb.value.firma,
  strasse: currentLehrbetrieb.value.strasse,
  plz: currentLehrbetrieb.value.plz,
  ort: currentLehrbetrieb.value.ort,
});

const url = import.meta.env.VITE_API_URL + "/lehrbetriebe/" + props.lehrbetriebeId;
const {addSnackBar} = useSnackBar();

async function editLehrbetrieb() {
  let errorInEditLehrbetriebe = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).put(lehrbetrieb.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim bearbeiten von Lehrbetrieb.`);
    errorInEditLehrbetriebe = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim bearbeiten von Lehrbetrieb.`);
    errorInEditLehrbetriebe = true;
  }

  if (!errorInEditLehrbetriebe) {
    addSnackBar('success', 'Lehrbetrieb erfolgreich bearbeitet.');
  }

  await useLehrbetriebeStore.execute();

  dialog.value = false;
}
</script>

