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
    try {
        // const token = window.localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/expense', {
            headers: { "authorization": token }
        });

        const contentElement = document.getElementById('content');
        console.log(isPremium)
        if (isPremium) {
            document.getElementById('rzp-btn').style.display = "none";   // Hide the Razorpay button for premium users
            document.getElementById('premium').style.display = 'block';   // Show the premium-related content for premium users
        } else {
            document.getElementById('rzp-btn').style.display = "block";  // Show the Razorpay button for non-premium users
            document.getElementById('premium').style.display = 'none';   // Hide the premium-related content for non-premium users
        }
        if (response.data.userExpense && response.data.userExpense.length > 0) {
            const table = document.createElement('table');
            table.classList.add('expense-table');

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Action</th>
            `;
            table.appendChild(headerRow);

            response.data.userExpense.forEach(expense => {
                const expenseRow = document.createElement('tr');
                expenseRow.innerHTML = `
                    <td>${expense.description}</td>
                    <td>$${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${new Date(expense.createdAt).toLocaleDateString()}</td>
                    <th><button type="button" class="delete-btn" data-id="${expense.id}">Delete</button></th>
                `;
                table.appendChild(expenseRow);
            });

            contentElement.appendChild(table);

            contentElement.addEventListener('click', (event) => {
                if (event.target.classList.contains('delete-btn')) {
                    const expenseId = event.target.getAttribute('data-id');
                    handleDelete(expenseId);
                }
            });


        } else {
            contentElement.innerHTML = '<p>No expenses found for this user.</p>';
        }
    } catch (err) {
        console.log(err);
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
    // const token = localStorage.getItem('token');
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

