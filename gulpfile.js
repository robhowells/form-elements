var gulp = require('gulp'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber');
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'), 
	concat = require('gulp-concat'),
	csscomb = require('gulp-csscomb'),
	sassLint = require('gulp-sass-lint');

var paths = {
	sass: {
		src: './scss/**/*.scss',
		dist: './css',
		lint: ['./scss/base/**/*.scss', './scss/global/**/*.scss', './scss/layout/**/*.scss']
	},
	css: {
		src: './css/style.css',
	}
};

var config = {
	autoprefixer: {
		browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
	}
}

gulp.task('sass:dev', function () {
	return gulp.src(paths.sass.src)
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sass())
		.pipe(autoprefixer(config.autoprefixer))
		.pipe(gulp.dest(paths.sass.dist))
});

gulp.task('sass:build', function () {
	return gulp.src(paths.sass.src) 
		.pipe(sass())
		.pipe(autoprefixer(config.autoprefixer))
		.pipe(cleanCSS({debug: true}, function(details) {
			console.log('Original size of ' + details.name + ': ' + details.stats.originalSize + 'kb');
			console.log('Minified size of ' + details.name + ': ' + details.stats.minifiedSize + 'kb');
		}))
		.pipe(concat('style.min.css'))
		.pipe(csscomb())
		.pipe(gulp.dest(paths.sass.dist));
});

gulp.task('lint:sass', function () {
  return gulp.src(paths.sass.lint)
    .pipe(sassLint({
    	rules: {
    		'no-warn': 0,
        	'no-ids': 1,
        	'indentation': 0,
        	'no-css-comments': 0,
        	'property-sort-order': 0,
        	'mixins-before-declarations': 0,
        	'empty-line-between-blocks': 0,
        	'no-mergeable-selectors': 0,
        	'no-color-literals': 0
		},
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('watch', function() {
	gulp.watch(paths.sass.src, ['lint:sass', 'sass:dev']);
});

gulp.task('build', ['sass:build'], function() {});