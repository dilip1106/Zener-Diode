currtrigger = -10;
// var xValues = [0, 2.95, 3.0, 3.05, 3.1, 3.15, 3.2, 3.25, 3.3];
var xValues = [3.3, 3.25, 3.2, 3.15, 3.1, 3.05, 3.0, 2.95, 0];
var logValues = [];
var count = 0;
let ebg = 0;
let slope = 0;
const set = new Set();
let trigger = 0;
let flag = 0;
setTimeout(() => {
  fillTable();
}, 3700);


const range = document.getElementById('range');

  range.addEventListener('input', (event) => {

    if(localStorage.getItem("circuitComplete") == "true"){
      const newIndex = event.target.value;
      localStorage.setItem("newIndex",newIndex)
    }
    else{
      alert("Complete the circuit first")
    }
  });
var currarrgraph= []
var voltarrgraph= []
  document.getElementById("addtable").addEventListener("click", addTable);
  let rowCountIndex=0;
  let idx;
    function addTable(){
      if(localStorage.getItem("circuitComplete") === "true"){
        
          srno = document.getElementsByClassName("srno")[rowCountIndex];
          current = document.getElementsByClassName(`curr`)[rowCountIndex];
          voltage = document.getElementsByClassName(`voltage`)[rowCountIndex];
          
          
          let curr = localStorage.getItem("current")
          let volt = localStorage.getItem("voltage")
          currarrgraph.push(curr)
          voltarrgraph.push(volt)
          // console.log(currarrgraph)  
          srno.value =rowCountIndex+1;
          current.value = curr;
          voltage.value = volt;
          rowCountIndex++;
          
      }
      else{
        alert("Complete the circuit first")
      }
      
    }
function fillTable() {
  filltableintrval = setInterval(() => {
    if (localStorage.getItem("fullScreen") == "true") {
      snackbarFunction(
        "Put the key and press on the Power Supply button and Heater button to begin."
      );
      localStorage.setItem("fullScreen", false);
      setTimeout(() => {
        snackbarFunction(
          "Readings are automatically recorded in the Table and Graph will be plotted."
        );
      }, 13000);
    }

    var rowData = JSON.parse(localStorage.getItem("rowData"));
    if (rowData.tempc && rowData.sno < 8) {
      srno = document.getElementsByClassName("srno")[rowData.sno];
      tempc = document.getElementsByClassName("tempc")[rowData.sno];
      tempk = document.getElementsByClassName("tempk")[rowData.sno];
      curr = document.getElementsByClassName("current")[rowData.sno];
      tsqr = document.getElementsByClassName("tempsqr")[rowData.sno];
      tinv = document.getElementsByClassName("tempinv")[rowData.sno];
      log = document.getElementsByClassName("log")[rowData.sno];

      let temp;
      srno.value = rowData.sno + 1;
      tempc.value = rowData.tempc;
      tempk.value = rowData.tempc + 273;

      temp = rowData.curr;
      curr.value = temp.toFixed(2);

      temp = Math.pow(rowData.tempc + 273, 2);
      tsqr.value = temp.toFixed(0);

      temp = Math.pow(rowData.tempc + 273, -1) * 1000;
      tinv.value = temp.toFixed(4);

      temp = Math.log10(rowData.curr / Math.pow(rowData.tempc + 273, 2));
      log.value = temp.toFixed(3);

      if (currtrigger < rowData.tempc) {
        currtrigger = rowData.tempc;
        logValues.push(temp.toFixed(3));
        console.log(logValues);
        // drawGraph()
        myChart.update();
        count++;
      }

      // logValues=[...set];
      // set.add(temp.toFixed(3));
      // if(set.size > trigger){
      //   trigger = set.size;

      //   console.log(logValues);
      //   myChart.update();
      //   count++;
      // }

      let f = 0;
      if (count == 8) {
        if (f == 0) {
          f = 1;
          snackbarFunction(
            "For Calculation Take the Value of Slope from graph "
          );
        }
        document.querySelector(".slope-div").style.display = "block";
        // document.querySelector("#download").style.display = "block";
      }
    }
    if (rowData.sno == 8) {
      clearInterval(filltableintrval);
    }
  }, 500);
}

// let ctx = document.getElementById("myChart").getContext("2d");
// let myChart = new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: xValues,
//     datasets: [
//       {
//         label: "log(Is / T^2) vs 1/T",
//         data: logValues,
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderWidth: 2,
//         fill: false,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       xAxes: [
//         {
//             scaleLabel: {
//             display: true,
//             labelString: "1/T (1/K)",
//           },
//         },
//       ],
//       yAxes: [
//         {
//             ticks: {
//                 beginAtZero: true, // Start y-axis from 0
//               },
//             scaleLabel: {
//             display: true,
//             labelString: "log(Is / T^2)",
//             beginAtZero: true,
//           },
//         },
//       ],
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//     animation:{
//         duration:1
//     }
//   },
// });
let ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: voltarrgraph,
    datasets: [
      {
        label: "log(Is / T^2) vs 1/T",
        data: currarrgraph,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "1/T (1/K)",
          },
          position: "top", // Position x-axis at the top
          
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true, // Start y-axis from 0
            reverse: false, // Reverse the y-axis
          },
          scaleLabel: {
            display: true,
            labelString: "log(Is / T^2)",
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1,
    },
  },
});

