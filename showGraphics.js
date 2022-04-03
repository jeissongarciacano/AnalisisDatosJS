
let showGraphics = function (data,person) {
    console.log(data);
    let gContainer = d3.select("#gContainer");

    //Show Sex
    let sexo=person.BIRTH_sexo5=="2"?"Masculino":"Femenino";
    gContainer.append("div").attr("id", "gTitle").text(sexo);

    //fix height
    data.map(function (d) { 
        if (parseInt(d.BIRTH_talla5) > parseInt(d.FOLL12M_talla12)) {
            d.FOLL12M_talla12=d.FOLL12M_talla12+"0";
         }
    });
    let maxWeight = d3.max(data, d => d.FOLL12M_talla12);
    console.log("max", maxWeight);
    console.log("data", data[0].FOLL12M_talla12);
}
d3.csv("data.csv").then((data) => {
    showGraphics(data,data[0]);
});