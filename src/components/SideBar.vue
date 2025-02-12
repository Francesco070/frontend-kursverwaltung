<template>
  <v-navigation-drawer expand-on-hover rail rounded="0">
    <div class="d-flex flex-column justify-center fill-height">
      <v-list nav>
        <v-list-item color="primary" to="/" prepend-icon="mdi-home" title="Home" value="home"></v-list-item>
        <v-list-item color="primary" to="/dozenten" prepend-icon="mdi-account-tie" title="Dozenten"
                     value="dozenten"></v-list-item>
        <v-list-item color="primary" to="/kurse" prepend-icon="mdi-book-alphabet" title="Kurse"
                     value="kurse"></v-list-item>
        <v-list-item color="primary" to="/laender" prepend-icon="mdi-flag" title="Länder" value="laender"></v-list-item>
        <v-list-item color="primary" to="/lehrbetriebe" prepend-icon="mdi-office-building" title="Lehrbetriebe"
                     value="lehrbetriebe"></v-list-item>
        <v-list-item color="primary" to="/lernende" prepend-icon="mdi-account-school" title="Lernende"
                     value="lernende"></v-list-item>
        <v-divider></v-divider>
        <v-list-item color="primary" to="/kurs-lernende" prepend-icon="mdi-clipboard-list"
                     title="Kurs zu Lernende"
                     value="kurs-lernende"></v-list-item>
        <v-list-item color="primary" to="/lehrbetrieb-lernende" prepend-icon="mdi-school"
                     title="Lehrbetrieb zu Lernende"
                     value="lehrbetrieb-lernende"></v-list-item>
      </v-list>
    </div>

    <template v-slot:append>
      <v-list nav>
        <v-list-item>
          <v-btn
              block
              :prepend-icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              @click="toggleTheme"
          >
          </v-btn>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {useTheme} from 'vuetify'

const theme = useTheme()

const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
}
</script>