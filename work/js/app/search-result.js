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
        createResultAdmin,
        createAdminSettings,
        createAdminExport,
        createResultHeader,
        createResultFooter,
        createNavigation,
        createFilterWrapper,
        updateAdminWrapper;

    activateRow = function (item, active) {
        if (active) {
            item.querySelector('input').checked = true;
            item.classList.add('active');

        } else {
            item.querySelector('input').checked = false;
            item.classList.remove('active');
        }
    };

    updateAdminWrapper = function () {
        var wrapper = document.querySelector('tr.result__table-adminrow'),
            resultRows = document.querySelectorAll('tr.result__table-row'),
            counter;

        counter = -1;
        helper.forEach(resultRows, function (item) {
            if (item.classList.contains('active')) {
                counter += 1;
            }
        });
        if (counter > -1) {
            wrapper.classList.remove('result__table-adminrow--invisible');
        } else {
            wrapper.classList.add('result__table-adminrow--invisible');
        }

    };

    createAvatar = function (src) {
        var img = document.createElement('img');
        img.src = 'img/data/' + src;
        img.className = 'result__userlink-avatar';

        return img;
    };

    createTableHeader = function () {
        var tr = document.createElement('tr'),
            th;

        tr.className = 'result__table-headerrow';
        helper.forEach(userData.headers, function (item) {
            var input,
                span;
            th = document.createElement('th');
            tr.appendChild(th);
            th.className = 'result__table-header-cel';
            if (item.field === 'username') {
                th.classList.add('result__table-header-cel--user');

                input = document.createElement('input');
                th.appendChild(input);

                input.type = 'checkbox';
                input.className = 'result__checkbox';
                input.addEventListener('change', function () {
                    var resultRows = document.querySelectorAll('tr.result__table-row'),
                        active = this.checked;

                    helper.forEach(resultRows, function (item) {
                        activateRow(item, active);
                        updateAdminWrapper();
                    });

                });
                span = document.createElement('span');
                th.appendChild(span);
                span.className = 'result__header--link';
                span.textContent = item.text;
            } else {
                th.appendChild(document.createTextNode(item.text));
            }
        });
        return tr;
    };

    createTableRows = function () {
        var frag = document.createDocumentFragment(),
            tr,
            td,
            a;

        helper.forEach(userData.users, function (user) {
            tr = document.createElement('tr');
            frag.appendChild(tr);
            tr.className = 'result__table-row';

            tr.addEventListener('click', function () {
                var active = this.classList.contains('active');
                activateRow(this, !active);
                updateAdminWrapper();
            });

            helper.forEach(userData.headers, function (item) {
                var input,
                    img;
                td = document.createElement('td');
                tr.appendChild(td);
                td.className = 'result__table-cel';

                // specific layout for username
                if (item.field === 'username') {
                    input = document.createElement('input');
                    td.appendChild(input);
                    input.className = 'result__checkbox';
                    input.type = 'checkbox';

                    a = document.createElement('a');
                    a.href = '#';
                    a.className = 'result__userlink';
                    td.appendChild(a);

                    img = document.createElement('img');
                    a.appendChild(img);
                    img.src = 'img/icon--new-window.gif';
                    img.className = 'result__userlink-icon';

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
                    if (item.field === 'usergroup' || item.field === 'regdate' || item.field === 'lastlogin' || item.field === 'lastcomment') {
                        td.classList.add('result__table-cel--right');
                    } else {
                        td.classList.add('result__table-cel--center');
                    }
                    td.appendChild(document.createTextNode(user[item.field]));

                }
            });
        });

        /*
            - admin row
        */
        tr = document.createElement('tr');
        frag.appendChild(tr);
        tr.className = 'result__table-adminrow result__table-adminrow--invisible';
        td = document.createElement('td');
        tr.appendChild(td);
        td.className = 'result__table-admin-cel';
        td.setAttribute('colspan', userData.headers.length);
        td.appendChild(createResultAdmin());

        return frag;
    };

    createNavigation = function () {
        var frag = document.createDocumentFragment(),
            div,
            button,
            span,
            input,
            select,
            data,
            divider,
            wrapper;

        divider = function () {
            var span = document.createElement('span');
            span.innerHTML = '&#8739;';
            span.className = 'result__navigation--divider';
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

        wrapper = document.createElement('div');
        frag.appendChild(wrapper);
        wrapper.className = 'result__settings-wrapper';

        div = document.createElement('div');
        wrapper.appendChild(div);
        div.className = 'result__navigation';

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'First';
        button.className = 'button button--transparent button--minimum-padding button--accent-text';
        button.disabled = true;
        div.appendChild(divider());

        button = document.createElement('button');
        div.appendChild(button);
        button.innerHTML = '&nbsp;&laquo;&nbsp;';
        button.className = 'button button--transparent button--minimum-padding button--accent-text button--large-fontsize';
        button.disabled = true;
        div.appendChild(divider());

        span = document.createElement('span');
        div.appendChild(span);
        span.className = 'result__navigation--label';
        span.textContent = 'Page ';

        input = wInput.createInput({});
        div.appendChild(input);
        input.querySelector('input').value = 1;
        input.className = 'w-input w-input--xxsmall';
        input.querySelector('input').setAttribute('maxlength', 2);

        span = document.createElement('span');
        div.appendChild(span);
        span.className = 'result__navigation--label';
        span.textContent = 'of ' + parseInt(data.resultcount / data.pageview, 10);
        div.appendChild(divider());

        button = document.createElement('button');
        div.appendChild(button);
        button.innerHTML = '&nbsp;&raquo;&nbsp;';
        button.className = 'button button--transparent button--minimum-padding button--accent-text button--large-fontsize';
        div.appendChild(divider());

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Last';
        button.className = 'button button--transparent button--minimum-padding button--accent-text';

        div = document.createElement('div');
        wrapper.appendChild(div);
        div.className = 'result__paging';

        select = wSelect.createSelect(data.select);
        div.appendChild(select);

        return frag;
    };

    createAdminSettings = function () {
        var div = document.createElement('div'),
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
        div.className = 'result__admin-settings';
        helper.forEach(data.select, function (item) {
            var select = wSelect.createSelect(item);
            div.appendChild(select);
            select.classList.add('w-select--small');
        });

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Apply';
        button.className = 'button';

        return div;
    };

    createAdminExport = function () {
        var div = document.createElement('div'),
            button;
        div.className = 'result__admin-export';
        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Export to Excel';
        button.className = 'button';
        return div;
    };

    createFilterWrapper = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div'),
            button,
            plus;

        frag.appendChild(div);
        div.className = 'result__filter-wrapper';

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Category';
        button.className = 'button button--filter';

        plus = document.createElement('span');
        div.appendChild(plus);
        plus.textContent = '+';
        plus.className = 'result__filterbutton-divider';

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Tags';
        button.className = 'button button--filter';

        plus = document.createElement('span');
        div.appendChild(plus);
        plus.textContent = '+';
        plus.className = 'result__filterbutton-divider';

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Views';
        button.className = 'button button--filter';

        button = document.createElement('button');
        div.appendChild(button);
        button.textContent = 'Clear selection';
        button.className = 'button button--cancel button--minimum-padding';

        //div.textContent = 'filter-wrapper';

        return frag;
    };

    createResultHeader = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div');

        frag.appendChild(div);
        div.className = 'result__header-wrapper clearfix';
        div.appendChild(createFilterWrapper());
        div.appendChild(createNavigation());

        return frag;
    };

    createResultAdmin = function () {
        var frag = document.createDocumentFragment();
        //div = document.createElement('div');

        //frag.appendChild(div);
        //div.className = 'result__admin-wrapper';

        // insert admin toolbar
        frag.appendChild(createAdminSettings());
        frag.appendChild(createAdminExport());

        return frag;
    };

    createResultFooter = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div');

        frag.appendChild(div);
        div.className = 'result__footer-wrapper clearfix';
        div.appendChild(createNavigation());

        return frag;
    };

    createResultTable = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div'),
            table = document.createElement('table');
        frag.appendChild(div);
        div.className = 'result__body-wrapper';
        div.appendChild(table);
        table.className = 'result__table';
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
