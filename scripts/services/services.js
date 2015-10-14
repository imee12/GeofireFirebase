(function(){

    'use strict';

    /*
    * Geolocation service
    *-----------------------------------------------------
    */

    angular.module('app').factory('geoLocationService', ['$q', '$http', function($q, $http){

        var getLocation = function() {

            var defer = $q.defer();

            // If supported and have permission for location...
            if (navigator.geolocation) {

                //
                navigator.geolocation.getCurrentPosition(function(position){

                    var result = {latitude : position.coords.latitude , longitude : position.coords.longitude}

                    var mapOptions = {
                           center: result,
                           zoom: 15,
                           mapTypeId: google.maps.MapTypeId.ROADMAP
                         };



                    // Adding randomization since we are all in the same location...
                    // result.latitude += (Math.random() >0.5? -Math.random()/100 : Math.random()/100  ) ;
                    // result.longitude += (Math.random() >0.5? -Math.random()/100 : Math.random()/100  ) ;

                    getNearbyCity(result.latitude, result.longitude).then(function(data){
                        result.address = data.data.results[1].formatted_address;
                        defer.resolve(result);
                    });


                }, function(error){

                    defer.reject({message: error.message, code:error.code});

                });
            }
            else {
                defer.reject({error: 'Geolocation not supported'});
            }

            return defer.promise;
        }

        var getNearbyCity = function (latitude, longitude){

            var defer = $q.defer();
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude +',' + longitude +'&sensor=true';

            $http({method: 'GET', url: url}).
                success(function(data, status, headers, config) {

                     defer.resolve({data : data});
                }).
                error(function(data, status, headers, config) {
                  defer.reject({error: 'City not found'});
                });

            return defer.promise;
        }

        var service = {
            getLocation : getLocation,
            getNearbyCity: getNearbyCity
        };

        return service;
    }]);





    /*
    * Firebase service
    *-----------------------------------------------------
    */

    angular.module('app').factory('dataService', ['$firebase','$q', function($firebase,$q){

        // var firebaseRef= new Firebase("https://popping-torch-4767.firebaseio.com/");
        var firebaseRef= new Firebase("https://meterdpractice.firebaseio.com/");
        var geoFire = new GeoFire(firebaseRef.child("_geofire"));





        var getFirebaseRoot = function(){
            return firebaseRef;

        };

        var getGeoFireNode = function(){
            return geoFire;
            console.log(geoFire);
        }

        var getFoodTruckNode = function(){
            return getFirebaseRoot().child("FoodTrucks");

        }

        var addData = function(data, locationData){
            // persist our data to firebase
            var ref = getFoodTruckNode();
            console.log(data);
        //    getFirebaseRoot().child("FoodTrucks");
//            firebaseRef.child("FoodTrucks");

        //     var postsRef = firebaseRef.child("posts");
        // var newPostRef =    postsRef.push({
        //       author: "somebody",
        //       title: "some title"
        //     });
        //
        //     var postID = newPostRef.name();
        //     console.log(postID);
            //
            return $firebase(ref).$push(data).then(function(childRef){
                   addGeofireData({key: childRef.name(), latitude: locationData.latitude, longitude: locationData.longitude});

                   var meterRef = new Firebase(firebaseRef + "/FoodTrucks/" + childRef.name());
                    var key= childRef.name();

                //THIS ADDS UNIQUE KEY AS AN ID///
                $firebase(meterRef).$set({
                  id: key,
                  name: data.name,
                  text: data.text,
                  address: data.address
                });

          //        var key= childRef.name();

                  //  console.log( key);
                  // key.toString();
                  //  console.log(key);
              //     postsRef.update({postID: {"id": postID}});


//return $firebase(ref).$update({"-K0CCakqxhOx0I8ApfB": { text: "newwww text3"}});

          });


        };


        var addGeofireData = function(data){
            var defer = $q.defer();

            geoFire.set(data.key, [data.latitude, data.longitude]).then(function() {
                defer.resolve();
              }).catch(function(error) {
                defer.reject(error);
            });

            return defer.promise;
        };

        var getData = function(callback){

            var ref = getFoodTruckNode();
            return $firebase(ref).$asArray();


        };




        var editData = function(i, index, event) {
          console.log("edit from services");
        //  console.log(index);
console.log(i);
var meterRef = new Firebase(firebaseRef + "/FoodTrucks/" + i.id);

  meterRef.update({ text: i.text});
      //   var ref = getFoodTruckNode();
      //
      // firebaseRef.update({
      //   "something/text" : "new name"
      // });

      // var ref = getFoodTruckNode();
      //  return $firebase(ref).$update({"-K0CCakqxhOx0I8ApfB": { text: "newwww text3"}});

    //  return $firebase(ref).$update(vm);
  //    return $firebase(ref).$update(data).then(function(childRef){
// e({ name: { first: 'Fred', last: 'Flintstone' }});

//           geoFire.get("-K-sppFI-8h6iXY62vZc").then(function(location) {
//   if (location === null) {
//     console.log("Provided key is not in GeoFire");
//   }
//   else {
//     console.log("Provided key has a location of " + location);
//     console.log(data.key);
//   }
// }, function(error) {
//   console.log("Error: " + error);
//  });

        };

        var deleteData = function(i, index, event){
          console.log(i);

 var meterRef = new Firebase(firebaseRef + "/FoodTrucks/" + i.id);

        meterRef.remove();
        geoFire.remove(i.id).then(function(){
          console.log("key has been removed.");

        })
};

        var service = {
            addData : addData,
            getData: getData,
            getFirebaseRoot: getFirebaseRoot,
            getGeoFireNode : getGeoFireNode,
            editData: editData,
            deleteData: deleteData
        };

        return service;

    }]);


})();
