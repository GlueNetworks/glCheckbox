/*! 
  glCheckbox v(0.0.6) 
  (c) 2013-2015
  https://gluenetworks.kilnhg.com/Code/Web-Development
  Release Date: 2015-05-14 
*/
angular.module("glCheckbox", []), angular.module("glCheckbox").directive("glCheckbox", [ "$compile", "$timeout", function($compile, $timeout) {
    "use strict";
    return {
        restrict: "E",
        scope: {
            settings: "=",
            api: "="
        },
        link: function(scope, element, attrs, controller) {
            var elementInput, elementInputLabel, elementError, elementViewLabel, elementViewValue, classInvalid = "gl-invalid", classChecked = "gl-checkbox-checked", classDisabled = "gl-checkbox-disabled";
            scope.api = scope.api || {}, scope.api._data = {}, scope.api._data.value = angular.isUndefined(scope.settings.value) ? void 0 : scope.settings.value, 
            //scope.api._data.options = angular.isUndefined(scope.settings.options) ? undefined : scope.settings.options;
            scope.api._data.name = angular.isUndefined(scope.settings.name) ? void 0 : scope.settings.name, 
            scope.api._data.viewLabel = angular.isUndefined(scope.settings.viewLabel) ? "On" : scope.settings.viewLabel, 
            scope.api._data.valid = angular.isUndefined(scope.settings.valid) ? !0 : scope.settings.valid, 
            scope.api._data.error = angular.isUndefined(scope.settings.error) ? void 0 : scope.settings.error, 
            scope.api._data.label = angular.isUndefined(scope.settings.label) ? void 0 : scope.settings.label, 
            scope.api._data.labelChecked = angular.isUndefined(scope.settings.labelChecked) ? "On" : scope.settings.labelChecked, 
            scope.api._data.labelUnchecked = angular.isUndefined(scope.settings.labelUnchecked) ? "Off" : scope.settings.labelUnchecked, 
            scope.api._data.disabled = angular.isUndefined(scope.settings.disabled) ? !1 : scope.settings.disabled, 
            scope.api._data.editable = angular.isUndefined(scope.settings.editable) ? !0 : scope.settings.editable, 
            scope.api._data.onChange = angular.isFunction(scope.settings.onChange) ? scope.settings.onChange : function() {}, 
            scope.api.view = function() {
                setViewMode();
            }, scope.api.edit = function() {
                setEditMode();
            };
            // Templates
            var templateInput = '<input type="checkbox" class="gl-checkbox-input">', templateInputLabel = '<label class="gl-checkbox-label"></label>', templateError = '<p class="gl-checkbox-error" data-ng-bind="api._data.error"></p>', templateViewLabel = '<label class="gl-checkbox-view-label">{{api._data.label}}</label>', templateViewValue = '<p class="gl-checkbox-view-value">{{api._data.value ? api._data.labelChecked : api._data.labelUnchecked}}</p>';
            scope.api.setInvalid = function(msg) {
                scope.api._data.valid = !1, scope.api._data.error = angular.isString(msg) ? msg : void 0, 
                errorMsgCheck();
            }, scope.api.setValid = function() {
                scope.api._data.valid = !0, errorMsgCheck();
            }, scope.api.setValue = function(val) {
                val ? (scope.api._data.value = !0, elementInput.attr("checked", !0), elementInputLabel.addClass(classChecked)) : (scope.api._data.value = !1, 
                elementInput.removeAttr("checked"), elementInputLabel.removeClass(classChecked));
            }, scope.api.getValue = function() {
                return scope.api._data.value;
            }, scope.api.disable = function() {
                scope.api._data.disabled = !0, elementInput.attr("disabled", !0), elementInputLabel.addClass(classDisabled);
            }, scope.api.enable = function() {
                scope.api._data.disabled = !1, elementInput.removeAttr("disabled"), elementInputLabel.removeClass(classDisabled);
            };
            var setEditMode = function() {
                scope.api._data.editable = !0, element.children().remove(), elementInput = angular.element(templateInput), 
                elementInput.attr({
                    name: scope.api._data.name,
                    id: scope.api._data.name,
                    value: scope.api._data.value
                }), elementInputLabel = angular.element(templateInputLabel), elementInputLabel.html(scope.api._data.label), 
                elementInputLabel.on("click", function() {
                    angular.isUndefined(elementInput.attr("disabled")) && (scope.api.setValue(!scope.api._data.value), 
                    scope.api._data.onChange(scope.api._data.value));
                }), element.append($compile(elementInput)(scope)), element.append($compile(elementInputLabel)(scope)), 
                angular.isUndefined(scope.api._data.value) || scope.api.setValue(scope.api._data.value), 
                1 == scope.api._data.disabled && scope.api.disable(), errorMsgCheck();
            }, setViewMode = function() {
                scope.api._data.editable = !1, element.children().remove(), angular.isString(scope.api._data.label) && (elementViewLabel = $compile(angular.element(templateViewLabel))(scope), 
                element.append(elementViewLabel)), elementViewValue = $compile(angular.element(templateViewValue))(scope), 
                element.append(elementViewValue);
            }, errorMsgCheck = function() {
                angular.isUndefined(elementError) || elementError.remove(), scope.api._data.editable && (scope.api._data.valid ? (elementInput.removeClass(classInvalid), 
                elementInputLabel.removeClass(classInvalid)) : (elementInput.addClass(classInvalid), 
                elementInputLabel.addClass(classInvalid), angular.isString(scope.api._data.error) && $timeout(function() {
                    elementError = $compile(angular.element(templateError))(scope), // ensure .error has been updated prior to this compile
                    element.append(elementError);
                }, 0)));
            };
            scope.api._data.editable ? setEditMode() : setViewMode();
        }
    };
} ]);