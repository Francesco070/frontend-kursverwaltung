<template>
  <v-card>
    <v-card-title>
      <h1>Home</h1>
    </v-card-title>
    <v-card-text>
      <div v-html="content" :class="isDarkMode ? 'markdown-body-dark' : 'markdown-body-light'"></div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useTheme} from 'vuetify';
import {useFetch} from '@vueuse/core';
import {marked} from 'marked';

const theme = useTheme();
const isDarkMode = computed(() => theme.global.current.value.dark);

const {data} = useFetch('/doc/docFile.md').get();

const content = computed(() => {
  return (typeof data.value === 'string') ? marked(data.value) : "";
})
</script>

<style>
.markdown-body-dark {
  background-color: #1e1e2e;
  color: #cdd6f4;
  font-family: Arial, sans-serif;
  line-height: 1.8;
  font-size: 1.1rem;
  padding: 0 1.5rem;
  border-radius: 0.5rem;
}

.markdown-body-dark h1,
.markdown-body-dark h2,
.markdown-body-dark h3,
.markdown-body-dark h4 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-body-dark h1 {
  color: #cba6f7;
  font-size: 2.5rem;
}

.markdown-body-dark h2 {
  color: #cba6f7;
  font-size: 2rem;
}

.markdown-body-dark h3 {
  color: #fab387;
  font-size: 1.75rem;
}

.markdown-body-dark h4 {
  color: #a6e3a1;
  font-size: 1.75rem;
}

.markdown-body-dark ul {
  list-style: disc;
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.markdown-body-dark ol {
  list-style: decimal;
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.markdown-body-dark li {
  margin-bottom: 0.5rem;
}

.markdown-body-dark table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 1rem;
  color: #cdd6f4;
  border-radius: 1.25rem;
  border: transparent solid 3px;
  overflow: hidden;
}

.markdown-body-dark th,
.markdown-body-dark td {
  border: 1px solid #333;
  padding: 0.5rem;
  text-align: left;
}

.markdown-body-dark th {
  background-color: #3b3054;
  color: #fab387;
}

.markdown-body-dark td {
  background-color: #181825;
}

.markdown-body-dark strong {
  color: #cba6f7;
  font-weight: bold;
}

.markdown-body-dark em {
  color: #89dceb;
  font-style: italic;
}

.markdown-body-dark input[type='checkbox'] {
  margin-right: 0.5rem;
}

.markdown-body-dark blockquote {
  border-left: 4px solid #fab387;
  color: #f9e2af;
  background-color: #181825;
  padding: 1rem;
  margin: 1rem;
  border-radius: 1.25rem;
  font-style: italic;
}

.markdown-body-dark code {
  background-color: #181825;
  color: #f38ba8;
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
}

.markdown-body-dark pre {
  background-color: #181825;
  color: #f5e0dc;
  padding: 1rem;
  margin: 1rem;
  border-radius: 1.25rem;
  overflow-x: auto;
}

.markdown-body-dark hr {
  border: 0;
  height: 1px;
  background-color: #cba6f7;
  margin: 1rem 0;
}

.markdown-body-light {
  background-color: #f3ede9;
  color: #4c4f69;
  font-family: Arial, sans-serif;
  line-height: 1.8;
  font-size: 1.1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.markdown-body-light h1,
.markdown-body-light h2,
.markdown-body-light h3,
.markdown-body-light h4 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-body-light h1 {
  color: #7287fd;
  font-size: 2.5rem;
}

.markdown-body-light h2 {
  color: #7287fd;
  font-size: 2rem;
}

.markdown-body-light h3 {
  color: #fe640b;
  font-size: 1.75rem;
}

.markdown-body-light h4 {
  color: #40a02b;
  font-size: 1.75rem;
}

.markdown-body-light ul {
  list-style: disc;
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.markdown-body-light ol {
  list-style: decimal;
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.markdown-body-light li {
  margin-bottom: 0.5rem;
}

.markdown-body-light table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 1rem;
  color: #4c4f69;
  border-radius: 1.25rem;
  border: transparent solid 3px;
  overflow: hidden;
}

.markdown-body-light th,
.markdown-body-light td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.markdown-body-light th {
  background-color: #7b503f;
  color: #7287fd;
}

.markdown-body-light td {
  background-color: #f3dbc9;
}

.markdown-body-light strong {
  color: #7287fd;
  font-weight: bold;
}

.markdown-body-light em {
  color: #04a5e5;
  font-style: italic;
}

.markdown-body-light input[type='checkbox'] {
  margin-right: 0.5rem;
}


.markdown-body-light code {
  background-color: #f3dbc9;
  color: #7287fd;
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
}

.markdown-body-light pre {
  background-color: #f3dbc9;
  color: #7287fd;
  padding: 1rem;
  margin: 1rem;
  border-radius: 1.25rem;
  overflow-x: auto;
}

.markdown-body-light blockquote {
  border-left: 4px solid #df8e1d;
  color: #df8e1d;
  background-color: #f3dbc9;
  padding: 1rem;
  margin: 1rem;
  border-radius: 1.25rem;
  font-style: italic;
}

.markdown-body-light hr {
  border: 0;
  height: 1px;
  background-color: #7287fd;
  margin: 1rem 0;
}
</style>
