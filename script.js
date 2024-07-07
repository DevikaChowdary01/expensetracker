// Selecting elements from the DOM
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalAmountElem = document.getElementById('totalAmount');
const monthlySalaryElem = document.getElementById('monthlySalary');
const remainingAmountElem = document.getElementById('remainingAmount');
const savingsAmountElem = document.getElementById('savingsAmount');
const shortTermGoalElem = document.getElementById('shortTermGoal');
const longTermGoalElem = document.getElementById('longTermGoal');
const suggestionsList = document.getElementById('suggestionsList');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize total expense, monthly salary, and financial goals
let total = 0;
let monthlySalary = 0;
let shortTermGoal = '';
let longTermGoal = '';

// Function to create a new expense item
function createExpenseItem(description, amount) {
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `
        <div class="expense-description">${description}</div>
        <div class="expense-amount">$${amount.toFixed(2)}</div>
        <div class="button-container">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Event listener for delete button
    const deleteBtn = expenseItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        expenseList.removeChild(expenseItem);
        updateTotalAndSalary(-amount);
        updateInvestmentSuggestions();
    });

    // Event listener for edit button
    const editBtn = expenseItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        expenseDescription.value = description;
        expenseAmount.value = amount;
        expenseForm.dataset.mode = 'edit';
        expenseForm.dataset.itemId = Array.from(expenseList.children).indexOf(expenseItem);

        // Hide add button, show cancel button
        expenseForm.querySelector('button[type="submit"]').style.display = 'none';
        cancelBtn.style.display = 'inline-block';

        // Highlight editing item
        expenseItem.classList.add('editing');
    });

    return expenseItem;
}

// Function to update total expense and remaining salary
function updateTotalAndSalary(amount) {
    total += amount;
    totalAmountElem.textContent = total.toFixed(2);

    // Calculate remaining salary and savings
    const remainingSalary = monthlySalary - total;
    const savings = remainingSalary > 0 ? remainingSalary : 0;

    remainingAmountElem.textContent = remainingSalary.toFixed(2);
    savingsAmountElem.textContent = savings.toFixed(2);

    // Update investment suggestions after each expense update
    updateInvestmentSuggestions();
}

// Function to update investment suggestions based on remaining savings
// Function to update investment suggestions based on remaining savings and goals
function updateInvestmentSuggestions() {
    suggestionsList.innerHTML = ''; // Clear existing suggestions

    const remainingSavings = parseFloat(savingsAmountElem.textContent);
    const suggestions = [];

    // Example investment suggestions based on remaining savings and goals
    if (remainingSavings > 10000) {
        if (shortTermGoal.toLowerCase().includes('emergency fund') || shortTermGoal.toLowerCase().includes('vacation')) {
            suggestions.push({ type: 'Certificates of Deposit (CDs)', description: 'Lock funds in CDs for higher interest rates over a fixed term.' });
            suggestions.push({ type: 'High-Yield Savings Accounts', description: 'Use high-yield savings accounts for secure short-term savings.' });
        } else if (longTermGoal.toLowerCase().includes('retirement') || longTermGoal.toLowerCase().includes('investment portfolio')) {
            suggestions.push({ type: 'Stocks', description: 'Invest in diversified stocks for potential higher returns over the long term.' });
            suggestions.push({ type: 'Mutual Funds', description: 'Consider mutual funds for balanced investment across sectors.' });
        }
    }

    if (remainingSavings > 5000) {
        if (shortTermGoal.toLowerCase().includes('home renovation') || shortTermGoal.toLowerCase().includes('education fund')) {
            suggestions.push({ type: 'Savings Accounts', description: 'Use high-yield savings accounts for short-term goals with flexibility.' });
        } else if (longTermGoal.toLowerCase().includes('home purchase') || longTermGoal.toLowerCase().includes('children\'s education')) {
            suggestions.push({ type: 'Real Estate Investment Trusts (REITs)', description: 'Invest in REITs for potential income from real estate investments.' });
        }
    }

    // Display suggestions
    suggestions.forEach((suggestion, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = `
            <div>${index + 1}. <strong>${suggestion.type}</strong>: ${suggestion.description}</div>
        `;
        suggestionsList.appendChild(suggestionItem);
    });
}


// Event listener for form submission
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get input values
    const description = expenseDescription.value.trim();
    const amount = parseFloat(expenseAmount.value.trim());

    if (description && !isNaN(amount) && amount > 0) {
        // Check if in edit mode (updating existing expense)
        if (expenseForm.dataset.mode === 'edit') {
            const itemId = parseInt(expenseForm.dataset.itemId);
            const existingItem = expenseList.children[itemId];
            const existingAmount = parseFloat(existingItem.querySelector('.expense-amount').textContent.replace('$', ''));
            updateTotalAndSalary(-existingAmount);

            // Update existing expense item
            existingItem.querySelector('.expense-description').textContent = description;
            existingItem.querySelector('.expense-amount').textContent = `$${amount.toFixed(2)}`;

            // Update total with new amount
            updateTotalAndSalary(amount);

            // Reset form and mode
            expenseForm.dataset.mode = '';
            expenseForm.dataset.itemId = '';
            expenseForm.querySelector('button[type="submit"]').style.display = 'inline-block';
            cancelBtn.style.display = 'none';
            existingItem.classList.remove('editing');
        } else {
            // Add new expense
            const expenseItem = createExpenseItem(description, amount);

            // Append expense item to list
            expenseList.appendChild(expenseItem);

            // Update total expense and remaining salary
            updateTotalAndSalary(amount);
        }

        // Clear form inputs
        expenseForm.reset();
    } else {
        alert('Please enter valid description and amount.');
    }
});

// Event listener for cancel button (edit mode)
cancelBtn.addEventListener('click', function() {
    expenseForm.dataset.mode = '';
    expenseForm.dataset.itemId = '';
    expenseForm.querySelector('button[type="submit"]').style.display = 'inline-block';
    cancelBtn.style.display = 'none';
    expenseDescription.value = '';
    expenseAmount.value = '';
    expenseList.querySelector('.editing').classList.remove('editing');
});

// Event listener for monthly salary input
monthlySalaryElem.addEventListener('input', function() {
    monthlySalary = parseFloat(monthlySalaryElem.value) || 0;
    updateTotalAndSalary(0); // Update to recalculate with current expenses
});

// Event listener for financial goals input
shortTermGoalElem.addEventListener('input', function() {
    shortTermGoal = shortTermGoalElem.value.trim();
});

longTermGoalElem.addEventListener('input', function() {
    longTermGoal = longTermGoalElem.value.trim();
});
