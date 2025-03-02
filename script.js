        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;

        darkModeToggle.addEventListener('change', () => {
            body.classList.toggle('dark-mode');
            updateChartColors();
        });

        // Save advanced options
        document.getElementById('saveAdvancedOptions').addEventListener('click', () => {
            showSafariLoader();
            setTimeout(() => {
                hideSafariLoader();
                showToast('Advanced options saved successfully!');
            }, 1000);
        });

        // Set goals button
        document.getElementById('setGoals').addEventListener('click', () => {
            showSafariLoader();
            setTimeout(() => {
                hideSafariLoader();
                showToast('Retirement goals set successfully!');
                document.getElementById('basic-tab').click();
            }, 1000);
        });

        // Safari Loader functions
        function showSafariLoader() {
            document.querySelector('.safari-loader').style.display = 'flex';
        }

        function hideSafariLoader() {
            document.querySelector('.safari-loader').style.display = 'none';
        }

        // Toast notification
        function showToast(message) {
            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'toast-notification animate__animated animate__fadeIn';
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.right = '20px';
            toast.style.backgroundColor = '#007C5A';
            toast.style.color = 'white';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '10px';
            toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            toast.style.zIndex = '1000';
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.className = 'toast-notification animate__animated animate__fadeOut';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 1000);
            }, 3000);
        }

        // Formatting function for currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-ZA', { 
                style: 'currency', 
                currency: 'ZAR',
                maximumFractionDigits: 0
            }).format(amount);
        }

        // Chart Initialization
        const ctx = document.getElementById('progressChart').getContext('2d');
        let progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Projected Savings',
                    data: [],
                    borderColor: '#007C5A',
                    backgroundColor: 'rgba(0, 124, 90, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Retirement Goal',
                    data: [],
                    borderColor: '#FFB612',
                    backgroundColor: 'rgba(255, 182, 18, 0.05)',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Age'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Savings (R)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrency(context.raw);
                            }
                        }
                    }
                }
            }
        });

        function updateChartColors() {
            const isDarkMode = body.classList.contains('dark-mode');
            
            progressChart.data.datasets[0].borderColor = isDarkMode ? '#FFB612' : '#007C5A';
            progressChart.data.datasets[0].backgroundColor = isDarkMode ? 'rgba(255, 182, 18, 0.1)' : 'rgba(0, 124, 90, 0.1)';
            
            progressChart.data.datasets[1].borderColor = isDarkMode ? '#DE3831' : '#FFB612';
            
            progressChart.options.scales.x.grid = {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            };
            
            progressChart.options.scales.y.grid = {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            };
            
            progressChart.options.scales.x.ticks = {
                color: isDarkMode ? '#f3f4f6' : '#333'
            };
            
            progressChart.options.scales.y.ticks = {
                color: isDarkMode ? '#f3f4f6' : '#333',
                callback: function(value) {
                    return 'R' + value.toLocaleString();
                }
            };
            
            progressChart.update();
        }

       // Calculation Logic
