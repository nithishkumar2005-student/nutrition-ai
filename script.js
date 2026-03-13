const uploadBtn=document.getElementById("uploadBtn");
const fileInput=document.getElementById("fileInput");

let chart;

uploadBtn.onclick=()=>fileInput.click();

fileInput.onchange=async()=>{

const file=fileInput.files[0];
const reader=new FileReader();

reader.onloadend=async()=>{

const base64=reader.result.split(",")[1];

const res=await fetch("/api/analyze",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({imageBase64:base64})
});

const data=await res.json();
showResults(data);

};

reader.readAsDataURL(file);
};


function showResults(data){

document.getElementById("calories").innerText=data.calories;
document.getElementById("protein").innerText=data.protein+"g";
document.getElementById("carbs").innerText=data.carbs+"g";
document.getElementById("fat").innerText=data.fat+"g";
document.getElementById("score").innerText=data.health_score;

document.getElementById("insight").innerText=data.insight;

const items=document.getElementById("items");
items.innerHTML="";

data.food_items.forEach(i=>{
const li=document.createElement("li");
li.innerText=i;
items.appendChild(li);
});

renderChart(data);

}

function renderChart(data){

if(chart)chart.destroy();

chart=new Chart(document.getElementById("chart"),{
type:"bar",
data:{
labels:["Protein","Carbs","Fat"],
datasets:[{
data:[data.protein,data.carbs,data.fat]
}]
}
});

}