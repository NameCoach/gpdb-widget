import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";
import autoprefixer from "autoprefixer";
import image from "@rollup/plugin-image";

import packageJson from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    image(),
    postcss({
      modules: true,
      plugins: [postcssUrl({ url: "inline" }), autoprefixer()],
    }),
  ],
};
