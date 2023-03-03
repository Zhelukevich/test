const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

const srcPath = 'src/';
const distPath = 'dist/';

const path = {
	build: {
		html: distPath,
		css: distPath + 'assets/css/',
		js: distPath + 'assets/js/',
		images: distPath + 'assets/images/',
		fonts: distPath + 'assets/fonts/'
	},
	src: {
		html: srcPath + '*.html',
		css: srcPath + 'assets/scss/*.scss',
		js: srcPath + 'assets/js/*.js',
		images: srcPath + 'assets/images/**/*.{jpeg,png,svg,ico}',
		fonts: srcPath + 'assets/fonts/**/*.{woff,woff2}'
	},
	watch: {
		html: srcPath + '**/*.html',
		css: srcPath + 'assets/scss/**/*.scss',
		js: srcPath + 'assets/js/**/*.js',
		vendorJS: srcPath + 'assets/js/vendor/**/*.js',
		vendorCSS: srcPath + 'assets/css/vendor/**/*.css',
		images: srcPath + 'assets/images/**/*.{jpeg,png,svg,ico}',
		fonts: srcPath + 'assets/fonts/**/*.{woff,woff2}'
	},
	clean: './' + distPath
};

function serve() {
	browserSync.init({
		server: {
			baseDir: "./" + distPath
		}
	});
}

function html() {
	return src(path.src.html, { base: srcPath })
		.pipe(plumber())
		.pipe(dest(path.build.html))
		.pipe(browserSync.reload({ stream: true }))
};

function css() {
	return src(path.src.css, { base: srcPath + 'assets/scss/' })
		.pipe(plumber({
			errorHandler: function (err) {
				notify.onError({
					title: 'SCSS Error',
					message: "Error: <%= error.message %>"
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(dest(path.build.css))
		// .pipe(cssnano({
		// 	zindex: false,
		// 	discardComments: {
		// 		removeAll: true
		// 	}
		// }
		// ))
		// .pipe(dest(path.build.css))
		.pipe(browserSync.reload({ stream: true }))
};

function js() {
	return src(path.src.js, { base: srcPath + 'assets/js/' })
		.pipe(plumber())
		.pipe(rigger())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browserSync.reload({ stream: true }))
};

function images() {
	return src(path.src.images, { base: srcPath + 'assets/images/' })
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 80, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest(path.build.images))
		.pipe(browserSync.reload({ stream: true }))
};

function fonts() {
	return src(path.src.fonts, { base: srcPath + 'assets/fonts/' })
		.pipe(dest(path.build.fonts))
		.pipe(browserSync.reload({ stream: true }))

};

const vendorJS = () => {
	return src('src/assets/js/vendor/**')
		.pipe(dest('dist/assets/js/vendor/'));
}

const vendorCSS = () => {
	return src('src/assets/css/vendor/**')
		.pipe(dest('dist/assets/css/vendor/'));
}


function clean() {
	return del(path.clean)
};

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.vendorCSS], vendorCSS);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.vendorJS], vendorJS);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, js, vendorJS, css, vendorCSS, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);

// exports.html = html;
// exports.css = css;
// exports.js = js;
// exports.images = images;
// exports.fonts = fonts;
// exports.clean = clean;
// exports.build = build;
// exports.watch = watch;
exports.default = watch;
