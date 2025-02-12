<template>
  <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-top-transition">
    <v-card class="py-4">
      <v-card-title>
        Kurs zu Lernende Hinzufügen
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
        <v-btn @click="addKursLernende()" color="primary">Hinzufügen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useFetch} from "@vueuse/core";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import {useKurse} from "../../stores/kurseStore.ts";
import {useLernenden} from "../../stores/lernendeStore.ts";
import {useKurseLernende} from "../../stores/kursLernendeStore.ts";

const props = defineProps<{ addKursLernendeDialog: boolean }>();
const emit = defineEmits(['update:addKursLernendeDialog']);

const dialog = computed({
  get: () => props.addKursLernendeDialog,
  set: (value) => emit('update:addKursLernendeDialog', value),
});

const useKurseStore = useKurse();
const {getKurse} = storeToRefs(useKurseStore);

const useLernendenStore = useLernenden();
const {getLernenden} = storeToRefs(useLernendenStore);

const useKursLernendeStore = useKurseLernende()

interface kursLernende {
  fk_lernende: string,
  fk_kurs: string,
  role: string,
}

const kursLernende = ref<kursLernende>({
  fk_lernende: "",
  fk_kurs: "",
  role: "",
});

const url = import.meta.env.VITE_API_URL + "/kurse_lernende";
const {addSnackBar} = useSnackBar();

async function addKursLernende() {
  let errorInAddKursLernende = false;

  const {execute, error, data} = useFetch(url, {immediate: false}).post(kursLernende.value).json();

  await execute();

  if (error.value) {
    addSnackBar('error', `Fehler beim hinzufügen von Kurs zu Lernende.`);
    errorInAddKursLernende = true;
  } else if (data.value && data.value["status"] === "error") {
    addSnackBar('error', `Fehler beim hinzufügen von Kurs zu Lernende.`);
    errorInAddKursLernende = true;
  }

  if (!errorInAddKursLernende) {
    addSnackBar('success', 'Kurs zu Lernende erfolgreich hinzugefügt.');
  }

  await useKursLernendeStore.execute();

  dialog.value = false;

  kursLernende.value = {
    fk_lernende: "",
    fk_kurs: "",
    role: "",
  };
}
</script>

