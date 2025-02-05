<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Dozent Bearbeiten
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="dozent.vorname" label="Vorname"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="dozent.nachname" label="Nachname"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="dozent.strasse" label="Strasse"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="dozent.plz" label="PLZ"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="dozent.ort" label="Ort"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                :items="getLaender"
                item-title="country"
                item-value="id_countries"
                v-model="dozent.fk_land"
                label="Land"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-radio-group inline label="Geschlecht" v-model="dozent.geschlecht">
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
            <v-text-field v-model="dozent.handy" label="Handy"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="dozent.telefon" label="Telefon"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="dozent.email" label="Email"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field type="date" v-model="dozent.birthdate" label="Birthdate"></v-text-field>
            <!--            <v-date-input v-model="dozent.birthdate" label="Birthdate"></v-date-input>-->
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn @click="dialog = false" class="me-2" color="secondary">Abbrechen</v-btn>
        <v-btn @click="editDozent()" color="primary">Bearbeiten</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useLaender} from "../../stores/laenderStore.ts";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useDozenten} from "../../stores/dozentenStore.ts";
import {useFetch} from "@vueuse/core";

const props = defineProps<{ editDozentDialog: boolean, dozentenId: number }>();
const emit = defineEmits(['update:editDozentDialog']);

const dialog = computed({
  get: () => props.editDozentDialog,
  set: (value) => emit('update:editDozentDialog', value),
});

const useLaenderStore = useLaender();
const {getLaender} = storeToRefs(useLaenderStore);

const useDozentenStore = useDozenten()
const {getDozenten} = storeToRefs(useDozentenStore);

interface dozent {
  id_dozent?: number,
  vorname: string,
  nachname: string,
  strasse: string,
  plz: string,
  ort: string,
  fk_land: any,
  geschlecht: string,
  telefon: string,
  handy: string,
  email: string,
  birthdate: string
}

const currentDozent = computed(() => getDozenten.value.find((d: dozent) => d.id_dozent === props.dozentenId));
const currentDozentLand = computed(() => getLaender.value.find((land: any) => (currentDozent.value) ? currentDozent.value.country === land.country : ""));

const dozent = ref<dozent>({
  vorname: currentDozent.value.vorname,
  nachname: currentDozent.value.nachname,
  strasse: currentDozent.value.strasse,
  plz: currentDozent.value.plz,
  ort: currentDozent.value.ort,
  fk_land: currentDozentLand.value ? currentDozentLand.value.id_countries : "",
  geschlecht: currentDozent.value.geschlecht,
  telefon: currentDozent.value.telefon,
  handy: currentDozent.value.handy,
  email: currentDozent.value.email,
  birthdate: currentDozent.value.birthdate
});

const url = import.meta.env.VITE_API_URL + "/dozenten/" + props.dozentenId;
const {addSnackBar} = useSnackBar();

async function editDozent() {
  let errorInEditDozenten = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).put(dozent.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim bearbeiten von Dozent.`);
    errorInEditDozenten = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim bearbeiten von Dozent.`);
    errorInEditDozenten = true;
  }

  if (!errorInEditDozenten) {
    addSnackBar('success', 'Dozent erfolgreich bearbeitet.');
  }

  await useDozentenStore.execute();

  dialog.value = false;
}
</script>

