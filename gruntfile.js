/*global module: false, require:false */

module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['gruntfile.js', 'js/app.js', 'work/js/app/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: false,
                    console: true,
                    module: false,
                    document: true
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "work/js",
                    generateSourceMaps: true,
                    logLevel: 4,
                    preserveLicenseComments: false,
                    optimize: "uglify2",
                    //                    mainConfigFile: "require.config.js",
                    //                name: "path/to/almond",
                    /* assumes a production build using almond, if you don't use almond, you
                                                    need to set the "includes" or "modules" option instead of name */
                    include: ["main"],
                    paths: {
                        main: 'app/main',
                        domReady: 'lib/domReady.min',
                        promise: 'lib/es6-promise.min',
                        jquery: 'lib/jquery'
                    },
                    out: "js/app/main.min.js"
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'nested' //Output style. Can be nested, compact, compressed, expanded
                },
                files: {
                    'css/layout.min.css': 'work/sass/layout.scss'
                }
            }
        },
        jsonmin: {
            dev: {
                options: {
                    stripWhitespace: true,
                    stripComments: true
                },
                files: {
                    'js/data/searchform.min.json': 'work/js/data/searchform.json',
                    'js/data/users.min.json': 'work/js/data/users.json'
                        //"path/to/another/destination": ["multiple/source/files", "are/supported", "as/an/array"]
                }
            }
        },
        postcss: {
            options: {
                //map: true, // inline sourcemaps 

                // or 
                map: {
                    inline: false, // save all sourcemaps as separate files... 
                    annotation: 'css/maps/' // ...to the specified directory 
                },

                processors: [
                    require('pixrem')(), // add fallbacks for rem units 
                        require('autoprefixer')({
                        browsers: ['last 2 versions']
                    }), // add vendor prefixes 
                    require('cssnano')() // minify the result 
                ]
            },
            dist: {
                src: 'css/layout.min.css'
            }
        },
        clean: {
            //folder: ['path/to/dir/'],
            //folder_v2: ['path/to/dir/**'],
            //contents: ['path/to/dir/*'],
            //subfolders: ['path/to/dir/*/'],
            css: ['css/*']
                //all_css: ['path/to/dir/**/*.css']
        },
        copy: {
            css: {
                cwd: 'work/css',   // set working folder / root to copy
                src: '**/*',       // copy all files and subfolders
                dest: 'css',       // destination folder
                expand: true       // required when using cwd
            },
            js: {
                cwd: 'work/js',   // set working folder / root to copy
                src: '*.js',       // copy all files and subfolders
                dest: 'js',       // destination folder
                expand: true       // required when using cwd
            },
            jslib: {
                cwd: 'work/js/lib',   // set working folder / root to copy
                src: '**/*',       // copy all files and subfolders
                dest: 'js/lib',       // destination folder
                expand: true       // required when using cwd
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs'); //npm install grunt-contrib-jshint --save-dev
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-jsonmin');
    grunt.loadNpmTasks('grunt-postcss'); //npm install grunt-postcss pixrem autoprefixer cssnano
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('css', ['clean:css', 'sass', 'postcss', 'copy:css']);
    grunt.registerTask('script', ['jshint', 'requirejs']);
    grunt.registerTask('default', ['script', 'jsonmin', 'css' ,'copy:js', 'copy:jslib']);


};
