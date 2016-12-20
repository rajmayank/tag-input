module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: ''
      },
      build: {
        src: 'src/tagInput.js',
        dest: 'dist/js/tagInput.min.js'
      }
    },
    cssmin: {
      combine: {
        files: {
          'dist/css/tagInput.min.css' : [ 'src/tagInput.css' ]
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify' , 'cssmin']);

};