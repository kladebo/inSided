/*global define: false */

define(function (require) {
    'use strict';
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var print = require('app/print'),
        helper = require('app/helpers'),
        searchform = require('app/searchform');

    
    // Load library/vendor modules using
    // full IDs, like:
    require(['domReady!'], function () {

        searchform.initForm();


    });

});