document.getElementById('calculateButton').addEventListener('click', () => {
    showSafariLoader();
    
    setTimeout(() => {
        const currentAge = parseInt(document.getElementById('currentAge').value) || 30;
        const retirementAge = parseInt(document.getElementById('retirementAge').value) || 65;
        const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 100000;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 2000;
        const annualReturn = parseFloat(document.getElementById('annualReturn').value) || 8.5;
        const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 5.0;
        
        // Get advanced options if they've been set
        const salaryGrowthRate = parseFloat(document.getElementById('salaryGrowthRate').value) || 6.0;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 26;
        const retirementSpending = parseFloat(document.getElementById('retirementSpending').value) || 15000;
        const lifeExpectancy = parseFloat(document.getElementById('lifeExpectancy').value) || 85;
        
        // Get goals if they've been set
        const retirementGoal = parseFloat(document.getElementById('retirementGoal').value) || 5000000;
        const riskTolerance = document.getElementById('riskTolerance').value || 'medium';
        const investmentStrategy = document.getElementById('investmentStrategy').value || 'balanced';
        
        // Calculate years until retirement
        const yearsToRetirement = retirementAge - currentAge;
        
        // Calculate real return (return adjusted for inflation)
        const realReturn = ((1 + (annualReturn / 100)) / (1 + (inflationRate / 100)) - 1) * 100;
        
        // Calculate future value of current savings
        const futureValueCurrentSavings = currentSavings * Math.pow((1 + (annualReturn / 100)), yearsToRetirement);
        
        // Calculate future value of monthly contributions with salary growth
        let futureValueContributions = 0;
        let yearlyContributions = monthlyContribution * 12;
        let projectedSavingsData = [];
        let goalData = [];
        let labels = [];
        
        // Tax benefit calculation (simplified - assuming 27.5% of taxable income up to R350,000 annually)
        const maxTaxDeduction = Math.min(yearlyContributions, 350000 * 0.275);
        const annualTaxSaving = maxTaxDeduction * (taxRate / 100);
        
        // Calculate year-by-year savings growth
        for (let year = 0; year <= yearsToRetirement; year++) {
            // Current age for this iteration
            const age = currentAge + year;
            labels.push(age);
            
            // Calculate savings for current year
            let savingsThisYear = 0;
            
            if (year === 0) {
                savingsThisYear = currentSavings;
            } else {
                // Get previous year's savings
                const previousYearSavings = projectedSavingsData[year - 1];
                
                // Apply returns to existing savings
                const returnOnSavings = previousYearSavings * (annualReturn / 100);
                
                // Calculate contribution for this year (with salary growth)
                const adjustedYearlyContribution = yearlyContributions * Math.pow((1 + (salaryGrowthRate / 100)), year - 1);
                
                // Add returns and contributions
                savingsThisYear = previousYearSavings + returnOnSavings + adjustedYearlyContribution;
            }
            
            projectedSavingsData.push(savingsThisYear);
            goalData.push(retirementGoal);
        }
        
        // Calculate total savings at retirement
        const totalSavingsAtRetirement = projectedSavingsData[yearsToRetirement];
        
        // Calculate monthly income in retirement (using the 4% rule as a baseline, adjusted for risk profile)
        let withdrawalRate = 0.04; // 4% rule as baseline
        
        // Adjust withdrawal rate based on risk tolerance
        if (riskTolerance === 'low') {
            withdrawalRate = 0.035; // More conservative
        } else if (riskTolerance === 'high') {
            withdrawalRate = 0.045; // More aggressive
        }
        
        const annualRetirementIncome = totalSavingsAtRetirement * withdrawalRate;
        const monthlyRetirementIncome = annualRetirementIncome / 12;
        
        // Calculate savings rate vs goal
        const savingsRateVsGoal = (totalSavingsAtRetirement / retirementGoal) * 100;
        
        // Update the result display
        document.getElementById('totalSavings').textContent = formatCurrency(totalSavingsAtRetirement);
        document.getElementById('monthlyIncome').textContent = formatCurrency(monthlyRetirementIncome);
        document.getElementById('savingsRate').textContent = Math.min(100, savingsRateVsGoal.toFixed(1)) + '%';
        
        // Update chart data
        progressChart.data.labels = labels;
        progressChart.data.datasets[0].data = projectedSavingsData;
        progressChart.data.datasets[1].data = goalData;
        progressChart.update();
        
        // Show potential shortfall warning if applicable
        if (totalSavingsAtRetirement < retirementGoal) {
            const shortfall = retirementGoal - totalSavingsAtRetirement;
            const additionalMonthlyRequired = (shortfall / (Math.pow((1 + (annualReturn / 100)), yearsToRetirement) - 1)) * (annualReturn / 100) / 12;
            
            showToast(`Consider adding R${Math.ceil(additionalMonthlyRequired).toLocaleString()} monthly to reach your goal.`);
        } else {
            showToast('Congratulations! You are on track to meet your retirement goal.');
        }
        
        hideSafariLoader();
    }, 1500);
});

