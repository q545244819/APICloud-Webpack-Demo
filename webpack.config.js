const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const glob = require('glob')

const paths = {}
const configs = []
const setPath = (item, type) => {
  const dirname = path.dirname(item)
  
  if (paths[dirname]) {
    paths[dirname][type] = item
  } else {
    paths[dirname] = {
      [type]: item
    }
  }
}

glob.sync('./src/**/*.js', { ignore: './src/script/*.js' }).forEach(item => setPath(item, 'script'))
glob.sync('./src/**/*.html').forEach(item => setPath(item, 'html'))

Object.keys(paths).forEach(key => {
  const distName = key.replace('src', 'dist')

  configs.push({
    entry: paths[key].script,
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, distName)
    },
    devtool: process.env.NODE_ENV === 'production' ? 'inline-source-map' : '#source-map',
    devServer: {
      host: '0.0.0.0',
      port: 8080,
      historyApiFallback: false,
      noInfo: true
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: "eslint-loader",
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    plugins: [].concat(
      [
        new HtmlWebpackPlugin({
          inlineSource: '.(js|css)$',
          template: paths[key].html
        })
      ],
      process.env.NODE_ENV === 'production' ? [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            warnings: false
          }
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
        new HtmlWebpackInlineSourcePlugin(),
      ] : []
    )
  })
})

module.exports = configs