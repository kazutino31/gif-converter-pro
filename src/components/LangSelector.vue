<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const languages = [
  { code: 'ja', name: '日本語' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' }
];

const changeLang = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  locale.value = target.value;
  localStorage.setItem('gifConverter_lang', target.value);
};
</script>

<template>
  <div class="language-selector">
    <select :value="locale" @change="changeLang" aria-label="Language selection">
      <option v-for="lang in languages" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>
