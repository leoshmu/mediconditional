'use strict';

angular.module('mediconditionalApp')
  .controller('MainCtrl', function ($scope) {
    $scope.population = {
    	total: 500
    }
    $scope.prevalence = 8;
    $scope.sensitivity = 90;
    $scope.specificity = 93;
    $scope.nodes= [];

    $scope.apply_prevalence = function(){
    	var disease = _.sample($scope.nodes, $scope.prevalence * $scope.population.total / 1000);
    	console.log(disease, _.without($scope.nodes, disease).length);
    	_.each(_.without($scope.nodes, disease), function(node){
    		node.disease = false;
    	})
    	_.each(disease, function(node){
    		node.disease = true;
    	})

    }

		$scope.apply_sensitivity = function(){
			var disease = _.where($scope.nodes, {disease: true});
			var true_positives = _.sample(disease, $scope.sensitivity/100*disease.length);
			_.each(_.without(disease, true_positives), function(node){
				node.test_positive = false;
			})
			_.each(true_positives, function(node){
				node.test_positive = true;
			})
		}

		$scope.apply_specificity = function(){
			var healthy = _.where($scope.nodes, {disease: false});
			var true_negatives = _.sample(healthy, $scope.specificity/100*healthy.length);
			_.each(_.without(healthy, true_negatives), function(node){
				node.test_positive = true;
			})
			_.each(true_negatives, function(node){
				node.test_positive = false;
			})
		}
  });
