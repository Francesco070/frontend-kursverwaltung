<template>
  <v-card>
    <v-card-title>
      <h1>Lehrbetrieb zu Lernende</h1>
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
                   @click="AddLehrbetriebLernendeDialog = true">
            </v-btn>
            <v-btn rounded="0" :disabled="selected.length !== 1" color="primary" icon="mdi-pencil"
                   @click="EditLehrbetriebLernendeDialog = true">
            </v-btn>
            <v-btn rounded="0" @click="deleteLehrbetriebLernende()" :disabled="selected.length === 0"
                   class="rounded-e-xl"
                   color="primary"
                   icon="mdi-delete">
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>

      <AddLehrbetriebLernende :addLehrbetriebLernendeDialog="AddLehrbetriebLernendeDialog"
                              @update:addLehrbetriebLernendeDialog="AddLehrbetriebLernendeDialog = $event"/>
      <EditLehrbetriebLernende v-if="selected.length === 1"
                               :lehrbetriebLernendeId="selected[0]"
                               :editLehrbetriebLernendeDialog="EditLehrbetriebLernendeDialog"
                               @update:editLehrbetriebLernendeDialog="EditLehrbetriebLernendeDialog = $event"/>


      <v-row>
        <v-col>
          <v-data-table
              class="mt-4"
              mobile-breakpoint="lg"
              v-model="selected"
              :headers="filteredHeader"
              :items="getLehrbetriebLernende"
              item-value="id_lehrbetrieb_lernende"
              show-select
              :search="search"
              :loading="useLehrbetriebLernendeStore.loading"
              hover
              :mobile="isMobile"
              :sort-by="[{ key: 'firma', order: 'asc' }]"
          >
            <template v-slot:item.lernende="{ item }">
              <v-chip v-if="item.lernende" color="secondary" class="ma-1">{{ item.lernende }}</v-chip>
            </template>
            <template v-slot:item.firma="{ item }">
              <v-chip v-if="item.firma" color="secondary" class="ma-1">{{ item.firma }}</v-chip>
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
import {useLehrbetriebLernende} from "../stores/lehrbetriebLernendeStore.ts";
import AddLehrbetriebLernende from "../components/lehrbetriebLernende/AddLehrbetriebLernende.vue";
import EditLehrbetriebLernende from "../components/lehrbetriebLernende/EditLehrbetriebLernende.vue";

const search = ref<string>("");

const AddLehrbetriebLernendeDialog = ref<boolean>(false)
const EditLehrbetriebLernendeDialog = ref<boolean>(false)

const {lgAndUp} = useDisplay();
const isMobile = computed(() => !lgAndUp.value);

const selected = ref([]);
const showFilters = ref(false);
const activeFilters = ref<string[]>(["id_lehrbetrieb_lernende", "lernende", "firma", "beruf"]);

const header = ref([
  {title: "Id", value: "id_lehrbetrieb_lernende"},
  {title: "Lernende", value: "lernende"},
  {title: "Lehrbetrieb", value: "firma"},
  {title: "Start", value: "start"},
  {title: "Ende ", value: "ende"},
  {title: "Beruf ", value: "beruf"},
]);

const url = import.meta.env.VITE_API_URL + "/lehrbetrieb_lernende";

const useLehrbetriebLernendeStore = useLehrbetriebLernende()
const {getLehrbetriebLernende} = storeToRefs(useLehrbetriebLernendeStore)

const filteredHeader = computed(() => header.value.filter(item => activeFilters.value.includes(item.value)));

const {addSnackBar} = useSnackBar();


async function deleteLehrbetriebLernende() {
  if (selected.value.length === 0) return;

  let errorInDeleteLehrbetriebLernende = false;

  for (const selectedId of selected.value) {
    const {execute, error, data} = useFetch(`${url}/${selectedId}`, {immediate: false}).delete().json();

    await execute();

    if (error.value) {
      addSnackBar('error', `Fehler beim löschen von Lehrbetrieb zu Lernende ${selectedId}`);
      errorInDeleteLehrbetriebLernende = true;
    } else if (data.value && data.value["status"] === "error") {
      addSnackBar('error', `Fehler beim löschen von Lehrbetrieb zu Lernende ${selectedId}: ${data.value["message"]}`);
      errorInDeleteLehrbetriebLernende = true;
    }
  }

  if (!errorInDeleteLehrbetriebLernende) {
    addSnackBar('success', 'Lehrbetrieb zu Lernenden erfolgreich gelöscht.');
  }

  selected.value = [];
  await useLehrbetriebLernendeStore.execute();
}

</script>
