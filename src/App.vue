<template>
  <v-container>
    <v-layout>
      <SideBar></SideBar>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-layout>
  </v-container>
</template>
<script setup lang="ts">
import SideBar from "./components/SideBar.vue";
</script>