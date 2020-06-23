const envPreset = [
    '@babel/preset-env',
    {
        // 只导入需要的 polyfill
        useBuiltIns: 'usage',
        // 指定 corjs 版本
        corejs: 3,
        // 禁用模块化方案转换
        modules: false
    }
];

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['@babel/preset-typescript', envPreset],
        plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-optional-chaining',
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]
        ],
        env: {
            development: {
                presets: [['@babel/preset-react', { development: true }]],
                plugins: [
                    'react-hot-loader/babel',
                    [
                        'babel-plugin-import',
                        {
                            libraryName: '@material-ui/core',
                            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
                            libraryDirectory: 'esm',
                            camel2DashComponentName: false
                        },
                        'core'
                    ],
                    [
                        'babel-plugin-import',
                        {
                            libraryName: '@material-ui/icons',
                            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
                            libraryDirectory: 'esm',
                            camel2DashComponentName: false
                        },
                        'icons'
                    ]
                ]
            },
            production: {
                presets: ['@babel/preset-react'],
                plugins: ['@babel/plugin-transform-react-constant-elements']
            }
        }
    };
};