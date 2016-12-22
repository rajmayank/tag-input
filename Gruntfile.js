module.exports = function(grunt) {

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
          'dist/css/tagInput.min.css': ['src/tagInput.css']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/tagInput.css' , 'src/tagInput.js'],
        tasks: ['uglify', 'cssmin'],
        options: {
          spawn: false,
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'cssmin']);

};