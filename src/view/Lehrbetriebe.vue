<template>
  <v-card>
    <v-card-title>
      <h1>Lehrbetriebe</h1>
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
                   @click="AddLehrbetriebDialog = true">
            </v-btn>
            <v-btn rounded="0" :disabled="selected.length !== 1" color="primary" icon="mdi-pencil"
                   @click="EditLehrbetriebDialog = true">
            </v-btn>
            <v-btn rounded="0" @click="deleteLehrbetriebe()" :disabled="selected.length === 0" class="rounded-e-xl"
                   color="primary"
                   icon="mdi-delete">
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>

      <AddLehrbetriebe :addLehrbetriebDialog="AddLehrbetriebDialog"
                       @update:addLehrbetriebDialog="AddLehrbetriebDialog = $event"/>
      <EditLehrbetriebe v-if="selected.length === 1"
                        :lehrbetriebeId="selected[0]"
                        :editLehrbetriebDialog="EditLehrbetriebDialog"
                        @update:editLehrbetriebDialog="EditLehrbetriebDialog = $event"/>


      <v-row>
        <v-col>
          <v-data-table
              class="mt-4"
              mobile-breakpoint="lg"
              v-model="selected"
              :headers="filteredHeader"
              :items="getLehrbetriebe"
              item-value="id_lehrbetrieb"
              show-select
              :search="search"
              :loading="useLehrbetriebeStore.loading"
              hover
              :mobile="isMobile"
              :sort-by="[{ key: 'id_lehrbetrieb', order: 'asc' }]"
          >
            <template v-slot:item.lernende="{ item }">
              <v-chip color="secondary" v-for="lernende in item.lernende" :key="lernende.id_lernende" class="ma-1">
                {{ lernende.vorname }} {{ lernende.nachname }}
              </v-chip>
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
import {useLehrbetriebe} from "../stores/lehrbetriebeStore.ts";
import AddLehrbetriebe from "../components/lehrbetriebe/AddLehrbetriebe.vue";
import EditLehrbetriebe from "../components/lehrbetriebe/EditLehrbetriebe.vue";

const search = ref<string>("");

const AddLehrbetriebDialog = ref<boolean>(false)
const EditLehrbetriebDialog = ref<boolean>(false)

const {lgAndUp} = useDisplay();
const isMobile = computed(() => !lgAndUp.value);

const selected = ref([]);
const showFilters = ref(false);
const activeFilters = ref<string[]>(["id_lehrbetrieb", "firma", "strasse", "plz", "ort"]);

const header = ref([
  {title: "Id", value: "id_lehrbetrieb"},
  {title: "Firma", value: "firma"},
  {title: "Strasse", value: "strasse"},
  {title: "PLZ", value: "plz"},
  {title: "Ort", value: "ort"},
  {title: "Lernende", value: "lernende"},
]);

const url = import.meta.env.VITE_API_URL + "/lehrbetriebe";

const useLehrbetriebeStore = useLehrbetriebe()
const {getLehrbetriebe} = storeToRefs(useLehrbetriebeStore)

const filteredHeader = computed(() => header.value.filter(item => activeFilters.value.includes(item.value)));

const {addSnackBar} = useSnackBar();

async function deleteLehrbetriebe() {
  if (selected.value.length === 0) return;

  let errorInDeleteLehrbetriebe = false;

  for (const selectedId of selected.value) {
    const {execute, error, data} = useFetch(`${url}/${selectedId}`, {immediate: false}).delete().json();

    await execute();

    if (error.value) {
      addSnackBar('error', `Fehler beim löschen von Lehrbetrieb ${selectedId}`);
      errorInDeleteLehrbetriebe = true;
    } else if (data.value && data.value["status"] === "error") {
      addSnackBar('error', `Fehler beim löschen von Lehrbetrieb ${selectedId}: ${data.value["message"]}`);
      errorInDeleteLehrbetriebe = true;
    }
  }

  if (!errorInDeleteLehrbetriebe) {
    addSnackBar('success', 'Lehrbetriebe erfolgreich gelöscht.');
  }

  selected.value = [];
  await useLehrbetriebeStore.execute();
}

</script>
