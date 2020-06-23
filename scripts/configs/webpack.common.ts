import { Configuration } from 'webpack';
import { resolve } from 'path';
import WebpackBar from 'webpackbar';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { Options as HtmlMinifierOptions } from 'html-minifier';
import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin';
import { __DEV__, PROJECT_NAME, PROJECT_ROOT, HMR_PATH } from '../utils/constants';

function getCssLoaders(importLoaders: number, module = true) {
  return [
    __DEV__ ? 'style-loader' : MiniCssExtractLoader,
    {
      loader: 'css-loader',
      options: {
        modules: module,
        // 前面使用的每一个 loader 都需要指定 sourceMap 选项
        sourceMap: true,
        // 指定在 css-loader 前应用的 loader 的数量
        importLoaders
      }
    },
    {
      loader: 'postcss-loader',
      options: { sourceMap: true }
    }
  ];
}

const htmlMinifyOptions: HtmlMinifierOptions = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  useShortDoctype: true
};

const src = resolve(PROJECT_ROOT, './src');
const commonConfig: Configuration = {
  entry: ['react-hot-loader/patch', resolve(PROJECT_ROOT, './src/index.tsx')],
  output: {
    publicPath: '/',
    path: resolve(PROJECT_ROOT, './dist'),
    filename: 'js/[name]-[hash].bundle.js',
    hashSalt: PROJECT_NAME
  },
  resolve: {
    // 我们导入ts 等模块一般不写后缀名，webpack 会尝试使用这个数组提供的后缀名去导入
    extensions: ['.js', '.tsx', '.ts', '.json'],
    alias: {
      // 替换 react-dom 成 @hot-loader/react-dom 以支持 react hooks 的 hot reload
      'react-dom': '@hot-loader/react-dom',
      '@components': resolve(src, './components'),
      '@api': resolve(src, './api'),
      '@pages': resolve(src, './pages'),
      '@typings': resolve(src, './typings')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        options: { cacheDirectory: true },
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: getCssLoaders(1)
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: getCssLoaders(1, false)
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              // 图片低于 10k 会被转换成 base64 格式的 dataUrl
              limit: 10 * 1024,
              // [hash] 占位符和 [contenthash] 是相同的含义
              // 都是表示文件内容的 hash 值，默认是使用 md5 hash 算法
              name: '[name].[contenthash].[ext]',
              // 保存到 images 文件夹下面
              outputPath: 'images'
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[contenthash].[ext]',
              outputPath: 'fonts'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new WebpackBar({
      name: '云联智慧运维管理模板',
      // react 蓝
      color: '#61dafb'
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // HtmlWebpackPlugin 会调用 HtmlMinifier 对 HTMl 文件进行压缩
      // 只在生产环境压缩
      minify: __DEV__ ? false : htmlMinifyOptions,
      template: resolve(PROJECT_ROOT, './public/index.html'),
      templateParameters: (...args: any[]) => {
        const [compilation, assets, assetTags, options] = args;
        const rawPublicPath = commonConfig.output!.publicPath!;
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options
          },
          // 在 index.html 模板中注入模板参数 PUBLIC_PATH
          // 移除最后的反斜杠为了让拼接路径更自然，例如：<%= `${PUBLIC_PATH}/favicon.ico` %>
          PUBLIC_PATH: rawPublicPath.endsWith('/') ? rawPublicPath.slice(0, -1) : rawPublicPath
        };
      }
    }),
    new CopyPlugin([
      {
        context: resolve(PROJECT_ROOT, './public'),
        from: '*',
        to: resolve(PROJECT_ROOT, './dist'),
        toType: 'dir',
        ignore: ['index.html']
      }
    ])
  ]
};

if (__DEV__) {
  // 开发环境下注入热更新补丁
  // reload=true 设置 webpack 无法热更新时刷新整个页面，overlay=true 设置编译出错时在网页中显示出错信息遮罩
  (commonConfig.entry as string[]).unshift(
    `webpack-hot-middleware/client?path=${HMR_PATH}&reload=true&overlay=true`
  );
}
export default commonConfig;
