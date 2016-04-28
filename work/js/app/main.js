/*global define: false, Promise: false */

define(function (require) {
    'use strict';
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var print = require('app/print'),
        helper = require('app/helpers'),
        searchform = require('app/search-form'),
        menu = require('app/menu');

    if (typeof Promise === "undefined" && Promise.toString().indexOf("[native code]") === -1) {
        // load promise polyfill
        require('promise').polyfill();
    }
    
    // Load library/vendor modules using
    // full IDs, like:
    require(['domReady!'], function () {
        menu.initMenu();
        searchform.initForm();
    });

});
