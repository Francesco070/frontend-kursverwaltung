<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Kurs Bearbeiten
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="kurs.kursnummer" label="Kursnummer"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="kurs.kursthema" label="Kursthema"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="kurs.inhalt" label="Inhalt"></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                :items="getDozenten"
                :item-title="(dozent: any) => (dozent) ? `${dozent.vorname} ${dozent.nachname}` : ''"
                item-value="id_dozent"
                v-model="kurs.fk_dozent"
                label="Dozent"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="kurs.startdatum" label="Start Datum"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="kurs.enddatum" label="End Datum"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="kurs.dauer" label="Dauer"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn @click="dialog = false" class="me-2" color="secondary">Abbrechen</v-btn>
        <v-btn @click="editKurs()" color="primary">Bearbeiten</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useDozenten} from "../../stores/dozentenStore.ts";
import {useFetch} from "@vueuse/core";
import {useKurse} from "../../stores/kurseStore.ts";

const props = defineProps<{ editKursDialog: boolean, kurseId: number }>();
const emit = defineEmits(['update:editKursDialog']);

const dialog = computed({
  get: () => props.editKursDialog,
  set: (value) => emit('update:editKursDialog', value),
});

const useDozentenStore = useDozenten()
const {getDozenten} = storeToRefs(useDozentenStore);

const useKurseStore = useKurse()
const {getKurse} = storeToRefs(useKurseStore);

interface kurs {
  id_kurs?: number,
  kursnummer: string,
  kursthema: string,
  inhalt: string,
  fk_dozent: string,
  startdatum: string,
  enddatum: string,
  dauer: string,
}

const currentKurs = computed(() => getKurse.value.find((k: kurs) => k.id_kurs === props.kurseId));
const currentKursDozent = computed(() => getDozenten.value.find((dozent: any) => (currentKurs.value) ? currentKurs.value.dozent === dozent.vorname + " " + dozent.nachname : ""));

const kurs = ref<kurs>({
  kursnummer: currentKurs.value.kursnummer,
  kursthema: currentKurs.value.kursthema,
  inhalt: currentKurs.value.inhalt,
  startdatum: currentKurs.value.startdatum,
  enddatum: currentKurs.value.enddatum,
  fk_dozent: currentKursDozent.value ? currentKursDozent.value.id_dozent : "",
  dauer: currentKurs.value.dauer
});

const url = import.meta.env.VITE_API_URL + "/kurse/" + props.kurseId;
const {addSnackBar} = useSnackBar();

async function editKurs() {
  let errorInEditKurse = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).put(kurs.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim bearbeiten von Kurs.`);
    errorInEditKurse = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim bearbeiten von Kurs.`);
    errorInEditKurse = true;
  }

  if (!errorInEditKurse) {
    addSnackBar('success', 'Kurs erfolgreich bearbeitet.');
  }

  await useKurseStore.execute();

  dialog.value = false;
}
</script>

