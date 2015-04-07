/*! 
  glCheckbox v(0.0.5) 
  (c) 2013-2015
  https://gluenetworks.kilnhg.com/Code/Web-Development
  Release Date: 2015-04-06 
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
            function addVal(val) {
                if (angular.isArray(scope.api._data.value) && scope.api._data.value.length > 0) {
                    if (scope.api._data.value.indexOf(val) >= 0) return;
                    scope.api._data.value.push(val);
                } else scope.api._data.value = [ val ];
            }
            function removeVal(val) {
                if (angular.isArray(scope.api._data.value)) for (var i = 0; i < scope.api._data.value.length; i++) scope.api._data.value[i] == val && (console.log("scope.api._data.value Before: " + scope.api._data.value), 
                scope.api._data.value.splice(i, 1), console.log("scope.api._data.value After: " + scope.api._data.value));
            }
            var elementError, elementViewLabel, elementViewValue, elementInputs = [], elementInputLabels = [], classInvalid = "gl-invalid", classChecked = "gl-checkbox-checked", classDisabled = "gl-checkbox-disabled";
            scope.api = scope.api || {}, scope.api._data = {}, scope.api._data.value = angular.isUndefined(scope.settings.value) ? void 0 : scope.settings.value, 
            scope.api._data.options = angular.isUndefined(scope.settings.options) ? void 0 : scope.settings.options, 
            scope.api._data.name = angular.isUndefined(scope.settings.name) ? void 0 : scope.settings.name, 
            scope.api._data.valid = angular.isUndefined(scope.settings.valid) ? !0 : scope.settings.valid, 
            scope.api._data.error = angular.isUndefined(scope.settings.error) ? void 0 : scope.settings.error, 
            scope.api._data.label = angular.isUndefined(scope.settings.label) ? void 0 : scope.settings.label, 
            scope.api._data.disabled = angular.isUndefined(scope.settings.disabled) ? !1 : scope.settings.disabled, 
            scope.api._data.editable = angular.isUndefined(scope.settings.editable) ? !0 : scope.settings.editable, 
            scope.api._data.onChange = angular.isFunction(scope.settings.onChange) ? scope.settings.onChange : void 0, 
            scope.api.view = function() {
                setViewMode();
            }, scope.api.edit = function() {
                setEditMode();
            };
            // Templates
            var templateInput = '<input type="checkbox" class="gl-checkbox-input">', templateInputLabel = '<label class="gl-checkbox-label"></label>', templateError = '<p class="gl-checkbox-error" data-ng-bind="api._data.error"></p>', templateViewLabel = '<label class="gl-checkbox-view-label">{{api._data.label}}</label>', templateViewValue = "<p class=\"gl-checkbox-view-value\">{{api._data.value.join(', ') }}</p>";
            scope.api.setInvalid = function(msg) {
                scope.api._data.valid = !1, scope.api._data.error = angular.isString(msg) ? msg : void 0, 
                errorMsgCheck();
            }, scope.api.setValid = function() {
                scope.api._data.valid = !0, errorMsgCheck();
            }, scope.api.setOptions = function(options) {
                angular.isArray(options) && (scope.api._data.options = options, scope.api._data.editable ? setEditMode() : setViewMode(), 
                scope.api._data.value = []);
            }, scope.api._data.selectOption = function(val) {
                scope.api._data.disabled || scope.api.setValue(val);
            }, scope.api.setValue = function(vals) {
                angular.isArray(vals) || (vals = [ vals ]);
                for (var i = 0; i < vals.length; i++) {
                    for (var idx, val = vals[i], a = 0; a < scope.api._data.options.length; a++) {
                        var option = scope.api._data.options[a];
                        if (option.value == val) {
                            idx = a;
                            break;
                        }
                    }
                    if (!angular.isUndefined(idx)) {
                        var checked = elementInputs[idx].attr("checked");
                        angular.isUndefined(checked) ? (elementInputs[idx].attr("checked", !0), elementInputLabels[idx].addClass(classChecked), 
                        addVal(val)) : (elementInputs[idx].removeAttr("checked"), elementInputLabels[idx].removeClass(classChecked), 
                        removeVal(val));
                    }
                }
            }, scope.api.getValue = function() {
                return scope.api._data.value;
            }, scope.api.disable = function() {
                scope.api._data.disabled = !0;
                for (var i = 0; i < elementInputs.length; i++) elementInputs[i].attr("disabled", !0);
                for (var i = 0; i < elementInputLabels.length; i++) elementInputLabels[i].addClass(classDisabled);
            }, scope.api.enable = function() {
                scope.api._data.disabled = !1;
                for (var i = 0; i < elementInputs.length; i++) elementInputs[i].attr("disabled", !0);
                for (var i = 0; i < elementInputLabels.length; i++) elementInputLabels[i].removeClass(classDisabled);
            };
            var setEditMode = function() {
                scope.api._data.editable = !0, element.children().remove();
                for (var i = 0; i < scope.api._data.options.length; i++) {
                    var option = scope.api._data.options[i], inputName = scope.api._data.name + "-" + i, inputId = inputName;
                    elementInputs[i] = angular.element(templateInput), elementInputs[i].attr({
                        name: inputName,
                        id: inputId,
                        value: option.value
                    }), elementInputLabels[i] = angular.element(templateInputLabel), elementInputLabels[i].attr({
                        "for": inputId,
                        "data-ng-click": "api._data.selectOption('" + option.value + "')"
                    }), elementInputLabels[i].html(option.label), element.append($compile(elementInputs[i])(scope)), 
                    element.append($compile(elementInputLabels[i])(scope));
                }
                angular.isUndefined(scope.api._data.value) || scope.api.setValue(scope.api._data.value), 
                1 == scope.api._data.disabled && scope.api.disable(), errorMsgCheck();
            }, setViewMode = function() {
                scope.api._data.editable = !1, element.children().remove(), angular.isString(scope.api._data.label) && (elementViewLabel = $compile(angular.element(templateViewLabel))(scope), 
                element.append(elementViewLabel)), elementViewValue = $compile(angular.element(templateViewValue))(scope), 
                element.append(elementViewValue);
            }, errorMsgCheck = function() {
                angular.isUndefined(elementError) || elementError.remove(), scope.api._data.editable && (scope.api._data.valid ? (element.children("input").removeClass(classInvalid), 
                element.children(".gl-checkbox-label").removeClass(classInvalid)) : (element.children("input:checked").addClass(classInvalid), 
                element.children(".gl-checkbox-label").addClass(classInvalid), angular.isString(scope.api._data.error) && $timeout(function() {
                    elementError = $compile(angular.element(templateError))(scope), // ensure .error has been updated prior to this compile
                    element.append(elementError);
                }, 0)));
            };
            scope.$watchCollection("api._data.value", function(n, o) {
                angular.isUndefined(scope.api._data.onChange) || scope.api._data.onChange(scope.api.getValue());
            }), scope.api._data.editable ? setEditMode() : setViewMode();
        }
    };
} ]);