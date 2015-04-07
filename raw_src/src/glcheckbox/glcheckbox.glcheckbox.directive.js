angular.module('glCheckbox').directive('glCheckbox', ["$compile", "$timeout", function ($compile,$timeout) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            settings: '=',
            api: '='
        },

        link: function (scope, element, attrs, controller) {

            var elementInputs = [];
            var elementInputLabels = [];
            var elementError;
            var elementViewLabel;
            var elementViewValue;
            var classInvalid = "gl-invalid";
            var classChecked = "gl-checkbox-checked";
            var classDisabled = "gl-checkbox-disabled"

            scope.api = scope.api || {};
            scope.api._data = {};
            scope.api._data.value = angular.isUndefined(scope.settings.value) ? undefined : scope.settings.value;

            scope.api._data.options = angular.isUndefined(scope.settings.options) ? undefined : scope.settings.options;
            scope.api._data.name = angular.isUndefined(scope.settings.name) ? undefined : scope.settings.name;
            scope.api._data.valid = angular.isUndefined(scope.settings.valid) ? true : scope.settings.valid;
            scope.api._data.error = angular.isUndefined(scope.settings.error) ? undefined : scope.settings.error;
            scope.api._data.label = angular.isUndefined(scope.settings.label) ? undefined : scope.settings.label;
            scope.api._data.disabled = angular.isUndefined(scope.settings.disabled) ? false : scope.settings.disabled;
            scope.api._data.editable = angular.isUndefined(scope.settings.editable) ? true : scope.settings.editable;
            scope.api._data.onChange = angular.isFunction(scope.settings.onChange) ? scope.settings.onChange : undefined;

            scope.api.view = function () {
                setViewMode();
            }
            scope.api.edit = function () {
                setEditMode();
            }

            // Templates
            var templateInput = '<input type="checkbox" class="gl-checkbox-input">';
            var templateInputLabel = '<label class="gl-checkbox-label"></label>';
            var templateError = '<p class="gl-checkbox-error" data-ng-bind="api._data.error"></p>';
            var templateViewLabel = '<label class="gl-checkbox-view-label">{{api._data.label}}</label>';
            var templateViewValue = '<p class="gl-checkbox-view-value">{{api._data.value.join(\', \') }}</p>';


            scope.api.setInvalid = function (msg) {
                scope.api._data.valid = false;
                if (angular.isString(msg)) {
                    scope.api._data.error = msg;
                } else {
                    scope.api._data.error = undefined;
                }
                errorMsgCheck();
            }

            scope.api.setValid = function () {
                scope.api._data.valid = true;
                errorMsgCheck();
            }


            scope.api.setOptions = function (options) {
                if (angular.isArray(options)) {
                    scope.api._data.options = options;

                    if (scope.api._data.editable) {
                        setEditMode();
                    } else {
                        setViewMode();
                    }
                    scope.api._data.value = []
                }
            }

            scope.api._data.selectOption = function (val) {
                if (scope.api._data.disabled) {
                    return;
                } else {
                    scope.api.setValue(val);
                }
            }

            scope.api.setValue = function (vals) {
                if(!angular.isArray(vals)){ vals = [vals]; }

                for (var i = 0; i < vals.length; i++) {
                    var val = vals[i];
                    var idx;
                    for (var a = 0; a < scope.api._data.options.length; a++) {
                        var option = scope.api._data.options[a];
                        if(option.value == val){
                            idx = a;
                            break;
                        }
                    }
                    if(angular.isUndefined(idx)) { continue; }
                    var checked = elementInputs[idx].attr('checked');
                    if(angular.isUndefined(checked)){
                        elementInputs[idx].attr('checked',true);
                        elementInputLabels[idx].addClass(classChecked);
                        addVal(val);
                    }else{
                        elementInputs[idx].removeAttr('checked');
                        elementInputLabels[idx].removeClass(classChecked);
                        removeVal(val);
                    }
                }
            }

            function addVal(val){
                if(angular.isArray(scope.api._data.value) && scope.api._data.value.length > 0 ){
                    if(scope.api._data.value.indexOf(val) >= 0){ return; }
                    scope.api._data.value.push(val);
                }else{
                    scope.api._data.value = [val];
                }
            }

            function removeVal(val){
                if(!angular.isArray(scope.api._data.value)){ return; }
                for (var i = 0; i < scope.api._data.value.length; i++) {
                    if(scope.api._data.value[i] == val){
                        console.log('scope.api._data.value Before: '+scope.api._data.value);
                        scope.api._data.value.splice(i,1);
                        console.log('scope.api._data.value After: '+scope.api._data.value);
                    }
                }
            }

            scope.api.getValue = function () {
                return scope.api._data.value;
            }

            scope.api.disable = function () {
                scope.api._data.disabled = true;
                for (var i = 0; i < elementInputs.length; i++) {
                    elementInputs[i].attr('disabled', true);
                }
                for (var i = 0; i < elementInputLabels.length; i++) {
                    elementInputLabels[i].addClass(classDisabled);
                }
            }

            scope.api.enable = function () {
                scope.api._data.disabled = false;
                for (var i = 0; i < elementInputs.length; i++) {
                    elementInputs[i].attr('disabled', true);
                }
                for (var i = 0; i < elementInputLabels.length; i++) {
                    elementInputLabels[i].removeClass(classDisabled);
                }
            }

            var setEditMode = function () {
                scope.api._data.editable = true;
                element.children().remove();
                for (var i = 0; i < scope.api._data.options.length; i++) {
                    var option = scope.api._data.options[i];
                    var inputName = scope.api._data.name + "-" + i;
                    var inputId = inputName;
                    elementInputs[i] = angular.element(templateInput);
                    elementInputs[i].attr({name: inputName, id: inputId, value: option.value});
                    elementInputLabels[i] = angular.element(templateInputLabel);
                    elementInputLabels[i].attr({
                        for: inputId,
                        'data-ng-click': "api._data.selectOption('" + option.value + "')"
                    })
                    elementInputLabels[i].html(option.label);
                    element.append($compile(elementInputs[i])(scope))
                    element.append($compile(elementInputLabels[i])(scope))
                }
                if (!angular.isUndefined(scope.api._data.value)) {
                    scope.api.setValue(scope.api._data.value);
                }
                if (scope.api._data.disabled == true) {
                    scope.api.disable();
                }
                errorMsgCheck();
            }

            var setViewMode = function () {
                scope.api._data.editable = false;
                element.children().remove();
                if (angular.isString(scope.api._data.label)) {
                    elementViewLabel = $compile(angular.element(templateViewLabel))(scope);
                    element.append(elementViewLabel);
                }
                elementViewValue = $compile(angular.element(templateViewValue))(scope);
                element.append(elementViewValue);
            }

            var errorMsgCheck = function () {
                if (!angular.isUndefined(elementError)) {
                    elementError.remove();
                }
                if (scope.api._data.editable) {
                    if (scope.api._data.valid) {
                        element.children('input').removeClass(classInvalid);
                        element.children('.gl-checkbox-label').removeClass(classInvalid);
                    } else {
                        element.children('input:checked').addClass(classInvalid);
                        element.children('.gl-checkbox-label').addClass(classInvalid);
                        if (angular.isString(scope.api._data.error)) {
                            $timeout(function () {
                                elementError = $compile(angular.element(templateError))(scope);  // ensure .error has been updated prior to this compile
                                element.append(elementError);
                            }, 0);
                        }
                    }
                }
            }

            scope.$watchCollection('api._data.value', function (n, o) {
                if (!angular.isUndefined(scope.api._data.onChange)) {
                    scope.api._data.onChange(scope.api.getValue());
                }
            });

            if (scope.api._data.editable) {
                setEditMode();
            } else {
                setViewMode()
            }

        }
    };
}]);
