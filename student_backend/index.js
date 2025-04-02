const express= require("express");
const {MongoClient, ObjectId}=require('mongodb');



const app=express();
const port = 5000;


const cors = require('cors');  

app.use(cors());  
app.use(express.json());

const url="mongodb+srv://saivarshithmahendra7:sai12345678@cluster0.fift1ue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client= new MongoClient(url);

async function connecttoDB() {
    try{
        await client.connect();
        console.log('connected to Mongodb');
    }catch(err){
        console.error("Failed")
    }
}

connecttoDB();

app.post('/add-student',async(req,res)=>{
    try{
        console.log("Incoming Data:", req.body);
    const student=req.body;
    const database= client.db("student_management");
    const collection=database.collection("students");
    const result=await collection.insertOne(student);

    res.status(201).send(`student added successfully with ID :${result.insertedId}`);
    } catch(error){
        console.log(error)
        res.status(500).send(`Error adding student`);
    }
});

app.get('/get-students',async (req,res)=>{
    try{
        const Db=client.db("student_management");
        const collection=Db.collection("students");
        const students= await collection.find({}).toArray();
        res.status(201).json(students);
    }catch(error){
        console.log("error");
        res.status(500).send("Error retrieving");
    }
    });

    app.put('/update-student/:id', async (req, res) => {
        const studentId = req.params.id;
        const updateData = req.body;
    
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).send("Invalid ID format");
        }
    
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).send("No data provided to update");
        }
    
        try {
            const db=client.db('student_management')
            const collection=db.collection("students")
            const result = await collection.updateOne(
                { _id: new ObjectId(studentId) },
                { $set: updateData }
            );
    
            if (result.matchedCount === 0) {
                return res.status(404).send("Student not found");
            }
    
            res.send("Student updated successfully!");
        } catch (error) {
            console.error("Error updating student:", error);
            res.status(500).send("Error updating student");
        }
    });
    

app.delete('/delete-student/:id',async(req,res)=>{
    const studentId=req.params.id;
    try{
        const Db=client.db('student_management');
        const collection=Db.collection('students');
        const result=await collection.deleteOne({_id:new ObjectId(studentId)});
        if (result.deletedCount==0){
            res.status(200).send(`student with ID :${studentId} deleted`)
        }else{
            res.status(404).send(`student not found`);
        }
    }catch(error){
        console.error(`error deleting`,error);
        res.status(500).send(`Error deleting`);
    }
})

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);

});
