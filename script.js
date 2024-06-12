       //akses API firebase
       import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
       import { getDatabase, ref, onValue, remove} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
   
       //ini buat konfigurasi firebase, data2nya ada di website firebase 
       const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
        };
   
       //proses init sama get database, variablenya dapet dari import di atas
       const app = initializeApp(firebaseConfig);
       const db = getDatabase(app);
   
       ///bikin fungsi buat update data
       function updateTable(data) {
         const table = document.getElementById("dashboard-table");
         table.innerHTML = "";
   
         //ini buat update nama kolom
         const thead = table.createTHead();
         const row = thead.insertRow();
         const headers = ['Start Time', 'End Time', 'Clean Time (ms)', 'Process Time (ms)', 'Weight Category', 'Trash Weight (kg)', ' '];
   
         ///proses update nama kolomnya
         headers.forEach(headerText => {
           const th = document.createElement("th");
           const text = document.createTextNode(headerText);
           th.appendChild(text);
           row.appendChild(th);
         });
   
         ///ini buat update isi dari tabel, yang didapet dari firebase
         data.forEach(entry => {
           const row = table.insertRow();
           row.insertCell(0).textContent = entry.start_time;
           row.insertCell(1).textContent = entry.end_time;
           row.insertCell(2).textContent = entry.clean_time;
           row.insertCell(3).textContent = entry.process_time;
           row.insertCell(4).textContent = entry.weight_category;
           row.insertCell(5).textContent = entry.trash_weight;

               // Membuat tombol hapus
           const deleteButton = document.createElement("button");
           deleteButton.textContent = "Delete";
           deleteButton.addEventListener("click", () => {
             deleteEntry(entry.start_time);
           });
           row.insertCell(6).appendChild(deleteButton);
         });
       }

       // Fungsi untuk menghapus data berdasarkan start_time
       function deleteEntry(startTime) {
       const entryRef = ref(db, 'history/' + startTime);
       remove(entryRef)
             .then(() => {
             console.log("Data with start time " + startTime + " is deleted successfully.");
       })
         .catch((error) => {
         console.error("Error removing data:", error);
       });
}
   
       ///akses firebase, cek child history
       function fetchDataFromFirebase() {
         const historyRef = ref(db, 'history');
   
         onValue(historyRef, (snapshot) => {
           const data = [];
           const history = snapshot.val();
   
           ///proses memasukan isi tabel (dari firebase) ke data tabe melalui varuiable data
           for (const dateKey in history) {
             const entry = history[dateKey];
             data.push({
               start_time: entry.start_time,
               end_time: entry.end_time,
               clean_time: entry['clean_time (ms)'],
               process_time: entry['process_time (ms)'],
               weight_category: entry.weight_category,
               trash_weight: entry['trash_weight (kg)']
             });
           }
   
           //panggil fungsi update data tabel
           updateTable(data);
         });
       }
   
       setInterval(fetchDataFromFirebase, 60000); //update setiap 6 detik
       fetchDataFromFirebase(); //fungsi get data dari firebase
