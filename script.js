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

/* Chart */

function renderChart(data){

if(chart)chart.destroy();

chart=new Chart(document.getElementById("chart"),{
type:"bar",
data:{
labels:["Protein","Carbs","Fat"],
datasets:[{data:[data.protein,data.carbs,data.fat]}]
}
});

}

/* Scroll animation */

const observer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting)e.target.classList.add("show");
});
});

document.querySelectorAll(".fade-up").forEach(el=>observer.observe(el));


/* THREE JS 3D OBJECT */

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById("threeCanvas"),alpha:true});

renderer.setSize(400,400);

const geometry=new THREE.TorusKnotGeometry(1,0.3,100,16);
const material=new THREE.MeshStandardMaterial({color:0x00ffaa,metalness:.7,roughness:.2});

const mesh=new THREE.Mesh(geometry,material);
scene.add(mesh);

const light=new THREE.PointLight(0xffffff,1);
light.position.set(5,5,5);
scene.add(light);

camera.position.z=4;

function animate(){
requestAnimationFrame(animate);
mesh.rotation.x+=0.01;
mesh.rotation.y+=0.01;
renderer.render(scene,camera);
}
animate();