// Responsive tab navigation for mobile
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        const tabsContainer = document.querySelector('.nav-tabs');
        tabsContainer.classList.add('flex-nowrap');
        tabsContainer.style.overflowX = 'auto';
    } else {
        const tabsContainer = document.querySelector('.nav-tabs');
        tabsContainer.classList.remove('flex-nowrap');
        tabsContainer.style.overflowX = 'visible';
    }
});

// Initialize chart on load with empty data
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab scroll for mobile
    if (window.innerWidth < 768) {
        const tabsContainer = document.querySelector('.nav-tabs');
        tabsContainer.classList.add('flex-nowrap');
        tabsContainer.style.overflowX = 'auto';
    }
    
    // Set up form validation
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
                showToast('Please enter a positive value');
            }
            
            // Special handling for percentage inputs
            if (this.id === 'annualReturn' || this.id === 'inflationRate' || this.id === 'salaryGrowthRate' || this.id === 'taxRate') {
                if (this.value > 100) {
                    this.value = 100;
                    showToast('Percentage cannot exceed 100%');
                }
            }
        });
    });
    
    // Add event listeners to handle inputs that depend on each other
    const retirementAgeInput = document.getElementById('retirementAge');
    const currentAgeInput = document.getElementById('currentAge');
    
    retirementAgeInput.addEventListener('change', function() {
        if (parseInt(this.value) <= parseInt(currentAgeInput.value)) {
            this.value = parseInt(currentAgeInput.value) + 1;
            showToast('Retirement age must be greater than current age');
        }
    });
    
    currentAgeInput.addEventListener('change', function() {
        if (parseInt(this.value) >= parseInt(retirementAgeInput.value)) {
            retirementAgeInput.value = parseInt(this.value) + 1;
            showToast('Current age must be less than retirement age');
        }
    });
    
    // Set up cross-tab validation
    document.getElementById('retirementGoal').addEventListener('change', function() {
        const retirementSpending = document.getElementById('retirementSpending').value;
        const minGoal = retirementSpending * 12 * 25; // Rough 25x annual spending rule of thumb
        
        if (parseInt(this.value) < minGoal) {
            showToast(`Consider a higher goal. Based on your spending, R${Math.ceil(minGoal).toLocaleString()} might be more realistic.`);
        }
    });
    
    // Investment strategy affects return rates
    document.getElementById('investmentStrategy').addEventListener('change', function() {
        const annualReturnInput = document.getElementById('annualReturn');
        
        switch(this.value) {
            case 'conservative':
                annualReturnInput.value = 6.5;
                break;
            case 'balanced':
                annualReturnInput.value = 8.5;
                break;
            case 'aggressive':
                annualReturnInput.value = 10.5;
                break;
        }
        
        showToast(`Expected return adjusted to ${annualReturnInput.value}% based on selected strategy`);
    });
    
    // Add tooltips for ZAR info
    addTooltips();
});

// Function to add informational tooltips
function addTooltips() {
    const tooltipElements = [
        { id: 'currentSavings', title: 'Current Savings', content: 'Your total retirement savings balance today' },
        { id: 'monthlyContribution', title: 'Monthly Contribution', content: 'Amount you save for retirement each month' },
        { id: 'annualReturn', title: 'Expected Return', content: 'Average annual investment return before inflation' },
        { id: 'inflationRate', title: 'Inflation Rate', content: 'Expected average annual increase in prices' },
        { id: 'salaryGrowthRate', title: 'Salary Growth', content: 'Expected annual increase in your salary' },
        { id: 'taxRate', title: 'Tax Rate', content: 'Your marginal income tax rate for calculating tax benefits' }
    ];
    
    tooltipElements.forEach(el => {
        const element = document.querySelector(`label[for="${el.id}"]`);
        if (element) {
            element.innerHTML += ` <i class="fas fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="${el.content}"></i>`;
        }
    });
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
}
