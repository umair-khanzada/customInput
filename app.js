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
              //ngModel: "=",
              type: "=",
              config: "=?",
              focus: "=?",            //focus on first input box. type: Boolean
              specialChar: "@?",     //special character the card value seprated by like: dash, comma, etc
              successHandler: "&"   //pass full card number in first argument, card seprated value in second argument.
            },
            templateUrl : "specialCardNumber.html",
            link: function(scope){
                //omit element and attribute parameter because can't use in our directive.

                //Initialization
                scope.succMessage = false;

                //create regex for allow numbers only.
                //we able to use input `type="number"` but safari doesn't support `type="number"` that's why we use this trick.
                scope.allowNumberOnly = "\\d+";

                //focus on first input field if `scope.focus` is truthy.
                scope.focus && angular.element("#step1").focus();



                //focus on next/previous input box.
                //In Case of Next: parameters: (1)form name, (2)current input name with quotes, (3)next input box id with quotes.
                //In Case of Previous: parameters: (1)form name, (2)previous input name with quotes, (3)previous input box id with quotes.
                scope.transferFocus = function(form, inputName, nextId){
                    if(form[ inputName ][ inputName === nextId ? "$invalid" : "$valid" ]) angular.element("#" + nextId).focus();
                };

                //get full card number.
                function getFullCardNum(separateBy){
                    if(separateBy) return "" + scope.step1 + separateBy + scope.step2 + separateBy + scope.step3 + separateBy + scope.step4;
                    return  "" + scope.step1 + scope.step2 + scope.step3 + scope.step4;
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
