<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Lehrbetrieb zu Lernende Bearbeiten
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
        <v-btn @click="editLehrbetriebLernende()" color="primary">Bearbeiten</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useFetch} from "@vueuse/core";
import {useLernenden} from "../../stores/lernendeStore.ts";
import {useLehrbetriebe} from "../../stores/lehrbetriebeStore.ts";
import {useLehrbetriebLernende} from "../../stores/lehrbetriebLernendeStore.ts";

const props = defineProps<{
  editLehrbetriebLernendeDialog: boolean,
  lehrbetriebLernendeId: number
}>();
const emit = defineEmits(['update:editLehrbetriebLernendeDialog']);

const dialog = computed({
  get: () => props.editLehrbetriebLernendeDialog,
  set: (value) => emit('update:editLehrbetriebLernendeDialog', value),
});

const useLehrbetriebeStore = useLehrbetriebe();
const {getLehrbetriebe} = storeToRefs(useLehrbetriebeStore);

const useLernendenStore = useLernenden();
const {getLernenden} = storeToRefs(useLernendenStore);

const useLehrbetriebLernendeStore = useLehrbetriebLernende();
const {getLehrbetriebLernende} = storeToRefs(useLehrbetriebLernendeStore);

interface lehrbetriebLernende {
  id_lehrbetrieb_lernende?: number;
  fk_lernende: string;
  fk_lehrbetrieb: string;
  start: string;
  ende: string;
  beruf: string;
}

const currentLehrbetriebLernende = computed(() =>
    getLehrbetriebLernende.value.find((ll: lehrbetriebLernende) =>
        ll.id_lehrbetrieb_lernende === props.lehrbetriebLernendeId
    )
);

const currentLernende = computed(() =>
    getLernenden.value.find((lernende: any) =>
        (currentLehrbetriebLernende.value) ?
            currentLehrbetriebLernende.value.lernende === lernende.vorname + " " + lernende.nachname :
            ""
    )
);

const currentLehrbetrieb = computed(() =>
    getLehrbetriebe.value.find((lehrbetrieb: any) =>
        (currentLehrbetriebLernende.value) ?
            currentLehrbetriebLernende.value.firma === lehrbetrieb.firma :
            ""
    )
);

const lehrbetriebLernende = ref<lehrbetriebLernende>({
  fk_lernende: currentLernende.value ? currentLernende.value.id_lernende : "",
  fk_lehrbetrieb: currentLehrbetrieb.value ? currentLehrbetrieb.value.id_lehrbetrieb : "",
  start: currentLehrbetriebLernende.value ? currentLehrbetriebLernende.value.start : "",
  ende: currentLehrbetriebLernende.value ? currentLehrbetriebLernende.value.ende : "",
  beruf: currentLehrbetriebLernende.value ? currentLehrbetriebLernende.value.beruf : "",
});

const url = import.meta.env.VITE_API_URL + "/lehrbetrieb_lernende/" + props.lehrbetriebLernendeId;
const {addSnackBar} = useSnackBar();

async function editLehrbetriebLernende() {
  let errorInEditLehrbetriebLernende = false;

  const {execute, error, data} = useFetch(url, {immediate: false})
      .put(lehrbetriebLernende.value)
      .json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim bearbeiten von Lehrbetrieb zu Lernende.`);
    errorInEditLehrbetriebLernende = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim bearbeiten von Lehrbetrieb zu Lernende.`);
    errorInEditLehrbetriebLernende = true;
  }

  if (!errorInEditLehrbetriebLernende) {
    addSnackBar('success', 'Lehrbetrieb zu Lernende erfolgreich bearbeitet.');
  }

  await useLehrbetriebLernendeStore.execute();

  dialog.value = false;
}
</script>