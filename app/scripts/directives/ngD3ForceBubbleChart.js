'use strict';

angular.module('mediconditionalApp')
  .directive('ngForceBubbleChart', function () {

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
      template: '<div style="border:solid 2px red;"></div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
    		var width = element.width(),
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
	    					target.x =  parseInt(width/4);
	    				} else {
								 target.x = parseInt(width*3/4)
	    				}
    				}
    				if(d.test_positive !=undefined){
    					if(d.test_positive){
    						target.y = parseInt(height*2/4);
    					} else {
								target.y = parseInt(height*3/4);
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
      	vis = d3.select(element.find('div')[0]).append("svg")
      					.attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis");

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
        	if(new_val>old_val){
        		for (var j=old_val; j<new_val; j++){
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
