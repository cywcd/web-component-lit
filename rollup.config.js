import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { readdirSync, statSync } from 'node:fs';
import { resolve, extname, relative } from 'node:path';
import copy from 'rollup-plugin-copy';
import svg from 'rollup-plugin-svg';

const inputDir = resolve('src/components');
const esmOutputDir = resolve('lib/esm');
const umdOutputDir = resolve('lib/umd');

function getAllTsFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  list.forEach((file) => {
    file = resolve(dir, file);
    const stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTsFiles(file));
    } else if (extname(file) === '.ts' && !file.endsWith('.d.ts')) {
      results.push(file);
    }
  });
  return results;
}

const inputFiles = getAllTsFiles(inputDir);

console.log('Found TypeScript files:', inputFiles);

export default [
  // ESM 格式配置
  {
    input: 'src/components/index.ts',
    output: {
      dir: esmOutputDir,
      format: 'esm',
      sourcemap: true,
      entryFileNames: ({ facadeModuleId }) => {
        const relativePath = relative(inputDir, facadeModuleId).replace(/\\/g, '/');
        return `${relativePath.replace(/[^/]*$/, '[name].js')}`;
      },
      chunkFileNames: '[name].bundled.js',
    },
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      clear({
        targets: ['lib'],
        watch: true,
      }),
      copy({
        targets: [
          { src: 'src/components/iconfont/**/*', dest: 'lib/esm/iconfont' },
        ]
      }),
      svg(),
      replace({ preventAssignment: false, 'Reflect.decorate': 'undefined' }),
      nodeResolve(),
      typescript({
        sourceMap: true,
        outDir: esmOutputDir,
      }),
      terser({
        ecma: 2021,
        module: true,
        warnings: true,
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
      }),
    ],
    watch: {
      include: 'src/*',
    }
  },
  // UMD 格式配置
  {
    // 单个入口文件，确保没有代码拆分
    input: 'src/components/index.ts',
    output: {
      dir: umdOutputDir,
      format: 'umd',
      name: 'yss-lit-web-component',
      sourcemap: true,
      entryFileNames: '[name].umd.js',
      exports: 'named', // 仅使用命名导出
    },
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      clear({
        targets: [umdOutputDir],
        watch: true,
      }),
      svg(),
      replace({ preventAssignment: false, 'Reflect.decorate': 'undefined' }),
      nodeResolve(),
      typescript({
        sourceMap: true,
        outDir: umdOutputDir,
      }),
      terser({
        ecma: 2021,
        module: true,
        warnings: true,
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
      }),
    ],
  },
];
