<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Kurs Hinzufügen
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
        <v-btn @click="addKurs()" color="primary">Hinzufügen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useFetch} from "@vueuse/core";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useDozenten} from "../../stores/dozentenStore.ts";
import {useKurse} from "../../stores/kurseStore.ts";

const props = defineProps<{ addKursDialog: boolean }>();
const emit = defineEmits(['update:addKursDialog']);

const dialog = computed({
  get: () => props.addKursDialog,
  set: (value) => emit('update:addKursDialog', value),
});

const useDozentenStore = useDozenten();
const {getDozenten} = storeToRefs(useDozentenStore);

const useKurseStore = useKurse()

interface kurs {
  kursnummer: string,
  kursthema: string,
  inhalt: string,
  fk_dozent: string,
  startdatum: string,
  enddatum: string,
  dauer: string,
}

const kurs = ref<kurs>({
  kursnummer: "",
  kursthema: "",
  inhalt: "",
  fk_dozent: "",
  startdatum: "",
  enddatum: "",
  dauer: "",
});

const url = import.meta.env.VITE_API_URL + "/kurse";
const {addSnackBar} = useSnackBar();

async function addKurs() {
  let errorInAddKurse = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).post(kurs.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim hinzufügen von Kurs.`);
    errorInAddKurse = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim hinzufügen von Kurs.`);
    errorInAddKurse = true;
  }

  if (!errorInAddKurse) {
    addSnackBar('success', 'Kurs erfolgreich hinzugefügt.');
  }

  await useKurseStore.execute();

  dialog.value = false;

  kurs.value = {
    kursnummer: "",
    kursthema: "",
    inhalt: "",
    fk_dozent: "",
    startdatum: "",
    enddatum: "",
    dauer: "",
  };
}
</script>

