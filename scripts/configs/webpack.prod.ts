// import { BannerPlugin, HashedModuleIdsPlugin } from 'webpack';
// import merge from 'webpack-merge';
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import TerserPlugin from 'terser-webpack-plugin';
// import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
// import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// import CompressionPlugin from 'compression-webpack-plugin';
// import SizePlugin from 'size-plugin';

// import commonConfig from './webpack.common';
// import { COPYRIGHT, ENABLE_ANALYZE, PROJECT_ROOT } from '../utils/constants';

// const mergedConfig = merge(commonConfig, {
//   mode: 'production',
//   plugins: [
//     new BannerPlugin({
//       raw: true,
//       banner: COPYRIGHT
//     }),
//     new HashedModuleIdsPlugin(),
//     new MiniCssExtractPlugin({
//       filename: 'css/[name].[contenthash].css',
//       chunkFilename: 'css/[id].[contenthash].css',
//       ignoreOrder: false
//     }),
//     new CompressionPlugin({ cache: true })
//   ],
//   optimization: {
//     runtimeChunk: 'single',
//     minimize: true,
//     minimizer: [new TerserPlugin({ extractComments: false }), new OptimizeCSSAssetsPlugin()]
//   }
// });

// // eslint-disable-next-line import/no-mutable-exports
// let prodConfig = mergedConfig;

// // 使用 --analyze 参数构建时，会输出各个阶段的耗时和自动打开浏览器访问 bundle 分析页面
// if (ENABLE_ANALYZE) {
//   prodConfig.plugins!.push(new SizePlugin({ writeFile: false }), new BundleAnalyzerPlugin());
//   const smp = new SpeedMeasurePlugin();
//   prodConfig = smp.wrap(mergedConfig);
// }

// export default prodConfig;