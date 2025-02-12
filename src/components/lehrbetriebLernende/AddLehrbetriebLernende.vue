<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Lehrbetrieb zu Lernende Hinzufügen
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-select
                :items="getLernenden"
                :item-title="(lernende: any) => (lernende) ? `${lernende.vorname} ${lernende.nachname}` : ''"
                item-value="id_lernende"
                v-model="lehrbetriebLernende.fk_lernende"
                label="Lernende"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                :items="getLehrbetriebe"
                item-title="firma"
                item-value="id_lehrbetrieb"
                v-model="lehrbetriebLernende.fk_lehrbetrieb"
                label="Lehrbetrieb"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="lehrbetriebLernende.start" label="Start"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="lehrbetriebLernende.ende" label="Ende"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="lehrbetriebLernende.beruf" label="Beruf"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn @click="dialog = false" class="me-2" color="secondary">Abbrechen</v-btn>
        <v-btn @click="addLehrbetriebLernende()" color="primary">Hinzufügen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useFetch} from "@vueuse/core";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useLernenden} from "../../stores/lernendeStore.ts";
import {useLehrbetriebe} from "../../stores/lehrbetriebeStore.ts";
import {useLehrbetriebLernende} from "../../stores/lehrbetriebLernendeStore.ts";

const props = defineProps<{ addLehrbetriebLernendeDialog: boolean }>();
const emit = defineEmits(['update:addLehrbetriebLernendeDialog']);

const dialog = computed({
  get: () => props.addLehrbetriebLernendeDialog,
  set: (value) => emit('update:addLehrbetriebLernendeDialog', value),
});

const useLehrbetriebeStore = useLehrbetriebe();
const {getLehrbetriebe} = storeToRefs(useLehrbetriebeStore);

const useLernendenStore = useLernenden();
const {getLernenden} = storeToRefs(useLernendenStore);

const useLehrbetriebLernendeStore = useLehrbetriebLernende()

interface lehrbetriebLernende {
  fk_lernende: string,
  fk_lehrbetrieb: string,
  start: string,
  ende: string,
  beruf: string,
}

const lehrbetriebLernende = ref<lehrbetriebLernende>({
  fk_lernende: "",
  fk_lehrbetrieb: "",
  start: "",
  ende: "",
  beruf: "",
});

const url = import.meta.env.VITE_API_URL + "/lehrbetrieb_lernende";
const {addSnackBar} = useSnackBar();

async function addLehrbetriebLernende() {
  let errorInAddLehrbetriebLernende = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).post(lehrbetriebLernende.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim hinzufügen von Lehrbetrieb zu Lernende.`);
    errorInAddLehrbetriebLernende = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim hinzufügen von Lehrbetrieb zu Lernende.`);
    errorInAddLehrbetriebLernende = true;
  }

  if (!errorInAddLehrbetriebLernende) {
    addSnackBar('success', 'Lehrbetrieb zu Lernende erfolgreich hinzugefügt.');
  }

  await useLehrbetriebLernendeStore.execute();

  dialog.value = false;

  lehrbetriebLernende.value = {
    fk_lernende: "",
    fk_lehrbetrieb: "",
    start: "",
    ende: "",
    beruf: "",
  };
}
</script>

