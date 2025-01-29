<template>
  <v-container>
    <v-layout>
      <SideBar></SideBar>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" md="10" lg="8" xl="6" xxl="5">
          <router-view></router-view>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <CustomSnackBar/>
    </v-layout>
  </v-container>
</template>

<script setup lang="ts">
import SideBar from "./components/SideBar.vue";
import {useTheme} from "vuetify";
import {computed, watch} from "vue";
import CustomSnackBar from "./components/CustomSnackBar.vue";


const theme = useTheme();
const isDarkMode = computed(() => theme.global.current.value.dark);

watch(isDarkMode, () => {
  if (isDarkMode.value) {
    document.body.classList.add("bg-dark");
    document.body.classList.remove("bg-light");
  } else {
    document.body.classList.add("bg-light");
    document.body.classList.remove("bg-dark");

  }
}, {immediate: true})
</script>
