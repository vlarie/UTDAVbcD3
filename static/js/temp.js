  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter();

  // var theCircles = chartGroup.selectAll("g theCircles").data(newsData).enter();

  circlesGroup.append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r",  20) // d => (d[`${chosenXAxis} + "Moe"`]) * 20)  // in development - attempting to make the size of the circle dynamic based on margin of error
    .attr("fill", "blue")
    .attr("opacity", ".5")
    ;
  
  circlesGroup.append("text")
    .classed("stateText", true)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))  
    .attr("font-size", 20) 
    .text(d => d.abbr);



    
// app.js should contain mvp
// mvp = minimally viable product