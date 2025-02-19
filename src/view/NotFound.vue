<template>
  <v-card rounded="0" class="d-flex align-center fill-height">
    <v-empty-state
        icon="mdi-map-marker-alert"
        class="w-100"
    >
      <template v-slot:headline>
        <div class="text-h4 mb-4">
          404 Not Found
        </div>
      </template>

      <template v-slot:title>
        <div class="text-medium-emphasis text-body-1 mb-4">
          Oops! The page you're looking for doesn't exist. Beat this game to continue.
        </div>
      </template>

      <template v-slot:text>
        <iframe
            v-if="isMounted"
            src="https://wayou.github.io/t-rex-runner"
            frameborder="0"
            scrolling="no"
            width="100%"
            height="100%"
            loading="lazy"
        ></iframe>
      </template>
    </v-empty-state>
  </v-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<style>
iframe {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
</style>