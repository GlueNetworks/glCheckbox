angular.module('glCheckbox').directive('glCheckbox', ["$compile", "$timeout", function ($compile,$timeout) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            settings: '=',
            api: '='
        },

        link: function (scope, element, attrs, controller) {

            var elementInput;
            var elementInputLabel;
            var elementError;
            var elementViewLabel;
            var elementViewValue;
            var classInvalid = "gl-invalid";
            var classChecked = "gl-checkbox-checked";
            var classDisabled = "gl-checkbox-disabled"

            scope.api = scope.api || {};
            scope.api._data = {};
            scope.api._data.value = angular.isUndefined(scope.settings.value) ? undefined : scope.settings.value;

            //scope.api._data.options = angular.isUndefined(scope.settings.options) ? undefined : scope.settings.options;
            scope.api._data.name = angular.isUndefined(scope.settings.name) ? undefined : scope.settings.name;
            scope.api._data.viewLabel = angular.isUndefined(scope.settings.viewLabel) ? "On" : scope.settings.viewLabel;
            scope.api._data.valid = angular.isUndefined(scope.settings.valid) ? true : scope.settings.valid;
            scope.api._data.error = angular.isUndefined(scope.settings.error) ? undefined : scope.settings.error;
            scope.api._data.label = angular.isUndefined(scope.settings.label) ? undefined : scope.settings.label;
            scope.api._data.labelChecked = angular.isUndefined(scope.settings.labelChecked) ? "On" : scope.settings.labelChecked;
            scope.api._data.labelUnchecked = angular.isUndefined(scope.settings.labelUnchecked) ? "Off" : scope.settings.labelUnchecked;
            scope.api._data.disabled = angular.isUndefined(scope.settings.disabled) ? false : scope.settings.disabled;
            scope.api._data.editable = angular.isUndefined(scope.settings.editable) ? true : scope.settings.editable;
            scope.api._data.onChange = angular.isFunction(scope.settings.onChange) ? scope.settings.onChange : function(){};

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
            var templateViewValue = '<p class="gl-checkbox-view-value">{{api._data.value ? api._data.labelChecked : api._data.labelUnchecked}}</p>';


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

            scope.api.setValue = function (val) {
                if(val){
                    scope.api._data.value = true;
                    elementInput.attr('checked',true);
                    elementInputLabel.addClass(classChecked);
                }else{
                    scope.api._data.value = false;
                    elementInput.removeAttr('checked');
                    elementInputLabel.removeClass(classChecked);
                }
            }

            scope.api.getValue = function () {
                return scope.api._data.value;
            }

            scope.api.disable = function () {
                scope.api._data.disabled = true;
                elementInput.attr('disabled', true);
                elementInputLabel.addClass(classDisabled);
            }

            scope.api.enable = function () {
                scope.api._data.disabled = false;
                elementInput.removeAttr('disabled');
                elementInputLabel.removeClass(classDisabled);
            }

            var setEditMode = function () {
                scope.api._data.editable = true;
                element.children().remove();
                elementInput = angular.element(templateInput);
                elementInput.attr({name: scope.api._data.name, id: scope.api._data.name, value: scope.api._data.value});
                elementInputLabel = angular.element(templateInputLabel);
                elementInputLabel.html(scope.api._data.label);
                elementInputLabel.on("click",function(){
                    if(angular.isUndefined(elementInput.attr('disabled'))){
                        scope.api.setValue(!scope.api._data.value);
                        scope.api._data.onChange(scope.api._data.value);
                    }
                });
                element.append($compile(elementInput)(scope))
                element.append($compile(elementInputLabel)(scope))
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
                        elementInput.removeClass(classInvalid);
                        elementInputLabel.removeClass(classInvalid);
                    } else {
                        elementInput.addClass(classInvalid);
                        elementInputLabel.addClass(classInvalid);
                        if (angular.isString(scope.api._data.error)) {
                            $timeout(function () {
                                elementError = $compile(angular.element(templateError))(scope);  // ensure .error has been updated prior to this compile
                                element.append(elementError);
                            }, 0);
                        }
                    }
                }
            }


            if (scope.api._data.editable) {
                setEditMode();
            } else {
                setViewMode()
            }

        }
    };
}]);
