let margin = { left: 40, bottom: 20, right: 20, top: 20 }
let height = 200


let showGraphics = function (data, person) {
    let gContainer = d3.select("#gContainer");
    console.log(person);
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

    //weight
    let weightData = [{ time: 1, value: parseInt(person.BIRTH_talla5) }, { time: 2, value: parseInt(person.FOLL12M_talla12) }];
    let maxWeight = d3.max(data, d => d.FOLL12M_talla12);
    let timelineWeight = d3.select("#timelineWeight")
    generateLineChart(maxWeight, weightData,timelineWeight,"cm");
    
    //height
    let heightData = [{ time: 1, value: parseInt(person.BIRTH_peso5) }, { time: 2, value: parseInt(person.FOLL12M_peso12) }];
    let maxHeight = d3.max(data, d => d.FOLL12M_peso12);
    let timelineHeight = d3.select("#timelineHeight")
    generateLineChart(maxHeight, heightData,timelineHeight,"gr");
}

let formatTime = function (option) { 
    switch (option) { 
        case 1||"1": return "Birth";
        case 2||"2": return "Year";
        default: return "NaN";
    }
}

let generateLineChart = function (max, data,timeline,suffix) { 
    let width = 100;
    let bodyHeight = height - margin.top - margin.bottom;
    let bodyWidth = width - margin.left - margin.right;

    let yScale = d3.scaleLinear()
        .range([bodyHeight, 0])
        .domain([0, max]);
    
    let xScale = d3.scaleLinear()
        .range([0, bodyWidth])
        .domain([1, 2]);

    let lineGenerator = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value));
    
    timeline.select(".body")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .select("path").datum(data)
        .attr("d", lineGenerator)
    
    timeline.select(".xAxis")
        .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
            .ticks(1)
            .tickFormat(d => formatTime(d)));
    timeline.select(".yAxis")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(d => d + suffix));
}

d3.csv("data.csv").then((data) => {
    showGraphics(data, data[3]);
});