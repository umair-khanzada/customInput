/**
 * Created by Owais on 9/25/2016.
 */

angular.module("cardNumberApp", ['ngMessages'])

    //create main controller.
    .controller("mainCtrl", function($scope) {
        $scope.fullCardNumber = function(){
            //do something.
            console.log("running")
        }
    })

    //create special card number directive.
    .directive("specialCardNumber", function($timeout){
        return {
            restrict: "AE",
            scope:{
              ngModel: "=",
              successHandler: "&"
            },
            templateUrl : "specialCardNumber.html",
            link: function(scope){
                //omit element and attribute parameter because can't use in our directive.

                //Initialization
                scope.succMessage = false;

                //focus on first input field.
                angular.element("#step1").focus();

                //create regex for allow numbers only.
                //we able to use input `type="number"` but safari doesn't support `type="number"` that's why we use this trick.
                scope.allowNumberOnly = "\\d+";

                //focus on next input box if current one is valid.
                //parameters: (1)form name, (2)current input name with quotes, (3)next input box id with quotes.
                scope.focusOnNext = function(form, inputName, nextId){
                    if(form[inputName].$valid) angular.element("#" + nextId).focus();
                };

                scope.formSubmit = function(form){
                    if(form.$valid){
                        scope.ngModel = scope.step1 + scope.step2 + scope.step3;
                        scope.successHandler();
                        scope.succMessage = true;
                        $timeout(function(){
                            scope.succMessage = false;
                        }, 3000)
                    }
                }
            }
        };
    });
