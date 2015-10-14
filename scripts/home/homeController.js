(function(){

    'use strict';

    angular.module('app').controller('home', home);


    function home(geoLocationService, dataService, $scope){




 var firebase = new Firebase("https://meterdpractice.firebaseio.com");

        var vm =this;
        vm.includeLocation = true;
        vm.location = {};
        vm.message = "Hello from Home";
        vm.time = 1;
        vm.cost = 10;
        console.log(vm);


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

        vm.edit = function(i){

          console.log("controller edit");
        console.log(i);



         dataService.editData(i);
        //  dataService.editData({name: vm.name|| '', text: vm.text || '', address: vm.location.address || ''});


        }

        vm.delete = function(i) {
          console.log("controller delete");

        console.log(i);
        dataService.deleteData(i);
        }


        vm.addTime = function() {

          console.log("Time");
          console.log();
        }

    }



})();
