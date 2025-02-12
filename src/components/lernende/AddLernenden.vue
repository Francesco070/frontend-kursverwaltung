<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Lernende Hinzufügen
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="lernende.vorname" label="Vorname"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="lernende.nachname" label="Nachname"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="lernende.strasse" label="Strasse"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="lernende.plz" label="PLZ"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="lernende.ort" label="Ort"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                :items="getLaender"
                item-title="country"
                item-value="id_countries"
                v-model="lernende.fk_land"
                label="Land"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-radio-group inline label="Geschlecht" v-model="lernende.geschlecht">
              <v-row>
                <v-col cols="6">
                  <v-radio color="primary" label="Frau" value="F"></v-radio>
                </v-col>
                <v-col cols="6">
                  <v-radio color="primary" label="Mann" value="M"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="lernende.handy" label="Handy"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="lernende.telefon" label="Telefon"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="lernende.email" label="Email"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="lernende.email_privat" label="Email Privat"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field type="date" v-model="lernende.birthdate" label="Birthdate"></v-text-field>
            <!--            <v-date-input v-model="dozent.birthdate" label="Birthdate"></v-date-input>-->
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn @click="dialog = false" class="me-2" color="secondary">Abbrechen</v-btn>
        <v-btn @click="addLernende()" color="primary">Hinzufügen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {useFetch} from "@vueuse/core";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useLaender} from "../../stores/laenderStore.ts";
import {storeToRefs} from "pinia";
import {useLernenden} from "../../stores/lernendeStore.ts";

const props = defineProps<{ addLernendeDialog: boolean }>();
const emit = defineEmits(['update:addLernendeDialog']);

const dialog = computed({
  get: () => props.addLernendeDialog,
  set: (value) => emit('update:addLernendeDialog', value),
});

const useLaenderStore = useLaender();
const {getLaender} = storeToRefs(useLaenderStore);

const useLernendenStore = useLernenden()

interface lernende {
  vorname: string,
  nachname: string,
  strasse: string,
  plz: string,
  ort: string,
  fk_land: string,
  geschlecht: string,
  telefon: string,
  handy: string,
  email: string,
  email_privat: string,
  birthdate: string,
}

const lernende = ref<lernende>({
  vorname: "",
  nachname: "",
  strasse: "",
  plz: "",
  ort: "",
  fk_land: "",
  geschlecht: "",
  telefon: "",
  handy: "",
  email: "",
  email_privat: "",
  birthdate: ""
});

const url = import.meta.env.VITE_API_URL + "/lernende";
const {addSnackBar} = useSnackBar();

async function addLernende() {
  let errorInAddLehrbetriebe = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).post(lernende.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim hinzufügen von Lernende.`);
    errorInAddLehrbetriebe = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim hinzufügen von Lernende.`);
    errorInAddLehrbetriebe = true;
  }

  if (!errorInAddLehrbetriebe) {
    addSnackBar('success', 'Lernende erfolgreich hinzugefügt.');
  }

  await useLernendenStore.execute();

  dialog.value = false;

  lernende.value = {
    vorname: "",
    nachname: "",
    strasse: "",
    plz: "",
    ort: "",
    fk_land: "",
    geschlecht: "",
    telefon: "",
    handy: "",
    email: "",
    email_privat: "",
    birthdate: ""
  };
}
</script>

