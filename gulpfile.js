var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	plumber 		= require('gulp-plumber');
	autoprefixer 	= require('gulp-autoprefixer'),
	cleanCSS 		= require('gulp-clean-css'),
	concat 			= require('gulp-concat')

// ... variables
var paths = {
	sass: './scss/**/*.scss'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('sass:dev', function () {
	gulp.src(paths.sass)
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sass())
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulp.dest('./css'));
});

gulp.task('sass:build', function () {
	gulp.src(paths.sass)
		.pipe(sass())
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(cleanCSS({debug: true}, function(details) {
			console.log('Original size of ' + details.name + ': ' + details.stats.originalSize + 'kb');
			console.log('Minified size of ' + details.name + ': ' + details.stats.minifiedSize + 'kb');
		}))
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
	gulp.watch(paths.sass, ['sass:dev']);
});

gulp.task('build', ['sass:build'], function() {});
