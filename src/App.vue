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
    </v-layout>
  </v-container>
</template>

<script setup lang="ts">
import SideBar from "./components/SideBar.vue";
</script>