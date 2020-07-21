const path = require('path');
const HtmlWebpackPlagin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')


const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev


const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const optimization = () => {
  const config = {
    splitChunks:{
      chunks: 'all'
    }
  }
  if(isProd){
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}


module.exports = {
  context: path.resolve(__dirname,'src'),
  mode: 'development',
  entry: {
    main: './index.js',
    analytics: './analytics.js'
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
  plugins:[
    new HtmlWebpackPlagin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
          {
              from: path.resolve(__dirname, 'src/favicon.ico'),
              to: path.resolve(__dirname, 'dist')
          }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test : /\.css$/,
        use: [          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            },
          },
          'css-loader']
      },
      {
        test : /\.less$/,
        use: [          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            },
          },
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|svg|webp|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      }
    ]
  }
};