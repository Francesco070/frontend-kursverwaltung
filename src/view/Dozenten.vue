<template>
  <v-card>
    <v-card-title>
      <h1>Dozenten</h1>
    </v-card-title>
    <v-card-actions>
    </v-card-actions>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field density="compact" label="Search" v-model="search" clearable></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" append-icon="mdi-filter" @click="showFilters = !showFilters">Filter</v-btn>
        </v-col>
      </v-row>

      <v-expand-transition>
        <v-row v-if="showFilters">
          <v-col v-for="headerItem in header" :key="headerItem.value" cols="3">
            <v-checkbox
                color="primary"
                v-model="activeFilters"
                :label="headerItem.title"
                :value="headerItem.value"
                dense
            />
          </v-col>
        </v-row>
      </v-expand-transition>

      <v-expand-transition>
        <v-row>
          <v-col>
            <v-btn class="rounded-s-xl" rounded="0" color="primary" icon="mdi-plus">
            </v-btn>
            <v-btn rounded="0" :disabled="selected.length !== 1" color="primary" icon="mdi-pencil">
            </v-btn>
            <v-btn rounded="0" @click="deleteDozenten()" :disabled="selected.length > 1" class="rounded-e-xl"
                   color="primary"
                   icon="mdi-delete">
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>

      <v-row>
        <v-col>
          <v-data-table
              class="mt-4"
              mobile-breakpoint="lg"
              v-model="selected"
              :headers="filteredHeader"
              :items="dozenten"
              item-value="id_dozent"
              show-select
              :search="search"
              :loading="loading"
              hover
              :mobile="isMobile"
              :sort-by="[{ key: 'id_dozent', order: 'asc' }]"
          ></v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useFetch} from "@vueuse/core";
import {useDisplay} from "vuetify";
import {useSnackBar} from "../stores/snackBarStore.ts";

const search = ref<string>("");

const {lgAndUp} = useDisplay();
const isMobile = computed(() => !lgAndUp.value);

const selected = ref([]);
const showFilters = ref(false);
const activeFilters = ref<string[]>(["id_dozent", "vorname", "nachname", "email"]);

const header = ref([
  {title: "Id", value: "id_dozent"},
  {title: "Vorname", value: "vorname"},
  {title: "Nachname", value: "nachname"},
  {title: "Strasse", value: "strasse"},
  {title: "PLZ", value: "plz"},
  {title: "Ort", value: "ort"},
  {title: "Land", value: "country"},
  {title: "Geschlecht", value: "geschlecht"},
  {title: "Telefon", value: "telefon"},
  {title: "Handy", value: "handy"},
  {title: "Email", value: "email"},
  {title: "Birthdate", value: "birthdate"},
]);

const url = import.meta.env.VITE_API_URL + "/dozenten";
const {data, isFetching: loading, execute: getDozenten} = useFetch(url).get().json();


const dozenten = computed(() => (data.value && !loading.value) ? data?.value["data"] : []);

const filteredHeader = computed(() => header.value.filter(item => activeFilters.value.includes(item.value)));

const {addSnackBar} = useSnackBar();


async function deleteDozenten() {
  if (selected.value.length === 0) return;

  let errorInDeleteDozenten = false;

  for (const selectedId of selected.value) {
    const {execute, error, data} = useFetch(`${url}/${selectedId}`, {immediate: false}).delete().json();

    await execute();

    if (error.value) {
      addSnackBar('error', `Fehler beim Löschen von Dozent ${selectedId}`);
      errorInDeleteDozenten = true;
    } else if (data.value && data.value["status"] === "error") {
      addSnackBar('error', `Fehler beim Löschen von Dozent ${selectedId}: ${data.value["message"]}`);
      errorInDeleteDozenten = true;
    }
  }

  if (!errorInDeleteDozenten) {
    addSnackBar('success', 'Dozenten erfolgreich gelöscht.');
  }

  selected.value = [];
  await getDozenten();
}

</script>
