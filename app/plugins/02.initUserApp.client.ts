export default defineNuxtPlugin(async () => {
  await useTgWebAppStore().init()
})
