let body = d3.select("#body")
let container = d3.select("#container-grap1")

let selecteddata = undefined;

let ejex;
let ejey;

function Main() {

    clear();

    ejex = document.getElementById("ejex").value;
    ejey = document.getElementById("ejey").value;
    console.log(ejex);
    console.log(ejey);

    if(ejex == 0 || ejey == 0){
        window.alert("seleccione un dato");
    }
    else{
        d3.csv("Data.csv").then((data) => {
            showData(data);
        })
    } 
}

//limpiar datos
function clear(){
    body.selectAll("*").remove();
}

function showTooltip(text, coords) {
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip")
      .style("display", "block")
      .style("top", y)
      .style("left", x)
      .text(text)
  }

function showData(clients) {

    let bodyWidth = 300;
    let bodyHeight = 300;
    let xExtent = d3.extent(clients, d => +d.BIRTH_peso5)
    let xScale = d3.scaleLinear().range([0, bodyWidth])
        .domain([xExtent[0] - 5, xExtent[1] + 5])


    let yExtent = d3.extent(clients, d => +d.BIRTH_talla5)
    let yScale = d3.scaleLinear().range([bodyHeight, 0])
        .domain([yExtent[0] - 5, yExtent[1] + 5])

    let join = body.selectAll("circle")
        .data(clients)

    let newelements = join.enter()
        .append("circle")
        .style("fill", "orange")
        .style("r", "5")

    join.merge(newelements)
        .transition()
        .attr("cx", d => xScale(+d.BIRTH_peso5))
        .attr("cy", d => yScale(+d.BIRTH_talla5))


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
            .attr("cx", d => newXScale(+d.BIRTH_peso5))
            .attr("cy", d => newYScale(+d.BIRTH_talla5))
            .on("mouseenter", (d) => { 
                let dat = "Hombre"
                if (d.BIRTH_sexo5 == 2) {
                  dat = "Mujer";
                }
                showTooltip(dat, [d3.event.clientX, d3.event.clientY])
            })
            .on("mousemove", (d) => {
                let dat = "Hombre"
                if (d.BIRTH_sexo5 == 2) {
                  dat = "Mujer";
                }
                showTooltip(dat, [d3.event.clientX, d3.event.clientY + 30])
            })
            .on("mouseleave", (d) => {
                d3.select("#tooltip").style("display", "none")
            })
            .on("click", (d) => {
                console.log(d)
                showGraphics(clients,d);
            })

    });
    container.call(zoom)

}

function showTooltip(text, coords) {
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip")
        .style("display", "block")
        .style("top", y)
        .style("left", x)
        .text(text)
}
