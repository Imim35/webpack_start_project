const path = require('path');
const HtmlWebpackPlagin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const CSSMQPackerPlugin = require ('css-mqpacker-webpack-plugin');  

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev


const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const optimization = () => {
  const config = {
    splitChunks:{
      chunks: 'all',
    }
  }
  if(isProd){
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new CSSMQPackerPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}
const cssLoader = extra=>{
  const loader = [          
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      },
    },
    { loader: 'css-loader' },
    { loader: 'postcss-loader',
      options: {
        postcssOptions:{
          plugins: [
            require('autoprefixer')
          ]
        }
      }
    },
  ]
  if(extra){
    loader.push(extra)
  }
  return loader
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ],
  }
  if(preset){
    opts.presets.push(preset)
  }
  return opts
}
const jsLoaders = () => {
  const loader = [{
    loader: 'babel-loader',
    options: babelOptions()
  }]

  if(isDev){
    loader.push('eslint-loader')
  }

  return loader
}
const plugins = () => {
  const base = [
    new HtmlWebpackPlagin({
      template: './html/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
          {
              from: path.resolve(__dirname, 'src/static/favicon.ico'),
              to: path.resolve(__dirname, 'dist/static/')
          },
          {
              from: path.resolve(__dirname, './README.md'),
              to: path.resolve(__dirname, 'dist')
          }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    })
  ]

  if(isProd){
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}
module.exports = {
  context: path.resolve(__dirname,'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill' ,'./index.js'],
    // analytics: './analytics.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src')
    }

  },
  optimization:optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test : /\.css$/,
        use: cssLoader() 
      },
      {
        test : /\.less$/,
        use: cssLoader('less-loader')
      },
      {
        test : /\.(sass|scss)$/,
        use: cssLoader('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|webp|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              limit: 8192,
              esModule: false,
              outputPath: 'img/',
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: jsLoaders()
      },
      {
        test: /\.ts$/, 
        exclude: /node_modules/, 
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        } 
      },
      {
        test: /\.jsx$/, 
        exclude: /node_modules/, 
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        } 
      },
    ]
  }
};