// Retrieve data from the CSV file and execute everything below
var file = "data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  console.log("Unable to retrieve data");
  throw error;
}

function successHandle(newsData) {
  console.log("Logging data...");
  // parse data
  newsData.forEach(function(data) {
    data.state = data.state;
    data.abbr = data.abbr;
    console.log(`The state is: ${data.state}/${data.abbr}`);
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });


  // xLinearScale function above csv import
  var xLinearScale = xScale(newsData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(newsData, chosenYAxis);
  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r",  20) // d => (d[`${chosenXAxis} + "Moe"`]) * 20)  // in development - attempting to make the size of the circle dynamic based on margin of error
    .attr("fill", "blue")
    .attr("opacity", ".5")
    ;
    
  // @TODO all state abbr
  // Text present but not visible
  circlesGroup.append("text")
    .classed("stateText", true)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))  
    .attr("font-size", 20) 
    .text(d => d.abbr);


  // Group for 3 x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .classed("axis-text", true);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");
    
    
  // Group for 3 y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -80)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -60)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");



  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var valueX = d3.select(this).attr("value");
      console.log(`The valueX is: ${valueX}`);
      if (valueX !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = valueX;

        console.log(`The valueX is: ${chosenXAxis}`)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(newsData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Changes classes to change bold text
        // given X-Axis is selected
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenXAxis === "age" ) {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenXAxis === "income" ) {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    }
    );

  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var valueY = d3.select(this).attr("value");
      if (valueY !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = valueY;

        console.log(`The valueY is: ${chosenYAxis}`)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(newsData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
          
        // Changes classes to change bold text
        // or given Y-Axis selected
          if (chosenYAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes" ) {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "healthcare" ) {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      }
    );


  } // end successHandle

// app.js should contain mvp
// mvp = minimal viable product

/////////////////////////////////////////////////////////////
