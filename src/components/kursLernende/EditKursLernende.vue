<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Kurs zu Lernende Bearbeiten
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-select
                :items="getKurse"
                item-title="kursthema"
                item-value="id_kurs"
                v-model="kursLernende.fk_kurs"
                label="Kurs"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                :items="getLernenden"
                :item-title="(lernende: any) => (lernende) ? `${lernende.vorname} ${lernende.nachname}` : ''"
                item-value="id_lernende"
                v-model="kursLernende.fk_lernende"
                label="Lernende"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="kursLernende.role" label="Rolle"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn @click="dialog = false" class="me-2" color="secondary">Abbrechen</v-btn>
        <v-btn @click="editKursLernende()" color="primary">Bearbeiten</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useFetch} from "@vueuse/core";
import {useKurse} from "../../stores/kurseStore.ts";
import {useLernenden} from "../../stores/lernendeStore.ts";
import {useKurseLernende} from "../../stores/kursLernendeStore.ts";

const props = defineProps<{ editKursLernendeDialog: boolean, kursLernendeId: number }>();
const emit = defineEmits(['update:editKursLernendeDialog']);

const dialog = computed({
  get: () => props.editKursLernendeDialog,
  set: (value) => emit('update:editKursLernendeDialog', value),
});

const useKurseStore = useKurse();
const {getKurse} = storeToRefs(useKurseStore);

const useLernendenStore = useLernenden();
const {getLernenden} = storeToRefs(useLernendenStore);

const useKursLernendeStore = useKurseLernende()
const {getKurseLernende} = storeToRefs(useKursLernendeStore);

interface kursLernende {
  id_kurs_lernende?: number
  fk_lernende: string,
  fk_kurs: string,
  role: string,
}

const currentKursLernende = computed(() => getKurseLernende.value.find((kl: kursLernende) => kl.id_kurs_lernende === props.kursLernendeId));
const currentLernende = computed(() => getLernenden.value.find((lernende: any) => (currentKursLernende.value) ? currentKursLernende.value.lernende === lernende.vorname + " " + lernende.nachname : ""));
const currentKurs = computed(() => getKurse.value.find((kurse: any) => (currentKursLernende.value) ? currentKursLernende.value.kursthema === kurse.kursthema : ""));

const kursLernende = ref<kursLernende>({
  fk_lernende: currentLernende.value ? currentLernende.value.id_lernende : "",
  fk_kurs: currentKurs.value ? currentKurs.value.id_kurs : "",
  role: currentKursLernende.value.role,
});

const url = import.meta.env.VITE_API_URL + "/kurse_lernende/" + props.kursLernendeId;
const {addSnackBar} = useSnackBar();

async function editKursLernende() {
  let errorInEditKursLernende = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).put(kursLernende.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim bearbeiten von Kurs zu Lernende.`);
    errorInEditKursLernende = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim bearbeiten von Kurs zu Lernende.`);
    errorInEditKursLernende = true;
  }

  if (!errorInEditKursLernende) {
    addSnackBar('success', 'Kurs zu Lernende erfolgreich bearbeitet.');
  }

  await useKursLernendeStore.execute();

  dialog.value = false;
}
</script>

