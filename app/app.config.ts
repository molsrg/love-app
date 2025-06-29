export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 3000,
  },
  theme: {
    radius: 0.25,
    loading: '#FFFFFF',
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
    drawer: {
      slots: {
        content: 'p-2 pb-6',
        // body: 'p-4',
      },
    },
    avatar: {

      variants: {
        size: {
          '3xl': {
            root: 'size-15 text-2xl',
          },
        },
      },

    },
    // calendar: {
    //   slots: {
    //     root: 'bg-elevated/50 rounded-lg p-1',
    //     cell: 'p-2',
    //     cellTrigger: 'size-10 text-xs data-[selected]:text-[var(--ui-primary)] data-[selected]:bg-transparent data-today:not-data-[selected]:text-[var(--ui-primary)] hover:data-[selected]:bg-(--ui-primary)/20 data-unavailable:no-underline data-unavailable:text-(--ui-text-primary) data-unavailable:bg-(--ui-info)/20 data-today:data-[selected]:bg-(--ui-success)/20',
    //   },
    // },
  },
})
