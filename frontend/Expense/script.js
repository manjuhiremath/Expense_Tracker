

document.getElementById('addexpense').addEventListener('click', async (event) => {
    event.preventDefault();

    // Get the values from the form fields
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    
    console.log(amount);  // Debugging the amount value

    // Get the userId from localStorage
    const userId = window.localStorage.getItem('user');
    console.log(userId);  // Debugging the userId value

    try {
        // Make the POST request to create an expense
        const response = await axios.post(`http://localhost:3000/api/expense?userId=${userId}`, { amount, description, category });

        if (response.status === 201) {
            // If the expense was created successfully, log the response
            console.log(response.data);
            // You can also perform actions here, like redirecting or showing a success message
        } else {
            console.log(response.data);  // In case of a different status code, log the response
        }
    } catch (error) {
        console.error(error);  // In case of an error, log it
    }
});