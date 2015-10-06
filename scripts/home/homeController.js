(function(){

    'use strict';

    angular.module('app').controller('home', home);


    function home(geoLocationService, dataService, $scope){

      $scope.add5Seconds = function () {
                    $scope.$broadcast('timer-add-cd-seconds', 5);
                }

        var vm =this;
        vm.includeLocation = true;
        vm.location = {};
        vm.message = "Hello from Home";
      //  vm.infoWindow = "test stuff";


        init();

        function init(){

            geoLocationService.getLocation().then(function(result){
                vm.location = result;
                console.log(result);
});

            vm.message = dataService.getFirebaseRoot().toString();

            vm.foodTrucks = dataService.getData();
            console.log(vm.foodTrucks);

}

        vm.save = function(){

            dataService.addData({name: vm.name|| '', text: vm.text || '', address: vm.location.address || ''},
                                {latitude: vm.location.latitude, longitude: vm.location.longitude});

        }
    }
})();
