/**
 * Created by medna on 26/01/2017.
 */
app.directive("range", function(){
    function getRange(from,to){
        var number = [];
        for (var i = from; i <= to ; i++){
            number.push(i);
        }
        return number;
    }
    return{
        restrict: 'A',
        replace: true,
        template: '<select  class="form-control" ><option ng-repeat="n in number track by $index" value="{{n}}">{{n}}</option></select>',
        controller : function($scope){
            $scope.scrollToTop = function(){
                $('html, body').animate({scrollTop : 0},900);
            };
        },
        link:function (scope,elem,attrs) {
            if("to" in attrs)
                scope.number = getRange(attrs.from,attrs.to);
            else
                scope.number = getRange(attrs.from,new Date().getFullYear());

        }
    }

});