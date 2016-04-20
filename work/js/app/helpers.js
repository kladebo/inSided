/*global define: false, Promise: false */

define(function (require) {
    'use strict';

    var print = require('app/print');

    return {
        forEach: function (ctn, callback) {
            return Array.prototype.forEach.call(ctn, callback);
        },

        returnParent: function (from, parentTagName) {
            var find,
                parentString = parentTagName.toLowerCase();

            find = function (from) {
                if (parentString === 'body') {
                    return false;
                }

                if (parentString === from.tagName.toLowerCase()) {
                    return from;
                } else {
                    return find(from.parentNode);
                }
            };
            return find(from);
        },

        get: function (url) {
            // Return a new promise.
            return new Promise(function (resolve, reject) {
                // Do the usual XHR stuff
                var req = new XMLHttpRequest();
                req.open('GET', url);

                req.onload = function () {
                    // This is called even on 404 etc
                    // so check the status
                    if (req.status === 200) {
                        // Resolve the promise with the response text
                        resolve(req.response);
                    } else {
                        // Otherwise reject with the status text
                        // which will hopefully be a meaningful error
                        reject(new Error(req.statusText));
                    }
                };

                // Handle network errors
                req.onerror = function () {
                    reject(new Error("Network Error"));
                };

                // Make the request
                req.send();
            });
        },

        getJSON: function (url) {
            return this.get(url).then(JSON.parse).catch(function (err) {
                console.log("getJSON failed for", url, err);
                throw err;
            });
        }

        
    };

});
