/*global define: false */

define(['app/print', 'app/helpers', 'app/widget-select', 'app/widget-input'], function (print, helper, wSelect, wInput) {
    'use strict';
    var userData,
        createAvatar,
        createResultTable,
        createTableHeader,
        createTableRows,
        activateRow,
        initResult,
        createResultAdminWrapper,
        createResultAdmin,
        createAdminExport,
        createResultHeader,
        createResultFooter,
        createNavigation,
        createFilterWrapper,
        updateAdminWrapper;

    activateRow = function (item, active) {
        print(item + '\n' + active);
        if (active) {
            item.querySelector('input').checked = true;
            item.classList.add('active');

        } else {
            item.querySelector('input').checked = false;
            item.classList.remove('active');
        }
    };

    updateAdminWrapper = function () {
        var wrapper = document.querySelector('.admin-body'),
            result = document.querySelector('.result-body'),
            counter;

        counter = -1;
        helper.forEach(result.querySelectorAll('tr'), function (item) {
            if (item.classList.contains('active')) {
                counter += 1;
            }
        });
        if (counter > -1) {
            wrapper.classList.remove('invisible');
        } else {
            wrapper.classList.add('invisible');
        }

    };

    createAvatar = function (src) {
        var img = document.createElement('img');
        img.src = 'img/data/' + src;

        return img;
    };

    createTableHeader = function () {
        var tr = document.createElement('tr'),
            th;
        helper.forEach(userData.headers, function (item) {
            //print(item.text);
            var input;
            th = document.createElement('th');
            tr.appendChild(th);
            if (item.field === 'username') {
                input = document.createElement('input');
                th.appendChild(input);
                input.type = 'checkbox';
                input.addEventListener('change', function () {
                    print(this.checked);
                    var result = document.querySelector('.result-body'),
                        active = this.checked;

                    helper.forEach(result.querySelectorAll('tr'), function (item) {
                        activateRow(item, active);
                        updateAdminWrapper();
                    });

                });
            }
            th.appendChild(document.createTextNode(item.text));
        });
        return tr;
    };

    createTableRows = function () {
        var frag = document.createDocumentFragment(),
            tbody = document.createElement('tbody'),
            tr,
            td,
            a;

        frag.appendChild(tbody);
        tbody.className = 'result-body';
        helper.forEach(userData.users, function (user) {
            tr = document.createElement('tr');
            tr.addEventListener('click', function () {
                var active = this.classList.contains('active');
                activateRow(this, !active);
                updateAdminWrapper();
            });
            tbody.appendChild(tr);
            helper.forEach(userData.headers, function (item) {
                var input;
                td = document.createElement('td');
                tr.appendChild(td);
                // specific layout for username
                if (item.field === 'username') {
                    td.className = 'username';
                    input = document.createElement('input');
                    td.appendChild(input);
                    input.type = 'checkbox';

                    a = document.createElement('a');
                    a.href = '#';
                    td.appendChild(a);
                    if (user.img) {
                        a.appendChild(createAvatar(user.img));
                        a.appendChild(document.createTextNode(user[item.field]));
                    }
                    a.addEventListener('click', function (event) {
                        event.preventDefault();
                        event.cancelBubble = true;
                        if (event.stopPropagation) {
                            event.stopPropagation();
                        }
                        print(user.username);
                    });
                } else {
                    td.appendChild(document.createTextNode(user[item.field]));
                    td.classList.add('center');
                }
            });
        });
        
        tbody = document.createElement('tbody');
        frag.appendChild(tbody);
        tbody.className = 'admin-body invisible';
        tr = document.createElement('tr');
        tbody.appendChild(tr);
        td = document.createElement('td');
        tr.appendChild(td);
        td.setAttribute('colspan', userData.headers.length);
        td.appendChild(createResultAdminWrapper());

        return frag;
    };

    createNavigation = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div'),
            button,
            span,
            input,
            data,
            divider;

        divider = function () {
            var span = document.createElement('span');
            span.textContent = '|';
            span.className = 'divider';
            return span;
        };
        data = {
            "resultcount": 124,
            "pageview": 10,
            "select": {
                "id": 0,
                "name": "page-view",
                "title": "pages per view",
                "initial": 0,
                "options": [{
                    "id": 0,
                    "value": 10,
                    "text": "10 Rows"
                    }, {
                    "id": 1,
                    "value": 25,
                    "text": "25 Rows"
                    }, {
                    "id": 2,
                    "value": 50,
                    "text": "50 Rows"
                    }]
            }
        };

        frag.appendChild(div);
        div.className = 'result-navigation';

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'First';
        button.className = 'transparent';
        button.disabled = true;
        div.appendChild(divider());

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = '<<';
        button.className = 'transparent';
        button.disabled = true;
        div.appendChild(divider());

        span = document.createElement('span');
        div.appendChild(span);
        span.textContent = 'Page ';

        input = wInput.createInput({});
        div.appendChild(input);
        input.querySelector('input').value = 1;
        input.classList.add('small');

        span = document.createElement('span');
        div.appendChild(span);
        span.textContent = 'of ' + parseInt(data.resultcount / data.pageview, 10);
        div.appendChild(divider());

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = '>>';
        button.className = 'transparent';
        div.appendChild(divider());

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Last';
        button.className = 'transparent';

        div.appendChild(wSelect.createSelect(data.select));

        return frag;
    };

    createResultAdmin = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div'),
            button,
            data;

        data = {
            "select": [{
                "id": 0,
                "name": "usergroup-admin",
                "title": "Change usergroup",
                "initial": -1,
                "options": [{
                    "id": 0,
                    "value": "",
                    "text": "Registered user"
                    }, {
                    "id": 1,
                    "value": "",
                    "text": "Super-user"
                    }, {
                    "id": 2,
                    "value": "",
                    "text": "Moderator"
                    }]
                }, {
                "id": 1,
                "name": "secundary-admin",
                "title": "Add secundary usergroup",
                "initial": -1,
                "options": [{
                    "id": 0,
                    "value": "",
                    "text": "Group #1"
                    }, {
                    "id": 1,
                    "value": "",
                    "text": "Group #2"
                    }, {
                    "id": 2,
                    "value": "",
                    "text": "Group #3"
                    }]
                }, {
                "id": 2,
                "name": "permissions-admin",
                "title": "Permissions",
                "initial": -1,
                "options": [{
                    "id": 0,
                    "value": "",
                    "text": "Permission #1"
                    }, {
                    "id": 1,
                    "value": "",
                    "text": "Permission #2"
                    }, {
                    "id": 2,
                    "value": "",
                    "text": "PermissionPermission #3"
                    }]
                }]
        };
        frag.appendChild(div);
        div.className = 'result-admin';
        helper.forEach(data.select, function (item) {
            div.appendChild(wSelect.createSelect(item));
        });
        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Apply';
        button.className = 'widget';
        
        div.appendChild(createAdminExport());

        return frag;
    };
    
    createAdminExport = function () {
        var div = document.createElement('div'),
            button;
        div.className = 'admin-export';
        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Export to Excel';
        button.className = 'widget';
        return div;
    };

    createFilterWrapper = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div');

        frag.appendChild(div);
        div.className = 'result-filter-wrapper';

        div.textContent = 'filter-wrapper';

        return frag;
    };

    createResultHeader = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div');

        frag.appendChild(div);
        div.className = 'result-header-wrapper clearfix';
        div.appendChild(createFilterWrapper());
        div.appendChild(createNavigation());

        return frag;
    };

    createResultAdminWrapper = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div');

        frag.appendChild(div);
        div.className = 'result-admin-wrapper';

        // insert admin toolbar
        div.appendChild(createResultAdmin());

        return frag;
    };

    createResultFooter = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div');

        frag.appendChild(div);
        div.className = 'result-footer-wrapper clearfix';
        div.appendChild(createNavigation());

        return frag;
    };

    createResultTable = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div'),
            table = document.createElement('table');
        frag.appendChild(div);
        div.className = 'result-view-wrapper';
        div.appendChild(table);
        table.appendChild(createTableHeader());
        table.appendChild(createTableRows());
        return frag;
    };

    initResult = function () {
        helper.getJSON('js/data/users.min.json').then(function (response) {
            var result = document.getElementById('result');

            userData = response;

            result.appendChild(createResultHeader());

            result.appendChild(createResultTable());

            result.appendChild(createResultFooter());

        }, function (error) {
            console.error("Failed!", error);
        });
    };

    return {
        initResult: initResult
    };

});
