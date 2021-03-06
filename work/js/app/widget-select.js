/*global define: false, require:false */

define(['app/print', 'app/helpers', 'app/widget-checkbox'], function (print, helper, checkbox) {
    'use strict';

    var createSelect,
        disableSelect,
        //        optionClicked,
        createOptions,
        createOptionGroups,
        multipleMenu,
        hideDropDown,
        showDropDown,
        toggleDropDown;



    disableSelect = function (item) {
        item.classList.add('w-select--disabled');
        item.setAttribute('old-tabindex', item.tabIndex);
        item.removeAttribute('tabIndex');
    };

    //    optionClicked = function (item) {
    //        helper.returnParent(item, 'div').querySelector('span').textContent = item.textContent;
    //        
    //        item.classList.toggle('w-select__item-multiple--active');
    //    };

    createOptions = function (options, multiple) {
        var frag = document.createDocumentFragment(),
            li,
            input;
        helper.forEach(options, function (option) {
            li = document.createElement('li');
            frag.appendChild(li);
            li.id = option.id;
            li.className = multiple ? 'w-select__item-multiple' : 'w-select__item';
            li.setAttribute('data-value', option.value);

            if (multiple) {
                input = document.createElement('input');
                li.appendChild(input);
                input.type = 'checkbox';
                input.className = 'w-select__item-checkbox';
                input.addEventListener('mousedown', function (event) {
                    event.preventDefault();
                });
            }

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
            span.className = 'w-select__optiongroup';
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
        div.className = 'w-select__dropdown-header';
        //check
        span = document.createElement('span');
        div.appendChild(span);
        span.textContent = 'Check all';
        span.id = 'select-all';
        span.className = 'w-select__dropdown-header-link';

        // uncheck
        span = document.createElement('span');
        div.appendChild(span);
        span.textContent = 'Uncheck all';
        span.id = 'select-none';
        span.className = 'w-select__dropdown-header-link';
        return frag;
    };

    hideDropDown = function (item) {
        item.classList.add('w-select__dropdown--hidden');
    };

    showDropDown = function (item) {
        item.classList.remove('w-select__dropdown--hidden');
    };

    toggleDropDown = function (item) {
        if (item.className.indexOf('w-select__dropdown--hidden') >= 0) {
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

        div.className = 'w-select';

        div.tabIndex = 0; //item.id;
        div.appendChild(span);
        span.className = 'w-select__value';

        div.appendChild(ul);
        ul.className = 'w-select__dropdown';
        ul.classList.add('w-select__dropdown--hidden');
        ul.setAttribute('name', item.name);

        // insert toggle-all menu when multiple
        if (multiple) {
            ul.appendChild(multipleMenu());
            ul.querySelector('span#select-all').addEventListener('click', function (event) {
                helper.forEach(ul.querySelectorAll('li'), function (li) {
                    li.classList.add('w-select__item-multiple--active');
                    li.querySelector('.w-select__item-checkbox').checked = true;
                });
            });
            ul.querySelector('span#select-none').addEventListener('click', function (event) {
                helper.forEach(ul.querySelectorAll('li'), function (li) {
                    li.classList.remove('w-select__item-multiple--active');
                    li.querySelector('.w-select__item-checkbox').checked = false;
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

        // create headers within the list when provided by the data
        if (item.groups) {
            ul.appendChild(createOptionGroups(item.groups, multiple));
        } else {
            ul.appendChild(createOptions(item.options, multiple));
        }

        span.textContent = item.title;
        if (item.initial > -1) {
            initialOption = ul.querySelector('li');
            initialOption.classList.add(multiple ? 'w-select__item-multiple--active' : 'w-select__item--active');
            span.textContent = initialOption.textContent;
        }


        /*
            #EVENT-SECTION
            
            - atach events to the main widget
            click: the widget-dropdown shows on a click
            focus: so the widget gets its visual focus
            blur: makes the widget-dropdown disapear
        */

        div.addEventListener('click', function () {
            // make the widget act as disabled when class is added
            if (this.classList.contains('w-select--disabled')) {
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


        /*
            - attach event to all li child-nodes of the widget
            
            click: handles two types: multi OR not;
            multi: toggles only the class of element
            not: removes previous active class and adds the new one 
                    - hides the dropdown
        */

        helper.forEach(ul.querySelectorAll('li'), function (li) {
            li.addEventListener('click', (function (item) {
                return function (event) {
                    var checkbox;
                    event.cancelBubble = true;
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    }
                    if (!multiple) {
                        helper.forEach(ul.querySelectorAll('li'), function (li) {
                            li.classList.remove('w-select__item--active');
                        });
                        item.classList.add('w-select__item--active');
                        span.textContent = item.textContent;
                        hideDropDown(ul);
                    } else {
                        item.classList.toggle('w-select__item-multiple--active');
                        checkbox = item.querySelector('.w-select__item-checkbox');
                        checkbox.checked = (item.className.indexOf('w-select__item-multiple--active') >= 0) ? true : false;
                    }
                };
            }(li)));
        });

        /*
            - return the entire widget
        */
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
