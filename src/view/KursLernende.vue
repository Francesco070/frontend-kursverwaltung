<template>
  <v-card>
    <v-card-title>
      <h1>Kurs zu Lernende</h1>
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
            <v-btn class="rounded-s-xl" rounded="0" color="primary" icon="mdi-plus"
                   @click="AddKursLernendeDialog = true">
            </v-btn>
            <v-btn rounded="0" :disabled="selected.length !== 1" color="primary" icon="mdi-pencil"
                   @click="EditKursLernendeDialog = true">
            </v-btn>
            <v-btn rounded="0" @click="deleteKurseLernende()" :disabled="selected.length === 0" class="rounded-e-xl"
                   color="primary"
                   icon="mdi-delete">
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>

      <AddKursLernende :addKursLernendeDialog="AddKursLernendeDialog"
                       @update:addKursLernendeDialog="AddKursLernendeDialog = $event"/>
      <EditKursLernende v-if="selected.length === 1"
                        :kursLernendeId="selected[0]"
                        :editKursLernendeDialog="EditKursLernendeDialog"
                        @update:editKursLernendeDialog="EditKursLernendeDialog = $event"/>


      <v-row>
        <v-col>
          <v-data-table
              class="mt-4"
              mobile-breakpoint="lg"
              v-model="selected"
              :headers="filteredHeader"
              :items="getKurseLernende"
              item-value="id_kurs_lernende"
              show-select
              :search="search"
              :loading="useKursLernendeStore.loading"
              hover
              :mobile="isMobile"
              :sort-by="[{ key: 'id_kurs_lernende', order: 'asc' }]"
          >
            <template v-slot:item.lernende="{ item }">
              <v-chip v-if="item.lernende" color="secondary" class="ma-1">{{ item.lernende }}</v-chip>
            </template>
            <template v-slot:item.kursthema="{ item }">
              <v-chip v-if="item.kursthema" color="secondary" class="ma-1">{{ item.kursthema }}</v-chip>
            </template>
          </v-data-table>
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
import {useKurseLernende} from "../stores/kursLernendeStore.ts";
import AddKursLernende from "../components/kursLernende/AddKursLernende.vue";
import EditKursLernende from "../components/kursLernende/EditKursLernende.vue";

const search = ref<string>("");

const AddKursLernendeDialog = ref<boolean>(false)
const EditKursLernendeDialog = ref<boolean>(false)

const {lgAndUp} = useDisplay();
const isMobile = computed(() => !lgAndUp.value);

const selected = ref([]);
const showFilters = ref(false);
const activeFilters = ref<string[]>(["id_kurs_lernende", "lernende", "kursthema", "role"]);

const header = ref([
  {title: "Id", value: "id_kurs_lernende"},
  {title: "Lernende", value: "lernende"},
  {title: "Kurs", value: "kursthema"},
  {title: "Role", value: "role"},
]);

const url = import.meta.env.VITE_API_URL + "/kurse_lernende";

const useKursLernendeStore = useKurseLernende()
const {getKurseLernende} = storeToRefs(useKursLernendeStore)

const filteredHeader = computed(() => header.value.filter(item => activeFilters.value.includes(item.value)));

const {addSnackBar} = useSnackBar();


async function deleteKurseLernende() {
  if (selected.value.length === 0) return;

  let errorInDeleteKursLernende = false;

  for (const selectedId of selected.value) {
    const {execute, error, data} = useFetch(`${url}/${selectedId}`, {immediate: false}).delete().json();

    await execute();

    if (error.value) {
      addSnackBar('error', `Fehler beim löschen von Kurs zu Lernende ${selectedId}`);
      errorInDeleteKursLernende = true;
    } else if (data.value && data.value["status"] === "error") {
      addSnackBar('error', `Fehler beim löschen von Kurs zu Lernende ${selectedId}: ${data.value["message"]}`);
      errorInDeleteKursLernende = true;
    }
  }

  if (!errorInDeleteKursLernende) {
    addSnackBar('success', 'Kurse zu Lernenden erfolgreich gelöscht.');
  }

  selected.value = [];
  await useKursLernendeStore.execute();
}

</script>
