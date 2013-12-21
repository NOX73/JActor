module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    meta: { },

    jasmine : {
      options : {
        specs : 'spec/*.js'
      },
      src : [
        'src/JActor.js',
      ]
    }


  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('default', ['test']);
};