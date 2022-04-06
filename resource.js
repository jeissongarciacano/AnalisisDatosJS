let body = d3.select("#body")
let container = d3.select("#container-grap1")


let ejex;
let ejey;

function Main() {

    ejex = document.getElementById("ejex").value;
    ejey = document.getElementById("ejey").value;

    clear();

    if(ejex == 0 || ejey == 0){
        window.alert("seleccione un dato");
    }
    else{
        madedata(ejex,1);
        madedata(ejey,2);
        d3.csv("Data.csv").then((data) => {
            showData(data);
        })
    } 
}

//limpiar datos
function clear(){
    body.selectAll("*").remove();
}
//crear el text
function madedata(id,axis){
    var text = "";
    switch (id) {
        case "Tratamiento":
            text = "<br>Tratamiento:<br>1 = KMC menos de 2001g<br>2 = Control menos de 2001g<br>3 = Mas de 2500g ";
            break;
        case "Pretermino":
            text = "<br>Prematuro:<br>0 = No es prematuro<br><br>1 = Es prematuro";
            break;
        case "BIRTH_cesarea":
            text = "<br>Parto:<br>0 = Parto por cesarea<br>1 = Parto natural";
            break;
        case "BIRTH_sexo5":
            text = "<br>Genero:<br>1 = Femenino<br>2 = Masculino";
            break; 
        case "BIRTH_peso5":
            text = "<br>Peso:<br>gramos<br>Valido más de 491g<br>0 = Datos perdidos";
            break;
        case "BIRTH_talla5":
            text = "<br>Talla:<br>milimetros<br>Valido más de 485mm<br>6 <= D , Datos perdidos";
            break; 
        case "BIRTH_pc5":
            text = "<br>Circunferencia de la cabeza:<br>milimetros<br>Valido más de 406mm<br>85 <= D , Datos perdidos";
            break;
        case "FOLL12M_peso12":
            text = "<br>Peso:<br>gramos<br>Valido más de 449g<br>42 <= D , Datos perdidos";
            break;
        case "FOLL12M_talla12":
            text = "<br>Talla:<br>milimetros<br>Valido más de 444mm<br>47 <= D , Datos perdidos";
            break;
        case "FOLL12M_pc12":
            text = "<br>Circunferencia de la cabeza:<br>milimetros<br>Valido más de 451mm<br>40 <= D , Datos perdidos";
            break;
        case "FOLL12M_infanib12":
            text = "<br>Neuromotor test:<br>0 = No se realizo la evaluacion<br><br>1 = Normal<br><br>2 = Transitorio<br><br>3 = Anormal";
            break;
        case "aseg_cerveletWMtotal":
            text = "<br>Cervelet WM total:<br>Valido más de 299<br>192 <= D , Datos perdidos";
            break; 
        case "aseg_cerveletGMtotal":
            text = "<br>Cervelet GM total:<br>Valido más de 299<br>192 <= D , Datos perdidos";
            break;
        case "aseg_hipocampototal":
            text = "<br>Cipocampo total:<br>Valido más de 299<br>192 <= D , Datos perdidos";
            break; 
        case "aseg_caudatetotal":
            text = "<br>Caudate total:<br>Valido más de 299<br>192 <= D , Datos perdidos";
            break;
        case "aseg_putamentotal":
            text = "<br>Putamen total:<br>Valido más de 299<br>192 <= D , Datos perdidos";
            break;
        case "aseg_amigdalatotal":
            text = "<br>Amigdala total:<br>Valido más de 299<br>192 <= D , Datos perdidos";
            break;
        default:
            break;
    }
    insertdata(text,axis);
}
//insertar datos en el dom
function insertdata(text,axis){
    if(axis == 1) document.getElementById("dataejex").innerHTML = text;
    else document.getElementById("dataejey").innerHTML = text;
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
    let xExtent = d3.extent(clients, d => +d[ejex])
    let xScale = d3.scaleLinear().range([0, bodyWidth])
        .domain([xExtent[0] - 5, xExtent[1] + 5])


    let yExtent = d3.extent(clients, d => +d[ejey])
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
        .attr("cx", d => xScale(+d[ejex]))
        .attr("cy", d => yScale(+d[ejey]))


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
            .attr("cx", d => newXScale(+d[ejex]))
            .attr("cy", d => newYScale(+d[ejey]))
            .on("mouseenter", (d) => { 
                let dat = "Hombre"
                if (d.BIRTH_sexo5 == 2) {
                  dat = "Mujer";
                }
                showTooltip(dat, [d3.event.clientX, d3.event.clientY])
            })
            .on("mousemove", (d) => {
                let dat = "Ver mas"
                showTooltip(dat, [d3.event.clientX, d3.event.clientY + 30])
            })
            .on("mouseleave", (d) => {
                d3.select("#tooltip").style("display", "none")
            })
            .on("click", (d) => {
                selecteddata = d[ejex];
                selecteddata2 = d[ejey];
                showGraphics(clients,d);
            })
            .merge(container)
            .style("fill", d => d[ejex] == selecteddata && d[ejey] == selecteddata2 ? "red" : "orange") //change color
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
