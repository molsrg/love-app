export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: false,
    duration: 2000,
  },
  theme: {
    radius: 0.25,
  },
  ui: {
    colors: {
      primary: 'rose',
      neutral: 'zinc',
      lime: 'lime',
      rose: 'rose',
      gray: 'gray',
      stone: 'stone',
      cyan: 'cyan',
      black: 'black',
      indigo: 'indigo',
      orange: 'orange',
      amber: 'amber',
      blue: 'blue',
      emerald: 'emerald',
    },
    modal: {
      slots: {
        footer: 'justify-end',
      },
    },
    slideover: {
      slots: {
        footer: 'justify-end',
      },
    },
  },
})
