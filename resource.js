let body = d3.select("#body")
let container = d3.select("#container-grap1")

d3.csv("Datos_Longitudinales.xlsx").then((data) => {
    showData(data);
})

function showData(clients) {


    let bodyWidth = 300;
    let bodyHeight = 300;
    let xExtent = d3.extent(clients, d => +d.Weight)
    let xScale = d3.scaleLinear().range([0, bodyWidth])
        .domain([xExtent[0] - 5, xExtent[1] + 5])


    let yExtent = d3.extent(clients, d => +d.Height)
    let yScale = d3.scaleLinear().range([bodyHeight, 0])
        .domain([yExtent[0] - 5, yExtent[1] + 5])

    let join = body.selectAll("circle")
        .data(clients)

    let newelements = join.enter()
        .append("circle")
        .style("fill", "blue")
        .style("r", "5")

    join.merge(newelements)
        .transition()
        .attr("cx", d => xScale(+d.Weight))
        .attr("cy", d => yScale(+d.Height))


    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = d3.select("#yAxis")
        .style("transform", "translate(40px, 10px)")
        .call(yAxis)

    let xAxis = d3.axisBottom(xScale)
    let xAxisGroup = d3.select("#xAxis")
        .style("transform", `translate(40px, ${bodyHeight + 10}px)`)
        .call(xAxis)

    let zoom = d3.zoom()
    zoom.on("zoom", function (a, b) {
        let newXScale = d3.event.transform.rescaleX(xScale);
        let newYScale = d3.event.transform.rescaleY(yScale);

        xAxis.scale(newXScale)
        xAxisGroup.call(xAxis)

        yAxis.scale(newYScale)
        yAxisGroup.call(yAxis)

        join.merge(newelements)
            .attr("cx", d => newXScale(+d.Weight))
            .attr("cy", d => newYScale(+d.Height))
    });
    container.call(zoom)

}