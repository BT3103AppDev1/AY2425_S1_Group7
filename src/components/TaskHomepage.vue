<script setup>
import { component } from 'vue/types/umd';
import ViewTasks from '../components/ViewTasks.vue'
import AddTask from '@/components/AddTask.vue';
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import {getDocs, collection, deleteDoc, doc} from "firebase/firestore";
const db = getFirestore(firebaseApp);


async function displayTasks() {
  const allDocuments = await getDocs(collection(db, "Tasks"));
  allDocuments.forEach((docs)=> {
  const taskData = docs.data()

  const taskName = taskData.Task_Name
  const startTime = taskData.Start_Time
  const location = taskData.Location

  const table = document.getElementById("taskTable")
  const row = table.insertRow()

  const cell1 = row.insertCell(0); 
  const cell2 = row.insertCell(1); 
  const cell3 = row.insertCell(2);
  const cell4 = row.insertCell(3);
          
  cell1.innerHTML = taskName;
  cell2.innerHTML = startTime;
  cell3.innerHTML = location;

  const deleteButton = document.createElement("button")

  deleteButton.className = "bwt"
  deleteButton.innerHTML = "Delete"
  //append delete button into cells
  deleteButton.onclick = () => this.deleteTask(docs.id, row.rowIndex);
  cell4.appendChild(deleteButton);
        
  index += 1;
  });
}
displayTasks();

async function deleteTask(taskID, rowIndex) {
  alert("You are going to delete " + taskID);
  await deleteDoc(doc(db, "Tasks", taskID));

  //Remove the row from the table
  const tb = document.getElementById("taskTable");
  tb.deleteRow(rowIndex - 1);
        
  console.log("Task ${taskID} successfully deleted!");
  displayTasks();
      
}

</script>

<template>
  <div class = "task-home">
    <h1> Welcome back, Test User! </h1>
    <h3> Here's a quick summary of your upcoming tasks: </h3>
  </div>

  <div class = "task-summary">
    <table id="taskTable" class = "auto-index">
        <tr>
            <th>Upcoming Tasks</th>
            <th>Start Date & Time</th>
            <th>Reporting Location</th>
            <th>Options</th>
        </tr>
    </table>
    <br><br>
  </div>
    <router-link to="/AddTasks">
        <button>Add tasks!</button>
    </router-link>
  <Suspense>
    <ViewTasks></ViewTasks>
  </Suspense>
</template>

<style scoped>
</style>
