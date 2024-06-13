// // If you want to use other PostCSS plugins, see the following:
// // https://tailwindcss.com/docs/using-with-preprocessors

// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };
module.exports = {
  plugins: [require("tailwindcss")(), require("autoprefixer")()],
};
