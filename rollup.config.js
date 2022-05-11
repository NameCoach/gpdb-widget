import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";
import autoprefixer from "autoprefixer";
import image from "@rollup/plugin-image";
import simplevars from "postcss-simple-vars";
import packageJson from "./package.json";
import variables from "./src/ui/styles/variables/all.ts";

const modules = process.platform === "win32" ? { root: "." } : true;

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
      extensions: [".css"],
      modules: modules,
      plugins: [
        postcssUrl({ url: "inline" }),
        autoprefixer(),
        simplevars({
          variables,
        }),
      ],
    }),
  ],
};
