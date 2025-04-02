from pymongo import MongoClient
client=MongoClient("mongodb+srv://saivarshithmahendra7:sai12345678@cluster0.fift1ue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db=client['student_management']
students=db['students']

print("Connected to Mongodb successfully!")

def add_stu(name,age,dep,roll):
    student={
        "name":name,
        "age":age,
        "dep":dep,
        "roll":roll
    }
    students.insert_one(student)
    print(f"student {name} added successfully")

def get_stu(query={}):
    results=students.find(query)
    for student in results:
        print(student)

def update_stu(roll,updated):
    result=students.update_one(
        {"roll":roll},
        {"$set":updated}
    )
    if result.modified_count>0:
        print("student updated")
    else:
        print("Nott updated")

def delete_stu(roll):
    result=students.delete_one({"roll":roll})
    if result.deleted_count>0:
        print("succussfully deleted")
    else:
        print("No students deleted not found actually")


add_stu("varshith",20,"CSE",1)
add_stu("anonymus",19,"CSE",2)
add_stu("Abcd",25,"CSE",3)
get_stu(query={
    "name":"varshith",
    "age":20,
    "dep":"CSE",
    "roll":1
})
get_stu(query={
    "roll":2
})
update_stu(2,{"age":21})
delete_stu(3)
