// Format numbers with commas for Indian numbering system (e.g., ₹1,00,000)
function formatNumberINR(number) {
    return number.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// Common chart variables
let emiChart, lumpsumChart, sipChart;

// Center value plugin for all charts
Chart.register({
    id: 'centerValuePlugin',
    afterDatasetsDraw(chart) {
        const { ctx, chartArea: { width, height } } = chart;
        const centerX = width / 2;
        const centerY = height / 2;

        const activePoint = chart.tooltip._active?.[0];
        if (activePoint) {
            const dataset = chart.data.datasets[0];
            const value = dataset.data[activePoint.index];
            const label = chart.data.labels[activePoint.index];

            ctx.save();
            ctx.font = '16px Arial';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';

            // Display label on the first line (slightly above the center)
            ctx.fillText(label, centerX, centerY - 10); // Shift up by 10px

            // Display value on the second line (slightly below the center)
            ctx.font = '18px Arial';
            ctx.fillText('₹' + formatNumberINR(value), centerX, centerY + 20); // Shift down by 20px

            ctx.restore();
        }
    }
});

// Function to open different tabs
function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove('active');
    }

    const tabLinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Set default active tab
document.getElementById("LoanEMI").classList.add("active");

///////////////////////////////////////////////////////////
// Loan EMI Calculation
///////////////////////////////////////////////////////////
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 12 / 100;
    const loanTenure = parseInt(document.getElementById("loanTenure").value) * 12;

    const EMI = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTenure)) / 
                (Math.pow(1 + interestRate, loanTenure) - 1);

    const totalAmount = EMI * loanTenure;
    const totalInterest = totalAmount - loanAmount;

    document.getElementById("monthlyEMI").textContent = "Monthly EMI: ₹" + formatNumberINR(EMI);
    document.getElementById("principalAmount").textContent = "Principal Amount: ₹" + formatNumberINR(loanAmount);
    document.getElementById("totalInterest").textContent = "Total Interest: ₹" + formatNumberINR(totalInterest);
    document.getElementById("totalAmount").textContent = "Total Amount: ₹" + formatNumberINR(totalAmount);

    updateEMIChart(loanAmount, totalInterest);
}

// Function to update the EMI chart
function updateEMIChart(principal, interest) {
    const ctx = document.getElementById('emiChart').getContext('2d');

    if (emiChart) {
        emiChart.destroy();
    }

    emiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Interest Amount'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return '₹' + formatNumberINR(tooltipItem.raw);
                        }
                    }
                }
            }
        }
    });
}

///////////////////////////////////////////////////////////
// Lumpsum Investment Calculation
///////////////////////////////////////////////////////////
function calculateLumpsum() {
    const lumpsumInvestment = parseFloat(document.getElementById("lumpsumInvestment").value);
    const returnRate = parseFloat(document.getElementById("lumpsumReturnRate").value) / 100;
    const timePeriod = parseInt(document.getElementById("lumpsumTimePeriod").value);

    const totalValue = lumpsumInvestment * Math.pow((1 + returnRate), timePeriod);
    const estimatedReturns = totalValue - lumpsumInvestment;

    document.getElementById("investedAmount").textContent = "Invested amount: ₹" + formatNumberINR(lumpsumInvestment);
    document.getElementById("estimatedReturns").textContent = "Est. returns: ₹" + formatNumberINR(estimatedReturns);
    document.getElementById("totalValue").textContent = "Total value: ₹" + formatNumberINR(totalValue);

    updateLumpsumChart(lumpsumInvestment, estimatedReturns);
}

// Function to update the Lumpsum chart
function updateLumpsumChart(invested, returns) {
    const ctx = document.getElementById('lumpsumChart').getContext('2d');

    if (lumpsumChart) {
        lumpsumChart.destroy();
    }

    lumpsumChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Invested Amount', 'Estimated Returns'],
            datasets: [{
                data: [invested, returns],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return '₹' + formatNumberINR(tooltipItem.raw);
                        }
                    }
                }
            }
        }
    });
}

///////////////////////////////////////////////////////////
// SIP Investment Calculation
///////////////////////////////////////////////////////////
function calculateSIP() {
    const sipMonthlyInvestment = parseFloat(document.getElementById("sipMonthlyInvestment").value);
    const returnRate = parseFloat(document.getElementById("sipReturnRate").value) / 100;
    const timePeriod = parseInt(document.getElementById("sipTimePeriod").value);

    const months = timePeriod * 12;
    const monthlyReturnRate = returnRate / 12;
    
    const totalValue = sipMonthlyInvestment * ((Math.pow(1 + monthlyReturnRate, months) - 1) / monthlyReturnRate) * (1 + monthlyReturnRate);
    const investedAmount = sipMonthlyInvestment * months;
    const estimatedReturns = totalValue - investedAmount;

    document.getElementById("sipInvestedAmount").textContent = "Invested amount: ₹" + formatNumberINR(investedAmount);
    document.getElementById("sipEstimatedReturns").textContent = "Est. returns: ₹" + formatNumberINR(estimatedReturns);
    document.getElementById("sipTotalValue").textContent = "Total value: ₹" + formatNumberINR(totalValue);

    updateSIPChart(investedAmount, estimatedReturns);
}

// Function to update the SIP chart
function updateSIPChart(invested, returns) {
    const ctx = document.getElementById('sipChart').getContext('2d');

    if (sipChart) {
        sipChart.destroy();
    }

    sipChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Invested Amount', 'Estimated Returns'],
            datasets: [{
                data: [invested, returns],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return '₹' + formatNumberINR(tooltipItem.raw);
                        }
                    }
                }
            }
        }
    });
}
