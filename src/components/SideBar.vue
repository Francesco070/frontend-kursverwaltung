<template>
  <v-navigation-drawer expand-on-hover rail rounded="0">
    <v-list density="compact" nav>
      <v-list-item to="/" prepend-icon="mdi-home" title="Home" value="home"></v-list-item>

      <v-divider></v-divider>

      <v-list-item to="/dozenten" prepend-icon="mdi-account-tie" title="Dozenten" value="dozenten"></v-list-item>
      <v-list-item to="/kurse" prepend-icon="mdi-book-alphabet" title="Kurse" value="kurse"></v-list-item>
      <v-list-item to="/laender" prepend-icon="mdi-flag" title="Länder" value="laender"></v-list-item>
      <v-list-item to="/lehrbetriebe" prepend-icon="mdi-office-building" title="Lehrbetriebe" value="lehrbetriebe"></v-list-item>
      <v-list-item to="/lernende" prepend-icon="mdi-account-school" title="Lernende" value="lernende"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
</script>