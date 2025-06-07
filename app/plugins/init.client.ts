export default defineNuxtPlugin(async () => {
  await useTgWebAppStore().init()
  await useAppStore().init()
})