document.querySelector(".calcslope").addEventListener("click", calslope);
function calslope() {
  let x1, x2, y1, y2;
  let slopevalue = document.querySelector(".slopev");
  document.querySelector(".svalue").style.display = "block";
  x1 = xValues[1];
  x2 = xValues[4];

  y1 = logValues[1];
  y2 = logValues[4];

  slope = (y2 - y1) / (x2 - x1);
  ebg = 2.303 * 8.62 * Math.pow(10, -5) * slope * 1000;
  slopevalue.innerHTML = slope.toFixed(4);
  // document.querySelector(".ebg").style.display = "block";
}

document.querySelector(".ebgbtn").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  ebgcal();
});

function ebgcal() {
  let slopeinp = document.querySelector(".sliderValue");
  // let res = document.querySelector(".ebgvalue");
  if (slopeinp.value === "") {
    alert("Enter slope");
  } else {
    let result = 2.303 * 8.62 * Math.pow(10, -5) * slopeinp.value * 1000;
    document.querySelector(".ebgres").style.display = "block";
    res.innerHTML = result.toFixed(4);
  }
}

snackbarFunction(
  "Follow the Indicators and Click on the Terminals to make the connection."
);

function snackbarFunction(instruction) {
  var x = document.getElementById("snackbar");
  x.textContent = instruction;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 10000);
}

var elem = document.getElementsByTagName("body")[0];
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

async function downloadGraph() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  // Set background color
  doc.setFillColor(0, 123, 255); // Blue color (RGB)
  doc.rect(10, 5, 190, 10, "F");
  // Add a header with black text
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255); // Set text color to black
  doc.setFontSize(20); // Set font size for the header
  doc.text("Graph", 75, 12);

  const chartImage = myChart.toBase64Image();

  doc.addImage(chartImage, "PNG", 25, 150, 150, 120);
}

async function downloadGraphAndObservations() {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 5, 190, 10, "F");
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Observations Table", 75, 12); // Add text at x=10, y=10

    const tableCanvas = await html2canvas(document.querySelector("#table1"), {
      scale: 2,
    });
    const tableImgData = tableCanvas.toDataURL("image/png");
    doc.addImage(tableImgData, "PNG", 15, 17, 180, 120);

    // Add the graph
    const chartImage = myChart.toBase64Image();
    // doc.addPage();

    // //Add the graph head
    // Set background color
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 140, 190, 10, "F");
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Graph", 95, 147); // Add text at x=10, y=10

    doc.addImage(chartImage, "PNG", 25, 150, 150, 120);

    doc.addPage();
    //calculation page
    //Add the labels
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 5, 190, 10, "F");
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Calculation", 75, 12);

    document.querySelector(".calcbtn").style.display = "none";
    const calc = await html2canvas(document.querySelector(".formula"), {
      scale: 2,
    });
    const calcimg = calc.toDataURL("image/png");
    doc.addImage(calcimg, "PNG", 15, 17, 180, 80);

    // Save the PDF
    doc.save("observations_and_graph.pdf");
    document.querySelector(".calcbtn").style.display = "block";
  } catch (error) {
    console.log(error.message);
    if (error.message === "Incomplete or corrupt PNG file") {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please complete the calculation using the Graph",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
}

// Add event listener to the download button
document
  .getElementById("download")
  .addEventListener("click", downloadGraphAndObservations);
document
  .getElementById("downloadgraph")
  .addEventListener("click", downloadGraph);
document
  .getElementById("inlineFormSelectPref")
  .addEventListener("change", function () {
    var contentUrl = this.value;
    document.getElementById("main-svg").data = contentUrl;
    // localStorage.setItem("diodetype", contentUrl);
  });

function clearTableInputs() {
  //chart
  myChart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });
  // Update the chart to reflect the changes
  myChart.update();

  // Get the table
  const table = document.getElementById("table1");

  // Get all input elements within the table
  const inputs = table.getElementsByTagName("input");

  // Loop through each input and clear its value
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

document
  .getElementById("inlineFormSelectPref")
  .addEventListener("change", function () {
    const selectElement = document.getElementById("inlineFormSelectPref");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const contentUrl = this.value;

    // Disable the selected option
    // selectedOption.disabled = true
    // Store the selected value in localStorage
    localStorage.setItem("diodetype", contentUrl);
    // selectElement.disabled = true;
    // Optional: Log the stored value for verification
    console.log("Selected and stored value:", contentUrl);
    clearTableInputs();
  });

function updateValue(value) {
  document.getElementById("sliderValue").textContent = value;
}
