module.exports = {
  theme: {
    extend: {
      inset: {
        "-1": "-0.25rem",
        "-2": "-0.5rem",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.blue.400'),
                textDecoration: 'none',
              },
            },
            pre: {
              color: theme("colors.grey.1000"),
              backgroundColor: theme("colors.grey.100")
            },
            "pre code::before": {
              "padding-left": "unset"
            },
            "pre code::after": {
              "padding-right": "unset"
            },
            code: {
              backgroundColor: theme("colors.grey.100"),
              color: theme("colors.grey.400"),
              fontWeight: "400",
              "border-radius": "0.25rem"
            },
            "code::before": {
              content: '""',
              "padding-left": "0.25rem"
            },
            "code::after": {
              content: '""',
              "padding-right": "0.25rem"
            }
          },
        },
      })
    },
  },
  variants: {
    borderColor: ["responsive", "last", "hover", "focus"],
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
