# Glue branded Checkboxes
## Overview
An interface to toggle a value state from true or false. It provides both an editable input field as well as a static visual view.

## States

* Edit
* View (label + On)
* enabled
* disabled
* valid
* invalid

## HTML

    <gl-checkbox api="myApi" settings="mySettings"></gl-checkbox>

## Settings

* name - (Required)
* label - The label for view mode.
* labelChecked - The label for view mode checked.
* labelUnchecked - The label for view mode unchecked.
* editable - Defaults to true 
* disabled - Defaults to false
* value - (boolean true/false) Sets the initial selection value.
* onChange - define a callback event for when a selection has changed
* valid - defaults to true
* error - displayed when invalid

### Example 

    $scope.settings1 = {  
      name: "myTest",
      label: "Power",
      labelChecked: "ON",
      labelUnchecked: "OFF".
      value: true,  // init checked
      disabled: false,
      onChange: function(val){
        console.log(val);
      }
    };

## API Methods

* edit - pass false for View mode
* isEditable - returns true or false
* setValue 
* getValue 
* enable
* disable
* setInvalid
* setValid

### Example API

    var myApi = {};

    // Api Method call examples
    myApi.disable();     // Disabled the input field leaving text visible but not editable.
    myApi.enable();      // Enables editing of the input field
    myApi.setValue(["abc"]);  // Sets the value of the input field
    myApi.getValue();       // returns "abc", the value of the input field
    myApi.setInvalid()
    myApi.setInvalid("there has been an error.")
    myApi.setValid()
    
