const gulp = require("gulp");


/**
 * ESLint Server
 */
gulp.task("lint:js-server", () => {
    const esLint = require("gulp-eslint");
    const esLintSrc = [
        "cartridges/app_cartridge/cartridge/{controllers,models,scripts}/**/*.js"
    ];

    return gulp.src(esLintSrc)
        .pipe(esLint({
            configFile: '.eslintrc_server.js',
            useEslintrc: false
        }))
        .pipe(esLint.format())
        .pipe(esLint.failAfterError());
});


/**
 * ESLint Client
 */
gulp.task("lint:js-client", () => {
    const esLint = require("gulp-eslint");
    const esLintSrc = [
        "cartridges/app_cartridge/cartridge/client/*/js/**/*.js"
    ];

    return gulp.src(esLintSrc)
        .pipe(esLint({
            configFile: '.eslintrc_client.js',
            useEslintrc: false
        }))
        .pipe(esLint.format())
        .pipe(esLint.failAfterError());
});


/**
 * StyleLint
 */
gulp.task("lint:scss", () => {
    const styleLint = require("gulp-stylelint");
    const styleLintCfg = {reporters: [{formatter: "string", console: true}]};
    const styleLintSrc = [
        "cartridges/app_cartridge/cartridge/client/default/scss/**/*.scss"
    ];

    return gulp.src(styleLintSrc)
        .pipe(styleLint(styleLintCfg));
});



/**
 * Lint
 */
gulp.task("lint", gulp.series(
    "lint:js-server",
    "lint:js-client",
    "lint:scss"
));
