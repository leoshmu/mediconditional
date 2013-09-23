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
    	$scope.population.disease_count  = disease.length;
    	$scope.population.healthy_count = $scope.population.total - disease.length;

    	_.each(_.without($scope.nodes, disease), function(node){
    		node.disease = false;
    	})
    	_.each(disease, function(node){
    		node.disease = true;
    	})
    }

    $scope.$watch('prevalence', function(oldVal, newVal){
    	if(oldVal != newVal){
	    	$scope.apply_prevalence();
	    	$scope.apply_sensitivity();
	    	$scope.apply_specificity();
    	}
    });

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
		$scope.$watch('sensitivity', function(oldVal, newVal){
    	if(oldVal != newVal){
	    	$scope.apply_sensitivity();
    	}
    });

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

		$scope.$watch('specificity', function(oldVal, newVal){
    	if(oldVal != newVal){
	    	$scope.apply_specificity();
    	}
    });
  });
