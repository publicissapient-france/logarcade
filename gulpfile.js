var gulp = require('gulp');
var gulpfile = require('electron-windows-installer');

gulp.task('create-windows-installer', function(done) {
    gulpfile({
        appDirectory: './logarcade-win32-ia32/',
        outputDirectory: './release',
        arch: 'ia32',
        authors: 'Xebia France',
    }).then(done).catch(done);
});