# Glue branded Checkboxes
## Overview
An interface to select one or more options. It provides both an editable input field as well as a static visual view.

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
Settings are for init purposes only, none of the options are bound.

* name - (Required)
* label - The label for view mode.
* options - (Required)  An array of option objects containing a label and a value property. 
* editable - Defaults to true 
* disabled - Defaults to false
* value - Sets the initial selection value.
* onChange - define a callback event for when a selection has changed
* valid - defaults to true
* error - displayed when invalid

### Example 

    $scope.settings1 = {  
      name: "myTest",
      //value: ["abc"],
      options:[
        {label:"abc",value:"abc"},
        {label:"def",value:"def"},
        {label:"ghi",value:"ghi"},
        {label:"jkl",value:"jkl"},
      ],
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
* setOptions
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
    myApi.setOptions(["abc","def"]) // replaces existing options
    myApi.getOptions()      // returns ["abc","def"]
    myApi.setInvalid()
    myApi.setInvalid("there has been an error.")
    myApi.setValid()
    
