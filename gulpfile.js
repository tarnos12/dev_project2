/**
 * Created by Tarnos on 2016-12-14.
 */
var gulp = require('gulp'),
    jade = require('gulp-pug'),
    prettify = require('gulp-html-prettify'),
    git = require('gulp-git'),
    browserSync = require('browser-sync').create();

var paths = {
    scripts: ['builds/development/*.pug', 'builds/development/views/*.pug'],
    reload: ['builds/development/js/**/*.js', 'builds/development/css/*.css', 'builds/development/**/*.html'],
    copy: ['builds/development/**/*.{pug,html,js,css,png,otf,eot,svg,ttf,woff,woff2}', '!.git'],
    deploy: ['builds/development/**/*.{html,js,css,png,otf,eot,svg,ttf,woff,woff2}', '!.git']
};

gulp.task('default', ['watch', 'browser-sync']);

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['jade']);
    gulp.watch([paths.reload]).on('change', browserSync.reload);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./builds/development"
        }
    });
});

gulp.task('jade', function() {
    return gulp.src(paths.scripts, {base: "./"})
        .pipe(jade()) // pip to jade plugin
        .on('error', swallowError)
        .pipe(prettify({indent_char: '  ', indent_size: 2}))
        .pipe(gulp.dest('./')); // tell gulp our output folder
});

//Prevents watch errors
function swallowError(error){
    console.log(error.toString());
    this.emit('end');
}

/* Copy files into 2 folder, copy and deploy. Deploy is playable game with less files in it*/
gulp.task('copy', function(){
    gulp.src(paths.copy, { base: './builds/development' })
        .pipe(gulp.dest('builds/copy'));
});

gulp.task('deploy', function(){
    gulp.src(paths.deploy, { base: './builds/development' })
        .pipe(gulp.dest('builds/deploy'));
});


/*

=================================================== GIT AUTOMATION ===================================================

*/

gulp.task('commit_to_master', function(){

});

gulp.task('commit_to_gh_pages', function(){

});

gulp.task('add', function(){
    return gulp.src('./builds/deploy/*')
        .pipe(git.add());
});