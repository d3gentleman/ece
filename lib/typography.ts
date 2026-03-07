import plugin from "tailwindcss/plugin";

export default plugin(
  function ({ addComponents }) {
    addComponents({
      ".prose": {
        maxWidth: "65ch",
        color: "var(--tw-prose-body)",
        lineHeight: "1.75",
        "h1, h2, h3, h4, h5, h6": {
          color: "var(--tw-prose-headings)",
          fontWeight: "700",
        },
        a: {
          color: "var(--tw-prose-links)",
          textDecoration: "underline",
          fontWeight: "500",
        },
      },
    });
  },
  {
    theme: {
      extend: {
        typography: (theme: any) => ({
          DEFAULT: {
            css: {
              color: theme('colors.zinc.400'),
              h1: { color: theme('colors.white') },
              h2: { color: theme('colors.white') },
              h3: { color: theme('colors.white') },
              strong: { color: theme('colors.white') },
              a: {
                color: theme('colors.indigo.400'),
                '&:hover': {
                  color: theme('colors.indigo.300'),
                },
              },
            },
          },
        }),
      },
    },
  }
);
