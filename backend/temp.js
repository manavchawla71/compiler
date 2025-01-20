const api = "https://jsonplaceholder.typicode.com/posts";

const fetchData = async () => {
  try {
    const response = await fetch(api);
    const data = await response.json();
    const filteredData = data.filter((item) => item.userId !== 10);
    console.log(filteredData.length); // Logs the number of objects with userId 10
  } catch (error) {
    console.error('Error:', error);
  }
};

fetchData();
