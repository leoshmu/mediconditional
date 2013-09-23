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
    $scope.is_prevalence_applied = false;
    $scope.is_sensitivity_applied = false;
    $scope.is_specificity_applied = false;

    // maybe use something like this
    // to "start" the simulation
    // $scope.apply_population = function(){
    // 	$scope.population.total = 500;
    // }

    $scope.apply_prevalence = function(){
    	$scope.is_prevalence_applied = true;
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
	    	if($scope.is_specificity_applied){
		    	$scope.apply_specificity();
	    	}
	    	if($scope.is_sensitivity_applied){
		    	$scope.apply_sensitivity();
	    	}
    	}
    });

		$scope.apply_sensitivity = function(){
			$scope.is_sensitivity_applied = true;
			var disease = _.where($scope.nodes, {disease: true});
			var true_positives = _.sample(disease, $scope.sensitivity/100*disease.length);


			$scope.population.true_positive_count = true_positives.length;
			$scope.population.false_negative_count = disease.length - true_positives.length;

			_.each(disease, function(node){
				if(_.contains(true_positives, node)){
					// it's a true positive node
					node.test_positive = true;
				} else {
					node.test_positive = false;
				}
			});

		}
		$scope.$watch('sensitivity', function(oldVal, newVal){
    	if(oldVal != newVal){
	    	$scope.apply_sensitivity();
    	}
    });

		$scope.apply_specificity = function(){
			$scope.is_specificity_applied = true;
			var healthy = _.where($scope.nodes, {disease: false});
			var true_negatives = _.sample(healthy, $scope.specificity/100*healthy.length);
			var false_positives = _.without(healthy, true_negatives);

			$scope.population.true_negative_count = true_negatives.length;
			$scope.population.false_positive_count = healthy.length - true_negatives.length;

			_.each(healthy, function(node){
				if(_.contains(true_negatives, node)){
					// it's a true negative node
					node.test_positive = false;
				} else {
					node.test_positive = true;
				}
			})

		}

		$scope.$watch('specificity', function(oldVal, newVal){
    	if(oldVal != newVal){
	    	$scope.apply_specificity();
    	}
    });
  });
