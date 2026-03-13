import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

try{

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"});
}

const {imageBase64}=req.body;

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model=genAI.getGenerativeModel({model:"gemini-1.5-flash"});

const prompt=`
Analyze this food image and return ONLY JSON:

{
food_items:[],
calories:number,
protein:number,
carbs:number,
fat:number,
health_score:number,
insight:""
}
`;

const result=await model.generateContent([
prompt,
{
inlineData:{
mimeType:"image/jpeg",
data:imageBase64
}
}
]);

const text=result.response.text();

res.status(200).json(JSON.parse(text));

}catch(err){
console.log(err);
res.status(500).json({error:"AI failed"});
}

}