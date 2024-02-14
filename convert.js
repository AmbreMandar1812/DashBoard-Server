const fs = require("fs");
const axios = require("axios");

// Function to fetch data from the API
async function fetchData() {
  try {
    const response = await axios.get("http://localhost:5000");
    return response.data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
}

// Function to convert JSON data to CSV format
function jsonToCsv(data) {
  // Extract headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csvContent = headers.join(",") + "\n";
  data.forEach((item) => {
    const row = headers.map((header) => item[header]).join(",");
    csvContent += row + "\n";
  });

  return csvContent;
}

// Main function to fetch data and write to CSV file
async function fetchDataAndWriteToCsv() {
  try {
    // Fetch data from API
    const jsonData = await fetchData();

    // Convert JSON data to CSV
    const csvContent = jsonToCsv(jsonData);

    // Write CSV content to file
    fs.writeFileSync("data.csv", csvContent);

    console.log("CSV file generated successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the main function to execute the process
fetchDataAndWriteToCsv();
