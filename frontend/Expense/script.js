document.getElementById('addexpense').addEventListener('click', async (event) => {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const UserId = window.localStorage.getItem('user');

    try {
        const response = await axios.post(`http://localhost:3000/api/expense`, { amount, description, category,UserId });

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

document.addEventListener('DOMContentLoaded',async ()=>{
    try{
        const id = window.localStorage.getItem('user');
        const response = await axios.get(`http://localhost:3000/api/expense/${id}`)
        const contentElement = document.getElementById('content');
        if (response.data.userExpense && response.data.userExpense.length > 0) {
        //   response.data.userExpense.forEach(expense => {
            const table = document.createElement('table');
            table.classList.add('expense-table');
            
            // Create table header row
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Created At</th>
                <th><button type='button' id='delete-btn' onclick='handleDelete()'></button></th>
            `;
            table.appendChild(headerRow);

            // Iterate through each expense and create a row
            response.data.userExpense.forEach(expense => {
                const expenseRow = document.createElement('tr');
                
                // Create a table row for each expense
                expenseRow.innerHTML = `
                    <td>${expense.description}</td>
                    <td>$${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${new Date(expense.createdAt).toLocaleDateString()}</td>
                    <th><button type='button' id='delete-btn' onclick='handleDelete("${expense.id}")'>Delete</button></th>
                `;
                table.appendChild(expenseRow);
            });

            // Append the table to the content
            contentElement.appendChild(table);
        //   });
        } else {
            contentElement.innerHTML = '<p>No expenses found for this user.</p>';
        }
    }catch(err){
        console.log(err);
    }
})

async function handleDelete(id){
    try{
        const response = await axios.delete(`http://localhost:3000/api/expense/${id}`)
        console.log(response);
        location.reload();
    }catch(err){
        console.log(err)
    }

}