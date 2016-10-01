/**
 * Created by Owais on 9/25/2016.
 */

angular.module("cardNumberApp", ['ngMessages'])

    //create main controller.
    .controller("mainCtrl", function($scope) {
        $scope.fullCardNumber = function(val, separatedVal){
            //do something.
            console.log("val", val);
            console.log("separatedVal", separatedVal)
        }
    })

    //create special card number directive.
    .directive("specialCardNumber", function($timeout){
        return {
            restrict: "AE",
            scope:{
              type: "@",                //we've only two formats (1)created-card (2)nic-card (3)you can able to use another format by passing a 'other' and config array as you need.
              config: "=?",            //configure input fields type array of objects. every object contains 3 main fields (1)placeholder (2)minLength (3)maxLength
              focus: "=?",            //focus on first input box. type: Boolean
              specialChar: "@?",     //special character the card value seprated by like: dash, comma, etc
              successHandler: "&"   //pass full card number in first argument, card seprated value in second argument.
            },
            templateUrl : "specialCardNumber.html",
            link: function(scope){
                //omit element and attribute parameter because can't use in our directive.

                //Initialization
                scope.succMessage = false;

                switch (scope.type){
                    case "created-card":{
                        scope.config = [
                            {placeholder: 4545, minLength: 4, maxLength: 4},
                            {placeholder: 4545, minLength: 4, maxLength: 4},
                            {placeholder: 4545, minLength: 4, maxLength: 4},
                            {placeholder: 4545, minLength: 4, maxLength: 4}
                        ];
                        break;
                    }
                    case "nic-card":{
                        scope.config = [
                            {placeholder: 45301, minLength: 5, maxLength: 5},
                            {placeholder: 7886658, minLength: 7, maxLength: 7},
                            {placeholder: 5, minLength: 1, maxLength: 1}
                        ];
                        break;
                    }
                }

                //create regex for allow numbers only.
                //we able to use input `type="number"`
                // but `input="number"` can support exponential
                // and afari doesn't support `type="number"` that's why we use this trick.
                scope.allowNumberOnly = "\\d+";

                //focus on first input field if `scope.focus` is truthy.
                $timeout(function(){
                    scope.focus && angular.element("#step0").focus();
                });



                //focus on next/previous input box.
                //In Case of Next: parameters: (1)form name, (2)current input name with quotes, (3)next input box id with quotes.
                //In Case of Previous: parameters: (1)form name, (2)previous input name with quotes, (3)previous input box id with quotes.
                scope.transferFocus = function(form, inputName, id){
                    if(inputName && form[ inputName ][ inputName === id ? "$invalid" : "$valid" ]) angular.element("#" + id).focus();
                };

                //get full card number.
                function getFullCardNum(separateBy){
                    var fullCardNumber = '';
                    //concatenate card number.
                    angular.forEach(scope.config, function(obj){
                        fullCardNumber += separateBy ? obj.model + separateBy : obj.model;
                    });
                    //remove last character if separateBy
                    separateBy && fullCardNumber.slice(0, -1);
                    return fullCardNumber;
                }

                scope.formSubmit = function(form){
                    if(form.$valid){
                        var cardNumSepBySpeChar = scope.specialChar ? getFullCardNum(scope.specialChar) : undefined;
                        scope.successHandler({cardNumber: getFullCardNum(), separatedCardNumber: cardNumSepBySpeChar});
                        scope.succMessage = true;
                        $timeout(function(){
                            scope.succMessage = false;
                        }, 3000)
                    }
                }
            }
        };
    });
