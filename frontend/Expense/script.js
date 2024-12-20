const isPremium = window.localStorage.getItem("isPremium");
const token = window.localStorage.getItem("token");
const UserId = window.localStorage.getItem('user');

document.getElementById('addexpense').addEventListener('click', async (event) => {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    // const token = window.localStorage.getItem('token');
    try {
        const response = await axios.post(`http://localhost:3000/api/expense`, { amount, description, category }, { headers: { 'authorization': token } });

        if (response.status === 201) {
            console.log(response.data);
            location.reload();
        } else {
            console.log(response.data);
        }
    } catch (error) {
        console.error(error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log(isPremium)
    if (isPremium === 'true') {
        document.getElementById('rzp-btn').style.display = "none";
        document.getElementById('premium').style.display = 'block';
        document.getElementById('show-leader').style.display = 'block';
        document.getElementById('rzp-btn-div').style.display = 'none';
        document.getElementById('content-leadboard').style.display = 'none';

    } else {
        document.getElementById('rzp-btn').style.display = "block";
        document.getElementById('premium').style.display = 'none';
        document.getElementById('show-leader').style.display = 'none';
        document.getElementById('rzp-btn-div').style.display = 'block';
        document.getElementById('content-leadboard').style.display = 'none';

    }
    const contentElement = document.getElementById('content-expense');
   
    try {
        // const token = window.localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/expense', {
            headers: { "authorization": token }
        });
        const responseUser = await axios.get('http://localhost:3000/api/users', {
            headers: { "authorization": token }
        });
        premiumUserData = responseUser.data;
        if (response.data.userExpense && response.data.userExpense.length > 0) {
            // Create the table element and add Bootstrap class for styling
            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered', 'table-striped', 'table-hover'); // Bootstrap table classes for styling
        
            // Create the table header
            const headerRow = document.createElement('tr');
            table.classList.add('border')
            headerRow.innerHTML = `
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Action</th>
            `;
            table.appendChild(headerRow);
        
            // Populate the table with expenses data
            response.data.userExpense.forEach(expense => {
                const expenseRow = document.createElement('tr');
                expenseRow.innerHTML = `
                    <td>${expense.description}</td>
                    <td>$${expense.amount.toFixed(2)}</td> <!-- Format amount to 2 decimal places -->
                    <td>${expense.category}</td>
                    <td>${new Date(expense.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${expense.id}">
                            Delete
                        </button>
                    </td>
                `;
                table.appendChild(expenseRow);
            });
        
            // Append the table to the content element
            contentElement.appendChild(table);
        
            // Add event listener for the delete button
            contentElement.addEventListener('click', (event) => {
                if (event.target.classList.contains('delete-btn')) {
                    const expenseId = event.target.getAttribute('data-id');
                    handleDelete(expenseId);
                }
            });
        
        } else {
            // If no expenses found, display a message
            contentElement.innerHTML = '<p>No expenses found for this user.</p>';
        }
        document.getElementById('show-leader').addEventListener('click', () => {
            // Hide the "Show Leaderboard" button
            document.getElementById('show-leader').style.display = 'none';
            document.getElementById('show-leader-div').style.display = 'none';

            document.getElementById('content-leadboard').style.display = 'block';
            if (premiumUserData && premiumUserData.length > 0) {
                // Get the content container for the leaderboard
                const leaderboardContainer = document.getElementById('content-leadboard');
                
                // Create and style the h2 element for the leaderboard header
                const leaderboardHeader = document.createElement('h4');
                leaderboardHeader.textContent = 'Expenses Leaderboard';
                leaderboardHeader.classList.add('text-center', 'my-4'); // Added display-4 for larger text
        
                // Add the header to the leaderboard container
                leaderboardContainer.appendChild(leaderboardHeader);
        
                // Create and style the table
                const table = document.createElement('table');
                table.classList.add('table', 'table-bordered', 'table-striped', 'table-hover', 'table-responsive'); // Added responsive class for better layout on small screens
        
                // Create and append the table header
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = `
                    <th>Name</th>
                    <th>Amount</th>
                `;
                table.appendChild(headerRow);
        
                // Sort the premiumUserData array by totalamount in descending order
                premiumUserData.sort((a, b) => b.totalamount - a.totalamount);
        
                // Create rows for each user in the sorted array
                premiumUserData.forEach(user => {
                    const expenseRow = document.createElement('tr');
                    expenseRow.innerHTML = `
                        <td>${user.name}</td>
                        <td>$${user.totalamount.toFixed(2)}</td> <!-- Format amount to 2 decimal places -->
                    `;
                    table.appendChild(expenseRow);
                });
        
                // Add the table to the leaderboard container
                leaderboardContainer.appendChild(table);
        
            } else {
                // If there is no data, show a message
                const message = document.createElement('p');
                message.textContent = 'No data available for the leaderboard.';
                message.classList.add('text-center', 'my-4');
                leaderboardContainer.appendChild(message);
            }
        });
       
    } catch (err) {
        console.log(err);
        contentElement.innerHTML = '<p>No expenses found for this user.</p>';
    }
});


async function handleDelete(id) {
    try {
        // const token = localStorage.getItem('token')
        const response = await axios.delete(`http://localhost:3000/api/expense/${id}`, { headers: { 'authorization': token } })
        location.reload();
    } catch (err) {
        console.log(err)
    }

}

document.getElementById('rzp-btn').addEventListener('click', async () => {
    const response = await axios.get("http://localhost:3000/api/premium/purchasepremium", { headers: { 'authorization': token } })

    var options = {
        'key': response.data.key_id,
        'order_id': response.data.order.id,
        'handler': async function (response) {
            await axios.post('http://localhost:3000/api/premium/updateorderstatus', {
                orderid: options.order_id,
                paymentid: response.razorpay_payment_id
            }, { headers: { 'authorization': token } })
            alert("Your Premium activated!");
        }
    }

    const raz = new Razorpay(options);
    raz.open();
});

