let margin = { left: 40, bottom: 20, right: 20, top: 20 }
let height = 200


let showGraphics = function (data, person) {
    console.log(data);
    let gContainer = d3.select("#gContainer");

    //Show Sex
    let sexo = person.BIRTH_sexo5 == "2" ? "Masculino" : "Femenino";
    gContainer.append("div").attr("id", "gTitle").text(sexo);

    //fix height
    data.map(function (d) {
        if (parseInt(d.BIRTH_talla5) > parseInt(d.FOLL12M_talla12)) {
            d.FOLL12M_talla12 = d.FOLL12M_talla12 + "0";
        }
    });
    if (parseInt(person.BIRTH_talla5) > parseInt(person.FOLL12M_talla12)) {
        person.FOLL12M_talla12 = person.FOLL12M_talla12 + "0";
    }

    let weightData = [{ time: 1, value: parseInt(person.BIRTH_talla5) }, { time: 2, value: parseInt(person.FOLL12M_talla12) }];
    generateLineWeight(data,weightData);
}

let generateLineWeight = function (data,weightData) {
    let timeline = d3.select("#timelineWeight")
    let width = 20;
    let bodyHeight = height - margin.top - margin.bottom;
    let bodyWidth = width - margin.left - margin.right;
    let maxWeight = d3.max(data, d => d.FOLL12M_talla12);

    let yScale = d3.scaleLinear()
        .range([bodyHeight, 0])
        .domain([0, maxWeight]);
    
    let xScale = d3.scaleLinear()
        .range([0, 20])
        .domain([1, 2]);
    
    let lineGenerator = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value));
    
    timeline.select(".body")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .select("path").datum(weightData)
        .attr("d", lineGenerator)
    
    timeline.select(".xAxis")
        .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(1))
    
    timeline.select(".yAxis")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale)
            .ticks(5)
        .tickFormat(d => d + "cm"));
 }


d3.csv("data.csv").then((data) => {
    showGraphics(data, data[0]);
});