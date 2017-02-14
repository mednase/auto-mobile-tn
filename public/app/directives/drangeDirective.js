/**
 * Created by medna on 26/01/2017.
 */
app.directive("drange", function(){
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
        template: '<select >' +
        '<option value="">{{"HOME_SEARCH_FORM_YEAR"|translate}}</option>' +
        '<option ng-repeat="n in number track by $index" value="{{n}}">{{n}}</option>' +
        '</select>',
        controller :['$scope',function($scope){

            $scope.scrollToTop = function(){
                $('html, body').animate({scrollTop : 0},900);
            };
        }],
        link:function (scope,elem,attrs) {
            if("to" in attrs)
                scope.number = getRange(attrs.from,attrs.to);
            else
                scope.number = getRange(attrs.from,new Date().getFullYear());

        }
    }

}).
directive('clock',['$interval', function ($interval) {
    return {
        restrict: 'E',
        $scope: {},
        template: ' <div class="widget widget-info widget-padding-sm">' +
        '<div style="color: whitesmoke" class="widget-big-int plugin-clock">{{date|date:\'hh\'}}<span id="point">:</span>{{date|date:\'mm\'}}</div> ' +
        '<div class="widget-subtitle ">{{date|date:\'fullDate\'}}</div> ' +
        '<div class="widget-controls"> ' +
        '<a href="#" class="widget-control-right widget-remove" data-toggle="tooltip" data-placement="left" title="Remove Widget"><span class="fa fa-times"></span></a> ' +
        '</div> ' +
        '<div class="widget-buttons widget-c3"> ' +
        '<div class="col"> ' +
        '<a href="#"><span class="fa fa-clock-o"></span></a> ' +
        '</div> ' +
        '<div class="col"> ' +
        '<a href="#"><span class="fa fa-bell"></span></a> ' +
        '</div> ' +
        '<div class="col"> ' +
        '<a href="#"><span class="fa fa-calendar"></span></a> </div> </div> </div>',
        link:function (scope) {
            scope.date=Date.now();
            $interval(function () {
                scope.date=Date.now();
            },30000);
        }
    }
}]);