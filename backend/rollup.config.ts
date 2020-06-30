import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const IS_PROD = process.env.TARGET_ENV && process.env.TARGET_ENV === 'prod';

const EXTERNALS = [
    'events',
    'path',
    'url',
    'http',
    'net',
    'buffer',
    'crypto',
    'fs',
    'querystring',
    'os',
    'tty',
    'util',
    'stream',
    'zlib',
    'string_decoder'
];

export default {
    input: `src/main.ts`,
    output: [{ file: '../dist/main.js', name: 'server', format: 'cjs' }],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: EXTERNALS,
    watch: {
        include: ['./src/**', './modules/**']
    },
    // @ts-ignore
    onwarn: (warning, warn) => {
        if (warning.code === 'EVAL') {
            // suppress eval warnings
            return;
        }
        warn(warning);
    },
    plugins: [
        json(), // Allow json resolution
        typescript({
            tsconfig: './tsconfig.json',
            include: ['./src/**/*.ts', './modules/**/*.ts', '../shared/**/*.ts']
        }), // Compile TypeScript files
        commonjs(),
        resolve(),
        IS_PROD ? terser() : null
    ]
};
