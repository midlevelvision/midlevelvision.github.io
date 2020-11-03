
(function($) {
    "use strict"
    
    /* --------------------------------------------------- */
	/*  Particle JS
	------------------------------------------------------ */
	// $('.home-particles').particleground({
	// 	dotColor: '#fff',
	// 	lineColor: '#555555',
	// 	particleRadius: 6,
	// 	curveLines: true,
	// 	density: 10000,
	// 	proximity: 110
    // });
    
    document.getElementById("learnmore").onclick = function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#abstract").offset().top
        }, 600);
    };

    $(document).ready(function($) {
		$('.counter').counterUp({
			delay: 10,
			time: 1000
		});
    });
    
    
	///////////////////////////
	// magnificPopup
	$('.work').magnificPopup({
		delegate: '.lightbox',
		type: 'iframe'
	});

	// Example 1: From an element in DOM
	$('.bibtex').magnificPopup({
		delegate: '.open-popup-link',	
		type:'inline',
		midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
    

    /* Service box height */
    var ensureSameSize = function(className){
        var boxes = $('.' + className);
        var maxHeight = Math.max.apply(
          Math, boxes.map(function() {
            return $(this).outerHeight();
        }).get());
        // boxes.height(maxHeight);
        boxes.css('height', maxHeight);        
        return maxHeight;
    };

    var resizeMinHeight = function(className) {
        var boxes = $('.' + className);
        boxes.css('height', "");        
        ensureSameSize(className);
    }

    $( document ).ready (
        function () {
            ensureSameSize('service-row-1');
            ensureSameSize('service-row-2');
            $( window ).resize(function() {
                resizeMinHeight('service-row-1');
                resizeMinHeight('service-row-2');
            });
        }
    );
})(jQuery);


// function hilbertDemo() {

//     var svg = d3.select('svg#hilbert-chart'),
//         canvasWidth = Math.min(window.innerWidth, window.innerHeight - 100),
//         hilbert,
//         order = 3;

//     function d3Digest() {
//         var hilbertData = {
//             start: 0,
//             length: Math.pow(4, order)
//         };

//         hilbert.order(order).layout(hilbertData);

//         svg.selectAll('path')
//             .datum(hilbertData)
//             .attr('d', function(d) { return getHilbertPath(d.pathVertices); })
//             .attr('transform', function(d) {
//                 return 'scale('+ d.cellWidth + ') '
//                     + 'translate(' + (d.startCell[0] +.5) + ',' + (d.startCell[1] +.5) + ')';
//             });

//         svg.select('path:not(.skeleton)')
//             .transition().duration(order * 1000).ease(d3.easePoly)
//             .attrTween('stroke-dasharray', tweenDash);

//         function getHilbertPath(vertices) {
//             var path = 'M0 0L0 0';

//             vertices.forEach(function(vert) {
//                 switch(vert) {
//                     case 'U': path += 'v-1'; break;
//                     case 'D': path += 'v1'; break;
//                     case 'L': path += 'h-1'; break;
//                     case 'R': path += 'h1'; break;
//                 }
//             });
//             return path;
//         }

//         function tweenDash() {
//             var l = this.getTotalLength(),
//                 i = d3.interpolateString("0," + l, l + "," + l);
//             return function(t) { return i(t); };
//         }
//     }

//     function orderChange(newOrder) {
//         order = newOrder;
//         d3Digest();
//     }

//     function init() {

//         hilbert = d3.hilbert()
//             .order(order)
//             .canvasWidth(canvasWidth)
//             .simplifyCurves(false);

//         svg.attr("width", canvasWidth).attr("height", canvasWidth);

//         var canvas = svg.append('g');
//         canvas.append('path').attr('class', 'skeleton');
//         canvas.append('path');

//         // Canvas zoom/pan
//         svg.call(d3.zoom()
//             .translateExtent([[0, 0], [canvasWidth, canvasWidth]])
//             .scaleExtent([1, Infinity])
//             .on("zoom", function() {
//                 canvas.attr("transform", d3.event.transform);
//             })
//         );

//         // Value Tooltip
//         var valTooltip = d3.select('#val-tooltip');
//         svg.on('mouseover', function() { valTooltip.style("display", "inline"); })
//             .on('mouseout', function() { valTooltip.style("display", "none"); })
//             .on('mousemove', function () {
//                 var coords = d3.mouse(canvas.node());
//                 valTooltip.text(hilbert.getValAtXY(coords[0], coords[1]))
//                     .style('left', d3.event.pageX)
//                     .style('top', d3.event.pageY);
//             });

//         // Order slider
//         $('input#hilbert-order').slider({
//             step: 1,
//             max: 9,
//             min: 0,
//             value: order,
//             tooltip: 'always',
//             tooltip_position: 'bottom',
//             formatter: function(d) {
//                 return 'Order: ' + d;
//             }
//         }).on('change', function(e) {
//             orderChange(e.value.newValue);
//         });

//         d3Digest();
//     }

//     init();
// }
