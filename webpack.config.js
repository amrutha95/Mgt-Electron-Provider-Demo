const path = require('path');
module.exports = [
 {
   mode: 'development',
   entry: './src/renderer.ts',
   target: 'electron-renderer',
   module: {
     rules: [
       {
         test: /\.ts$/,
         include: [/src/],
         use: [{ loader: 'ts-loader' }]
       }
     ]
   },
   output: {
     path: __dirname + '/dist',
     filename: 'renderer.js',
     libraryTarget: 'umd'
   },
   resolve: {
     extensions: ['.ts', '.js'],
     modules: ['node_modules', path.resolve(__dirname + 'src')]
   }
 },
//  {
//    mode: 'development',
//    entry: './src/main.ts',
//    target: 'electron-main',
//    module: {
//      rules: [
//        {
//          test: /\.ts$/,
//          include: [/src/],
//          use: [{ loader: 'ts-loader' }]
//        }
//      ]
//    },
//    output: {
//      path: __dirname + '/dist',
//      filename: 'main.js'
//    },
//    resolve: {
//      extensions: ['.ts', '.js'],
//      modules: ['node_modules', path.resolve(__dirname + 'src')]
//    }
//  }
];