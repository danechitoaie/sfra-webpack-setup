const path = require("path");
const fse = require("fs-extra");
const glob = require("glob");
const minimatch = require("minimatch");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

class MiniCssExtractPluginCleanup {
    apply(compiler) {
        compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
            Object.keys(compilation.assets)
                .filter((asset) => {
                    return ["*/css/**/*.js", "*/css/**/*.js.map"].some((pattern) => {
                        return minimatch(asset, pattern);
                    });
                })
                .forEach((asset) => {
                    delete compilation.assets[asset];
                });

            callback();
        });
    }
}

class WebpackBundle {
    static forCartridge(cartridgeName) {
        const devMode = process.env.NODE_ENV !== "production";
        const cartridgesPath = path.resolve(__dirname, "cartridges");
        const clientPath = path.resolve(cartridgesPath, cartridgeName, "cartridge/client");

        if (!fse.existsSync(clientPath)) {
            console.error(`Error! clientPath=${clientPath} does not exist!`);
            process.exit(1);
        }

        const bundle = {};
        bundle.entry = {};

        glob.sync(path.resolve(clientPath, "*", "js", "*.js")).forEach((f) => {
            const key = path.join(path.dirname(path.relative(clientPath, f)), path.basename(f, ".js"));
            bundle.entry[key] = f;
        });

        glob.sync(path.resolve(clientPath, "*", "scss", "**", "*.scss"))
            .filter((f) => !path.basename(f).startsWith("_"))
            .forEach((f) => {
                const key = path
                    .join(path.dirname(path.relative(clientPath, f)), path.basename(f, ".scss"))
                    .split(path.sep)
                    .map((pPart, pIdx) => (pIdx === 1 && pPart === "scss" ? "css" : pPart))
                    .join(path.sep);

                bundle.entry[key] = f;
            });

        bundle.output = {
            path: path.resolve(cartridgesPath, cartridgeName, "cartridge/static"),
            filename: "[name].js",
        };

        bundle.module = {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                compact: false,
                                babelrc: false,
                                presets: ["@babel/preset-env"],
                                plugins: ["@babel/plugin-proposal-object-rest-spread"],
                                cacheDirectory: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader",
                            options: { url: false, sourceMap: devMode },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass"),
                                sassOptions: {
                                    includePaths: [
                                        path.resolve(__dirname, "node_modules"),
                                        path.resolve(__dirname, "node_modules/flag-icon-css/sass"),
                                        path.resolve(__dirname, "cartridges"),
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
        };

        bundle.resolve = {
            alias: {
                "@sfra": path.resolve(cartridgesPath, "app_storefront_base/cartridge/client/default/js"),
            },
        };

        bundle.plugins = [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    path.resolve(cartridgesPath, cartridgeName, "cartridge/static/*/{js,css}"),
                ],
                cleanAfterEveryBuildPatterns: [],
            }),
            new MiniCssExtractPlugin(),
            new MiniCssExtractPluginCleanup(),
        ];

        bundle.optimization = {
            minimizer: [
                new TerserPlugin(),
                new OptimizeCSSAssetsPlugin({
                    cssProcessor: require("cssnano"),
                    cssProcessorPluginOptions: {
                        preset: ["default", { discardComments: { removeAll: true } }],
                    },
                }),
            ],
        };

        bundle.performance = { hints: false };
        bundle.stats = {
            entrypoints: false,
            children: false,
        };

        return bundle;
    }
}

module.exports = [WebpackBundle.forCartridge("app_storefront_base")];
