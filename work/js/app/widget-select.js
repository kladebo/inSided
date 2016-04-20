/*global define: false, require:false */

define(['app/print', 'app/helpers', 'app/widget-checkbox'], function (print, helper, checkbox) {
    'use strict';

    var createSelect,
        disableSelect,
        optionClicked,
        createOptions,
        createOptionGroups,
        multipleMenu,
        hideDropDown,
        showDropDown,
        toggleDropDown;



    disableSelect = function (item) {
        item.classList.add('disabled');
        item.setAttribute('old-tabindex', item.tabIndex);
        item.removeAttribute('tabIndex');
    };

    optionClicked = function (item) {
        helper.returnParent(item, 'div').querySelector('span').textContent = item.textContent;
    };

    createOptions = function (options, multiple) {
        var frag = document.createDocumentFragment(),
            li,
            input;
        helper.forEach(options, function (option) {
            li = document.createElement('li');
            frag.appendChild(li);
            li.id = option.id;
            li.setAttribute('data-value', option.value);

            li.appendChild(document.createTextNode(option.text));
        });
        return frag;
    };

    createOptionGroups = function (groups, multiple) {
        var frag = document.createDocumentFragment(),
            span;
        helper.forEach(groups, function (group) {
            span = document.createElement('span');
            frag.appendChild(span);
            span.className = 'optgroup';
            span.textContent = group.text;
            frag.appendChild(createOptions(group.options, multiple));
        });
        return frag;
    };

    multipleMenu = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div'),
            span;
        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'multiple-menu';
        //check
        span = document.createElement('span');
        div.appendChild(span);
        span.textContent = 'Check all';
        span.id = 'all';

        // uncheck
        span = document.createElement('span');
        div.appendChild(span);
        span.textContent = 'Uncheck all';
        span.id = 'none';
        return frag;
    };

    hideDropDown = function (item) {
        item.classList.add('hidden');
    };

    showDropDown = function (item) {
        item.classList.remove('hidden');
    };

    toggleDropDown = function (item) {
        if (item.className.indexOf('hidden') >= 0) {
            showDropDown(item);
        } else {
            hideDropDown(item);
        }
    };

    createSelect = function (item) {
        var div = document.createElement('div'),
            span = document.createElement('span'),
            ul = document.createElement('ul'),
            pre = 'check_',
            multiple = (item.type && item.type === 'multiple') || false,
            initialOption;

        div.className = 'w-select ' + (multiple ? 'multiple' : 'single');

        div.tabIndex = item.id;
        //text
        div.appendChild(span);
        span.className = 'value';

        div.appendChild(ul);
        ul.classList.add('hidden');
        ul.setAttribute('name', item.name);

        if (multiple) {
            ul.appendChild(multipleMenu());
            ul.querySelector('span#all').addEventListener('click', function (event) {
                helper.forEach(ul.querySelectorAll('li'), function (li) {
                    li.classList.add('active');
                });
            });
            ul.querySelector('span#none').addEventListener('click', function (event) {
                helper.forEach(ul.querySelectorAll('li'), function (li) {
                    li.classList.remove('active');
                });
            });
            ul.addEventListener('click', function (event) {
                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                return false;
            });
        }
        if (item.groups) {
            ul.appendChild(createOptionGroups(item.groups, multiple));
        } else {
            ul.appendChild(createOptions(item.options, multiple));
        }
        
        span.textContent = item.title;
        if (item.initial > -1) {
            initialOption = ul.querySelector('li');
            initialOption.classList.add('active');
            span.textContent = initialOption.textContent;
        }


        div.addEventListener('click', function () {
            print(this.classList);
            if (this.classList.contains('disabled')) {
                return false;
            }
            div.focus();
            toggleDropDown(ul);
        });
        div.addEventListener('focus', function () {
            div.classList.add('focus');
        });
        div.addEventListener('blur', function () {
            div.classList.remove('focus');
            hideDropDown(ul);
        });

        helper.forEach(ul.querySelectorAll('li'), function (li) {

            li.addEventListener('click', (function (item) {
                return function (event) {
                    var multiCheckbox,
                        name;
                    event.cancelBubble = true;
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    }
                    if (!multiple) {
                        helper.forEach(ul.querySelectorAll('li'), function (li) {
                            li.classList.remove('active');
                        });
                        item.classList.add('active');
                        span.textContent = item.textContent;
                        hideDropDown(ul);
                    } else {
                        item.classList.toggle('active');
                        multiCheckbox = item.querySelector('input');
                        //print(multiCheckbox.checked);
                        //multiCheckbox.checked = !multiCheckbox.checked;
                    }
                };
            }(li)));
        });
        return div;
    };

    return {
        create: function (items) {
            var frag = document.createDocumentFragment();
            helper.forEach(items, function (item) {
                frag.appendChild(createSelect(item));
            });
            return frag;
        },
        createSelect: createSelect,
        disableSelect: disableSelect
    };
});
