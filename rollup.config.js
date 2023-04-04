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
import json from "@rollup/plugin-json";
import svgr from "@svgr/rollup";
import md5 from "md5";

const modules =
  process.platform === "win32"
    ? { root: "." }
    : {
        generateScopedName: `[name]__[local]___[hash:base64:5]__[${md5(
          Date.now()
        )}]`,
      };

export default {
  input: "src/index.tsx",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    image(),
    svgr(),
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
    json(),
  ],
};
