"use strict";angular.module("mediconditionalApp",[]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("mediconditionalApp").controller("MainCtrl",["$scope",function(a){a.population={total:500},a.prevalence=8,a.sensitivity=90,a.specificity=93,a.nodes=[],a.is_prevalence_applied=!1,a.is_sensitivity_applied=!1,a.is_specificity_applied=!1,a.apply_prevalence=function(){a.is_prevalence_applied=!0;var b=_.sample(a.nodes,a.prevalence*a.population.total/1e3);a.population.disease_count=b.length,a.population.healthy_count=a.population.total-b.length,_.each(_.without(a.nodes,b),function(a){a.disease=!1}),_.each(b,function(a){a.disease=!0})},a.$watch("prevalence",function(b,c){b!=c&&(a.apply_prevalence(),a.is_specificity_applied&&a.apply_specificity(),a.is_sensitivity_applied&&a.apply_sensitivity())}),a.apply_sensitivity=function(){a.is_sensitivity_applied=!0;var b=_.where(a.nodes,{disease:!0}),c=_.sample(b,a.sensitivity/100*b.length);a.population.true_positive_count=c.length,a.population.false_negative_count=b.length-c.length,_.each(b,function(a){a.test_positive=_.contains(c,a)?!0:!1})},a.$watch("sensitivity",function(b,c){b!=c&&a.apply_sensitivity()}),a.apply_specificity=function(){a.is_specificity_applied=!0;var b=_.where(a.nodes,{disease:!1}),c=_.sample(b,a.specificity/100*b.length);_.without(b,c),a.population.true_negative_count=c.length,a.population.false_positive_count=b.length-c.length,_.each(b,function(a){a.test_positive=_.contains(c,a)?!1:!0})},a.$watch("specificity",function(b,c){b!=c&&a.apply_specificity()})}]),angular.module("mediconditionalApp").directive("ngForceBubbleChart",function(){var a=function(a){return a.disease?a.test_positive?"#EDB7B7":"#E62222":a.test_positive?"#F576A0":"#EBD7FC"};return{transclude:!0,templateUrl:"/views/sensitivity_specificity_chart.html",restrict:"EA",link:function(b,c){var d,e,f=c.find("svg").parent().prop("offsetWidth"),g=600,h=.2,i=.2,j=function(a){return-Math.pow(a.radius,2)/16},k=function(a){return function(b){var c={x:f/2,y:g/2};void 0!=b.disease&&(c.x=b.disease?parseInt(f/8):parseInt(7*f/8)),void 0!=b.test_positive&&(c.y=b.test_positive?parseInt(1*g/8):parseInt(7*g/8)),b.x=b.x+(c.x-b.x)*(h+.12)*a,b.y=b.y+(c.y-b.y)*(h+.12)*a}},l=function(a,c){b.nodes.push({id:a,radius:c,x:Math.random()*f,y:Math.random()*g})},m=function(){e=d.selectAll("circle").data(b.nodes,function(a){return a.id}),e.enter().append("circle").attr("r",0).attr("stroke-width",2).attr("id",function(a){return"bubble_"+a.id}).attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}),e.transition().duration(2e3).attr("r",function(){return 4*(f/b.nodes.length)}),e.attr("fill",function(b){return a(b)}).attr("stroke",function(b){return d3.rgb(a(b)).darker()}),e.exit().remove,q.start()},n=function(){d.append("line").style("stroke-dasharray","3, 3").attr("x1",f/2).attr("x2",f/2).attr("y1",0).attr("y2",g).attr("stroke-width",2).attr("stroke","gray")},o=function(){d.append("line").style("stroke-dasharray","3, 3").attr("x1",f/2).attr("x2",f).attr("y1",g/2).attr("y2",g/2).attr("stroke-width",2).attr("stroke","gray")},p=function(){d.append("line").style("stroke-dasharray","3, 3").attr("x1",0).attr("x2",f/2).attr("y1",g/2).attr("y2",g/2).attr("stroke-width",2).attr("stroke","gray")};d=d3.select("svg").attr("width",f).attr("height",g).attr("id","svg_vis"),b.$watch("is_prevalence_applied",function(a){a&&n()}),b.$watch("is_sensitivity_applied",function(a){a&&p()}),b.$watch("is_specificity_applied",function(a){a&&o()});var q=d3.layout.force().nodes(b.nodes).size([f,g]).gravity(i).charge(j).friction(.9).on("tick",function(a){e.each(k(a.alpha)).attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}).call(q.drag)});b.$watch("population.total",function(a,b){if(console.log(a,b||0),a>(b||0)){for(var c=b||0;a>c;c++)console.log(c),l(c,20);m()}}),b.$watch("nodes",function(){m()},!0);for(var r=0;r<b.population.total;r++)l(r,20);m()}}}),angular.module("mediconditionalApp").factory("PopulationBreakdown",[function(){var a=42;return{someMethod:function(){return a}}}]);