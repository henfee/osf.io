(function($){
    $.fn.filters = function (options) {
        /*
            options:
                callback:   -this is the function that should be called whenever a search/filter is applied.
                            -takes in two parameters, filtered & empty.
                            -filtered is a boolean that returns true if the number of items displayed is less than
                            the number of items being searched
                            -empty is a boolean that returns true if there are 0 items displayed after the filters are
                            applied
                groups:     -a dictionary of filter button groups
                            -key: the ID for the group of filter buttons
                            -value: a dictionary of options with the following format:
                                - {
                                    filter: (selector to be used for filtering),
                                    type: (currently the options are 'text' or 'checkbox'),
                                    buttons: {
                                        (buttonID): (value to match) (if type is 'text' the value is the string that
                                        should be matched.  if type is 'text' the value is the boolean that should be
                                        matched),
                                        ....
                                    }
                                }
                inputs:     -a dictionary of the search fields
                            -key: the ID for the search field
                            -value: the selector that this field should search against
         */
        var settings = $.extend({
            items: ['.items']
        }, options);

        var itemsSelector = settings.items.join();

        var filterConstraints = {};
        var searchConstraints = {};

        var search = function(el) {
            for (var key in searchConstraints) {
                if (searchConstraints.hasOwnProperty(key)) {
                    var content = jQuery(el.querySelector(key)).text().toLowerCase();
                    var exists = content.indexOf(searchConstraints[key]);
                    if (exists === -1) {
                        return false;
                    }
                }
            }
            return true;
        };

        var filter = function(el) {
            for (var key in filterConstraints) {
                if (filterConstraints.hasOwnProperty(key)) {
                    var selector = settings.groups[key].filter;
                    var type = settings.groups[key].type;
                    var match = filterConstraints[key];
                    if (type === 'text') {
                        var content = jQuery(el.querySelector(selector)).text();
                        if (match.indexOf(content) === -1) {
                            return false;
                        }
                    }
                    else if (type === 'checkbox') {
                        if (match.indexOf(el.querySelector(selector).checked) === -1) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };

        var toggle = function() {
            var activeItems = $(itemsSelector);
            $(itemsSelector).each(function() {
                var self = this;
                if (!search(self)) {
                    activeItems.splice(activeItems.index(self), 1);
                    $(self).fadeOut();
                }
                else if (!filter(self)){
                    activeItems.splice(activeItems.index(self), 1);
                    $(self).fadeOut();
                }
            });
            $(activeItems).fadeIn();
            if (settings.callback !== undefined) {
                var empty = [];
                var filtered = [];
                for (var i = 0, selector; selector = settings.items[i]; i ++) {
                    var active = jQuery(activeItems).filter(selector);
                    var items = $(selector);
                    if (active.length < items.length) {
                        filtered.push(selector);
                    }
                    if (active.length === 0) {
                        empty.push(selector);
                    }
                }
                settings.callback(filtered, empty);
            }
        };

        var clickFunction = function() {
            var self = this;
            $(self).toggleClass('btn-primary btn-default');
            var group = self.parentElement.parentElement.id;
            var match = settings.groups[group].buttons[self.id];
            try {
                var index = filterConstraints[group].indexOf(match);
                if (index === -1) {
                    filterConstraints[group].push(match);
                }
                else {
                    filterConstraints[group].splice(index, 1);
                    if (filterConstraints[group].length === 0) {
                        delete filterConstraints[group];
                    }
                }
            }
            catch(TypeError) {
                filterConstraints[group] = [match];
            }
            toggle();
        };

        for (var group in settings.groups) {
            if (settings.groups.hasOwnProperty(group)) {
                for (var value in settings.groups[group].buttons) {
                    if (settings.groups[group].buttons.hasOwnProperty(value)) {
                        $('#' + value).on('click', clickFunction);
                    }
                }
            }
        }

        function keyupFunction() {
            var self = this;
            var selector = settings.inputs[self.id];
            searchConstraints[selector] = $(self).val().toLowerCase();
            toggle();
        }

        for (var key in settings.inputs) {
            if (settings.inputs.hasOwnProperty(key)) {
                jQuery('#' + key).keyup(keyupFunction);
            }
        }
    };
}(jQuery));
