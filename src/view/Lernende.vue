<template>
  <v-card>
    <v-card-title>
      <h1>Lernenden</h1>
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
                   @click="AddLernendeDialog = true">
            </v-btn>
            <v-btn rounded="0" :disabled="selected.length !== 1" color="primary" icon="mdi-pencil"
                   @click="EditLernendeDialog = true">
            </v-btn>
            <v-btn rounded="0" @click="deleteLernenden()" :disabled="selected.length === 0" class="rounded-e-xl"
                   color="primary"
                   icon="mdi-delete">
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>

      <AddLernenden :addLernendeDialog="AddLernendeDialog"
                    @update:addLernendeDialog="AddLernendeDialog = $event"/>
      <EditLernenden v-if="selected.length === 1"
                     :lernendenId="selected[0]"
                     :editLernendeDialog="EditLernendeDialog"
                     @update:editLernendeDialog="EditLernendeDialog = $event"/>


      <v-row>
        <v-col>
          <v-data-table
              class="mt-4"
              mobile-breakpoint="lg"
              v-model="selected"
              :headers="filteredHeader"
              :items="getLernenden"
              item-value="id_lernende"
              show-select
              :search="search"
              :loading="useLernendenStore.loading"
              hover
              :mobile="isMobile"
              :sort-by="[{ key: 'id_lernende', order: 'asc' }]"
          >
            <template v-slot:item.lehrbetriebe="{ item }">
              <v-chip color="secondary" v-for="lehrbetrieb in item.lehrbetriebe" :key="lehrbetrieb.id_lehrbetrieb"
                      class="ma-1">
                {{ lehrbetrieb.firma }}
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
import {useLernenden} from "../stores/lernendeStore.ts";
import AddLernenden from "../components/lernende/AddLernenden.vue";
import EditLernenden from "../components/lernende/EditLernenden.vue";

const search = ref<string>("");

const AddLernendeDialog = ref<boolean>(false)
const EditLernendeDialog = ref<boolean>(false)

const {lgAndUp} = useDisplay();
const isMobile = computed(() => !lgAndUp.value);

const selected = ref([]);
const showFilters = ref(false);
const activeFilters = ref<string[]>(["id_lernende", "vorname", "nachname", "handy", "lehrbetriebe"]);

const header = ref([
  {title: "Id", value: "id_lernende"},
  {title: "Vorname", value: "vorname"},
  {title: "Nachname", value: "nachname"},
  {title: "Strasse", value: "strasse"},
  {title: "PLZ", value: "plz"},
  {title: "Ort", value: "ort"},
  {title: "Land", value: "country"},
  {title: "Geschlecht", value: "geschlecht"},
  {title: "Handy", value: "handy"},
  {title: "Telefon", value: "telefon"},
  {title: "Email", value: "email"},
  {title: "Email Privat", value: "email_privat"},
  {title: "Geburtstag", value: "birthdate"},
  {title: "Lehrbetriebe", value: "lehrbetriebe"},
]);

const url = import.meta.env.VITE_API_URL + "/lernende";

const useLernendenStore = useLernenden()
const {getLernenden} = storeToRefs(useLernendenStore)

const filteredHeader = computed(() => header.value.filter(item => activeFilters.value.includes(item.value)));

const {addSnackBar} = useSnackBar();

async function deleteLernenden() {
  if (selected.value.length === 0) return;

  let errorInDeleteLernenden = false;

  for (const selectedId of selected.value) {
    const {execute, error, data} = useFetch(`${url}/${selectedId}`, {immediate: false}).delete().json();

    await execute();

    if (error.value) {
      addSnackBar('error', `Fehler beim löschen von Lernenden ${selectedId}`);
      errorInDeleteLernenden = true;
    } else if (data.value && data.value["status"] === "error") {
      addSnackBar('error', `Fehler beim löschen von Lernenden ${selectedId}: ${data.value["message"]}`);
      errorInDeleteLernenden = true;
    }
  }

  if (!errorInDeleteLernenden) {
    addSnackBar('success', 'Lernenden erfolgreich gelöscht.');
  }

  selected.value = [];
  await useLernendenStore.execute();
}

</script>
