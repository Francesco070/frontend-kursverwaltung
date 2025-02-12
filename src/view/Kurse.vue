<template>
  <v-card>
    <v-card-title>
      <h1>Kurse</h1>
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
            <v-btn class="rounded-s-xl" rounded="0" color="primary" icon="mdi-plus" @click="AddKursDialog = true">
            </v-btn>
            <v-btn rounded="0" :disabled="selected.length !== 1" color="primary" icon="mdi-pencil"
                   @click="EditKursDialog = true">
            </v-btn>
            <v-btn rounded="0" @click="deleteKurse()" :disabled="selected.length === 0" class="rounded-e-xl"
                   color="primary"
                   icon="mdi-delete">
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>

      <AddKurse :addKursDialog="AddKursDialog" @update:addKursDialog="AddKursDialog = $event"/>
      <EditKurse v-if="selected.length === 1"
                 :kurseId="selected[0]"
                 :editKursDialog="EditKursDialog"
                 @update:editKursDialog="EditKursDialog = $event"/>


      <v-row>
        <v-col>
          <v-data-table
              class="mt-4"
              mobile-breakpoint="lg"
              v-model="selected"
              :headers="filteredHeader"
              :items="getKurse"
              item-value="id_kurs"
              show-select
              :search="search"
              :loading="useKurseStore.loading"
              hover
              :mobile="isMobile"
              :sort-by="[{ key: 'id_kurs', order: 'asc' }]"
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
import {storeToRefs} from "pinia";
import {useKurse} from "../stores/kurseStore.ts";
import AddKurse from "../components/kurse/AddKurse.vue";
import EditKurse from "../components/kurse/EditKurse.vue";

const search = ref<string>("");

const AddKursDialog = ref<boolean>(false)
const EditKursDialog = ref<boolean>(false)

const {lgAndUp} = useDisplay();
const isMobile = computed(() => !lgAndUp.value);

const selected = ref([]);
const showFilters = ref(false);
const activeFilters = ref<string[]>(["id_kurs", "kursnummer", "kursthema", "dozent"]);

const header = ref([
  {title: "Id", value: "id_kurs"},
  {title: "Kursnummer", value: "kursnummer"},
  {title: "Kursthema", value: "kursthema"},
  {title: "Inhalt", value: "inhalt"},
  {title: "Dozent", value: "dozent"},
  {title: "Dauer", value: "dauer"},
  {title: "Startdatum", value: "startdatum"},
  {title: "Enddatum", value: "enddatum"},
]);

const url = import.meta.env.VITE_API_URL + "/kurse";

const useKurseStore = useKurse()
const {getKurse} = storeToRefs(useKurseStore)

const filteredHeader = computed(() => header.value.filter(item => activeFilters.value.includes(item.value)));

const {addSnackBar} = useSnackBar();


async function deleteKurse() {
  if (selected.value.length === 0) return;

  let errorInDeleteKurse = false;

  for (const selectedId of selected.value) {
    const {execute, error, data} = useFetch(`${url}/${selectedId}`, {immediate: false}).delete().json();

    await execute();

    if (error.value) {
      addSnackBar('error', `Fehler beim löschen von Kurs ${selectedId}`);
      errorInDeleteKurse = true;
    } else if (data.value && data.value["status"] === "error") {
      addSnackBar('error', `Fehler beim löschen von Kurs ${selectedId}: ${data.value["message"]}`);
      errorInDeleteKurse = true;
    }
  }

  if (!errorInDeleteKurse) {
    addSnackBar('success', 'Kurse erfolgreich gelöscht.');
  }

  selected.value = [];
  await useKurseStore.execute();
}

</script>
