'use strict';

angular.module('mediconditionalApp')
  .directive('ngForceBubbleChart', function () {

  	// no clue what to make the colors.
  	// Is there a way to have some color
  	// represent disease/healthy
  	// and some shading of it represent test outcome
  	// and the False Positive and False Negatives have something
  	// similar too?
  	//
  	var fill_color = function(node){
  		if(!node.disease){
  			if(node.test_positive){
  				return '#F576A0';
  			} else {
		  		return '#EBD7FC';
  			}
  		} else{
  			if(node.test_positive){
  				return '#EDB7B7';
  			} else {
  				return '#E62222';
  			}
  		}
  	}

    return {
      transclude:true,
      templateUrl: '/views/sensitivity_specificity_chart.html',
      restrict: 'EA',

      link: function postLink(scope, element, attrs) {
    		var width = element.find('svg').parent().width(),
      			height = 600,
      			damper = 0.2,
						layout_gravity = .2,
      			vis,
      			circles,

      			center = {x: width/4, y: height/4};


      	var charge = function(d) {
    			return -Math.pow(d.radius, 2.0) / 16;
  			}

      	var move_towards_center = function(alpha) {
    			return function(d) {
    				var target = {x: width/2, y: height/2}
    				if(d.disease != undefined){

	    				if(d.disease){
	    					target.x =  parseInt(width/8);
	    				} else {
								 target.x = parseInt(width*7/8)
	    				}
    				}
    				if(d.test_positive !=undefined){
    					if(d.test_positive){
    						target.y = parseInt(height*1/8);
    					} else {
								target.y = parseInt(height*7/8);
    					}
	    			}
			      d.x = d.x + (target.x - d.x) * (damper + 0.12) * alpha;
			      d.y = d.y + (target.y - d.y) * (damper + 0.12) * alpha;
			    };
			  }

			  var add_nodes = function(id, radius){
			  	scope.nodes.push({
      			id : id,
      			radius: radius,
      			x: Math.random() * width,
      			y: Math.random() * height
      		});
			  }

			  var update = function(){
			  	circles = vis.selectAll("circle")
		                 		.data(scope.nodes, function(d) { return d.id ;});

		       	circles.enter().append("circle")
						      .attr("r", 0)

						      .attr("stroke-width", 2)

						      .attr("id", function(d) { return  "bubble_" + d.id; })
						      .attr("cx", function(d) { return  d.x; })
						      .attr("cy", function(d) { return  d.y; })
						circles.transition().duration(2000).attr("r", function(d) { return width/scope.nodes.length*4; });
						circles.attr("fill", function(d) { return fill_color(d) ;})
						.attr("stroke", function(d) {return d3.rgb(fill_color(d)).darker();})
						circles.exit().remove
		        force.start();
			  }

			  var add_prevalence_line = function(){
			  	vis.append("line")
						.style("stroke-dasharray", ("3, 3"))
						.attr("x1", width/2)
						.attr("x2", width/2)
						.attr("y1", 0)
						.attr("y2", height)
						.attr('stroke-width', 2)
						.attr('stroke', 'gray');
			  }

			  var add_specificity_line = function(){
			  	vis.append("line")
						.style("stroke-dasharray", ("3, 3"))
						.attr("x1", width/2)
						.attr("x2", width)
						.attr("y1", height/2)
						.attr("y2", height/2)
						.attr('stroke-width', 2)
						.attr('stroke', 'gray');
			  }

			  var add_sensitivity_line = function(){
			  	vis.append("line")
						.style("stroke-dasharray", ("3, 3"))
						.attr("x1", 0)
						.attr("x2", width/2)
						.attr("y1", height/2)
						.attr("y2", height/2)
						.attr('stroke-width', 2)
						.attr('stroke', 'gray');
			  }
      	vis = d3.select('svg')
      					.attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis");



				scope.$watch('is_prevalence_applied', function(new_val){
					if(new_val){
						add_prevalence_line();
					}
				});

				scope.$watch('is_sensitivity_applied', function(new_val){
					if(new_val){
						add_sensitivity_line();
					}
				});

				scope.$watch('is_specificity_applied', function(new_val){
					if(new_val){
						add_specificity_line();
					}
				});

				var force = d3.layout.force()
            .nodes(scope.nodes)
            .size([width, height])
            .gravity(layout_gravity)
    				.charge(charge)
	         	.friction(0.9)
	         	.on("tick", function(e) {
	            circles.each(move_towards_center(e.alpha))
	                   .attr("cx", function(d) {return d.x;})
	                   .attr("cy", function(d) {return d.y;})
	                   .call(force.drag);
							}
						);

        scope.$watch("population.total", function(new_val, old_val){
        	console.log(new_val, old_val||0)
        	if(new_val>(old_val||0)){
        		for (var j=old_val||0; j<new_val; j++){
        		console.log(j)
        			add_nodes(j,20);
        		}
        		update();

        	}
        })
        scope.$watch('nodes', function(new_val, old_val){
        	update();
        }, true)

        for(var i=0; i<scope.population.total; i++){
        	add_nodes(i,20);
        }

		    update();

				}
    };
  });
