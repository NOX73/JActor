module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    meta: { },

    jasmine_node: {
      specFolders: ['./spec'],
      specNameMatcher: "spec", // load only specs containing specNameMatcher
      projectRoot: "./src",
      useCoffee: true,
      forceExit: true,
      jUnit: {
        useDotNotation: true,
        consolidate: true
      }
    }



  });

  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', ['jasmine_node']);
  grunt.registerTask('default', ['test']);
};