<template>
  <v-card>
    <v-card-title>
      <h1>Länder</h1>
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
            <v-btn class="rounded-s-xl" rounded="0" color="primary" icon="mdi-plus" @click="AddLandDialog = true">
            </v-btn>
            <v-btn rounded="0" :disabled="selected.length !== 1" color="primary" icon="mdi-pencil"
                   @click="EditLandDialog = true">
            </v-btn>
            <v-btn rounded="0" @click="deleteLeander()" :disabled="selected.length === 0" class="rounded-e-xl"
                   color="primary"
                   icon="mdi-delete">
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>

      <AddLaender :addLandDialog="AddLandDialog" @update:addLandDialog="AddLandDialog = $event"/>
      <EditLaender v-if="selected.length === 1"
                   :landId="selected[0]"
                   :editLandDialog="EditLandDialog"
                   @update:editLandDialog="EditLandDialog = $event"/>


      <v-row>
        <v-col>
          <v-data-table
              class="mt-4"
              mobile-breakpoint="lg"
              v-model="selected"
              :headers="filteredHeader"
              :items="getLaender"
              item-value="id_countries"
              show-select
              :search="search"
              :loading="useLaenderStore.loading"
              hover
              :mobile="isMobile"
              :sort-by="[{ key: 'id_countries', order: 'asc' }]"
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
import AddLaender from "../components/laender/AddLaender.vue";
import EditLaender from "../components/laender/EditLaender.vue";
import {useLaender} from "../stores/laenderStore.ts";

const search = ref<string>("");

const AddLandDialog = ref<boolean>(false)
const EditLandDialog = ref<boolean>(false)

const {lgAndUp} = useDisplay();
const isMobile = computed(() => !lgAndUp.value);

const selected = ref([]);
const showFilters = ref(false);
const activeFilters = ref<string[]>(["id_countries", "country"]);

const header = ref([
  {title: "Id", value: "id_countries"},
  {title: "Land", value: "country"},
]);

const url = import.meta.env.VITE_API_URL + "/laender";

const useLaenderStore = useLaender()
const {getLaender} = storeToRefs(useLaenderStore)

const filteredHeader = computed(() => header.value.filter(item => activeFilters.value.includes(item.value)));

const {addSnackBar} = useSnackBar();


async function deleteLeander() {
  if (selected.value.length === 0) return;

  let errorInDeleteLaender = false;

  for (const selectedId of selected.value) {
    const {execute, error, data} = useFetch(`${url}/${selectedId}`, {immediate: false}).delete().json();

    await execute();

    if (error.value) {
      addSnackBar('error', `Fehler beim löschen von Land ${selectedId}`);
      errorInDeleteLaender = true;
    } else if (data.value && data.value["status"] === "error") {
      addSnackBar('error', `Fehler beim löschen von Land ${selectedId}: ${data.value["message"]}`);
      errorInDeleteLaender = true;
    }
  }

  if (!errorInDeleteLaender) {
    addSnackBar('success', 'Länder erfolgreich gelöscht.');
  }

  selected.value = [];
  await useLaenderStore.execute();
}

</script>
