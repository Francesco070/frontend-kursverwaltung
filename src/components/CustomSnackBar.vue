<template>
  <v-snackbar
      v-for="snackbar in getSnackBars"
      :key="snackbar.id"
      v-model="snackbar.show"
      :color="getColor(snackbar.type)"
      :timeout="5000"
      class="mb-2"
      location="bottom"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn
          variant="text"
          icon="mdi-close"
          @click="removeSnackBar(snackbar.id)"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {useSnackBar} from "../stores/snackBarStore";

const {getSnackBars, removeSnackBar} = useSnackBar();

function getColor(type: 'error' | 'success' | 'warning'): string {
  switch (type) {
    case "error":
      return "error";
    case "success":
      return "success";
    case "warning":
      return "warning";
    default:
      return "info";
  }
}
</script>
