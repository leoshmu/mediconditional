'use strict';

angular.module('mediconditionalApp')
  .directive('ngForceBubbleChart', function () {

  	var fill_color = function(node){
  		if(!node.disease){
	  		return '#EBD7FC';
  		} else{
  			return 'red';
  		}
  	}

    return {
      template: '<div style="border:solid 2px red;"></div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
    		var width = 940,
      			height = 600,
      			damper = 0.1,
						layout_gravity = .2,
      			vis,
      			circles,

      			center = {x: width/2, y: height/2};


      	var charge = function(d) {
    			return -Math.pow(d.radius, 2.0) / 16;
  			}

      	var move_towards_center = function(alpha) {
    			return function(d) {
    				var target = {x: width/2, y: height/2}
    				if(d.disease != undefined){

	    				if(d.disease){
	    					target.y =  parseInt(height/4);
	    				} else {
								 target.y = parseInt(height*3/4)
	    				}
    				}
    				if(d.test_positive !=undefined){
    					if(d.test_positive){
    						target.x = parseInt(width*3/4);
    					} else {
								target.x = parseInt(width*1/4);
    					}
	    			}
			      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha;
			      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha;
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
						      .attr("stroke", function(d) {return d3.rgb(fill_color(d)).darker();})
						      .attr("id", function(d) { return  "bubble_" + d.id; })
						      .attr("cx", function(d) { return  d.x; })
						      .attr("cy", function(d) { return  d.y; })
						circles.transition().duration(2000).attr("r", function(d) { return width/scope.nodes.length*4; });
						circles.attr("fill", function(d) { return fill_color(d) ;})
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
        	console.log('hi')
        	update();
        }, true)

        for(var i=0; i<scope.population.total; i++){
        	add_nodes(i,20);
        }

		    update();

				}
    };
  });
