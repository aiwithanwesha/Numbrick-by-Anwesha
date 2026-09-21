// --- Mobile Menu Slide Animation Handler ---
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const menuIcon = document.querySelector('.menu-toggle i');

    if (!navLinks) return;
    navLinks.classList.toggle('active');

    if (menuIcon) {
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    }
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const navLinks = document.getElementById('nav-links');
        const menuIcon = document.querySelector('.menu-toggle i');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });
});

// Switch inside Central Calculator Box
function switchCalcTab(viewName, event) {
    document.querySelectorAll('.calc-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.calc-tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(viewName + '-view').classList.add('active');
    event.currentTarget.classList.add('active');
}

// Shared History Array
let calculationHistory = [];

function addHistory(expression, result) {
    calculationHistory.unshift({ expression, result });
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-container');
    if (calculationHistory.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; font-size: 0.85rem;">No history yet.</p>`;
        return;
    }
    container.innerHTML = calculationHistory.map(item => `
        <div class="history-item">
            <span>${item.expression}</span>
            <strong>= ${item.result}</strong>
        </div>
    `).join('');
}

function clearHistory() {
    calculationHistory = [];
    renderHistory();
}

// --- Standard Calculator Logic ---
let stdInput = "0";

function appendValue(val) {
    if (stdInput === "0" && val !== '.') {
        stdInput = val;
    } else {
        stdInput += val;
    }
    document.getElementById('std-display').innerText = stdInput;
}

function clearDisplay() {
    stdInput = "0";
    document.getElementById('std-display').innerText = stdInput;
    document.getElementById('std-history').innerText = "";
}

function deleteChar() {
    stdInput = stdInput.length > 1 ? stdInput.slice(0, -1) : "0";
    document.getElementById('std-display').innerText = stdInput;
}

function calculateResult() {
    try {
        let sanitized = stdInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
        let res = eval(sanitized);
        document.getElementById('std-history').innerText = stdInput + " =";
        addHistory(stdInput, res);
        stdInput = String(res);
        document.getElementById('std-display').innerText = stdInput;
    } catch (error) {
        document.getElementById('std-display').innerText = "Error";
        stdInput = "0";
    }
}


function handleStdParentheses() {
    let openCount = (stdInput.match(/\(/g) || []).length;
    let closeCount = (stdInput.match(/\)/g) || []).length;
    let lastChar = stdInput.slice(-1);

    if (openCount > closeCount && !['+', '-', '*', '/', '(', ''].includes(lastChar)) {
        stdInput += ')';
    } else {
        if (stdInput === "0") stdInput = "(";
        else stdInput += '(';
    }
    document.getElementById('std-display').innerText = stdInput;
}

// --- Scientific Calculator Logic ---
let sciInput = "";
let isInverse = false;
let isDegreeMode = true; // true = Deg, false = Rad

function toggleAngleMode() {
    isDegreeMode = !isDegreeMode;
    const btn = document.getElementById('deg-rad-btn');
    btn.innerText = isDegreeMode ? "Deg" : "Rad";
}

function toggleInverse() {
    isInverse = !isInverse;
    const invBtn = document.getElementById('inv-btn');
    
    if (isInverse) {
        invBtn.style.background = 'var(--accent-color)';
        invBtn.style.color = 'white';
    } else {
        invBtn.style.background = '';
        invBtn.style.color = '';
    }

    document.getElementById('btn-sin').innerText = isInverse ? "sin⁻¹" : "sin";
    document.getElementById('btn-cos').innerText = isInverse ? "cos⁻¹" : "cos";
    document.getElementById('btn-tan').innerText = isInverse ? "tan⁻¹" : "tan";
    document.getElementById('btn-ln-ex').innerText = isInverse ? "eˣ" : "ln";
    document.getElementById('btn-log-10x').innerText = isInverse ? "10ˣ" : "log";
    document.getElementById('btn-sqrt-sq').innerText = isInverse ? "x²" : "√";
}

function sciAppend(val) {
    sciInput += val;
    document.getElementById('sci-display').innerText = sciInput || "0";
}

function handleTrig(funcType) {
    if (sciInput === "0") {
        sciInput = "";
    }
    if (isInverse) {
        sciInput += `${funcType}⁻¹(`; 
    } else {
        sciInput += `${funcType}(`;
    }
    document.getElementById('sci-display').innerText = sciInput;
}

function handleLnEx() {
    if (sciInput === "0") {
        sciInput = "";
    }
    if (isInverse) {
        sciInput += "e^("; 
    } else {
        sciInput += "ln("; 
    }
    document.getElementById('sci-display').innerText = sciInput;
}

function handleLog10x() {
    if (isInverse) {
        sciInput += "10^"; 
    } else {
        sciInput += "log("; 
    }
    document.getElementById('sci-display').innerText = sciInput;
}

function handleSqrtSquare() {
    if (sciInput === "0") {
        sciInput = "";
    }
    if (isInverse) {
        sciInput += "^2"; 
    } else {
        sciInput += "√("; 
    }
    document.getElementById('sci-display').innerText = sciInput;
}

function handleParentheses() {
    let openCount = (sciInput.match(/\(/g) || []).length;
    let closeCount = (sciInput.match(/\)/g) || []).length;
    let lastChar = sciInput.slice(-1);

    if (openCount > closeCount && !['+', '-', '*', '/', '(', ''].includes(lastChar)) {
        sciInput += ')';
    } else {
        if (sciInput === "0") sciInput = "(";
        else sciInput += '(';
    }
    document.getElementById('sci-display').innerText = sciInput;
}


function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function sciFactorial() {
    sciInput += "!";
    document.getElementById('sci-display').innerText = sciInput;
}

function sciClear() {
    sciInput = "";
    document.getElementById('sci-display').innerText = "0";
    document.getElementById('sci-history').innerText = "";
}

function sciDelete() {
    sciInput = sciInput.length > 1 ? sciInput.slice(0, -1) : "";
    document.getElementById('sci-display').innerText = sciInput || "0";
}

function sciCalculate() {
    try {
        let processedInput = sciInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/√/g, 'Math.sqrt')
            .replace(/%/g, '/100');

        processedInput = processedInput.replace(/(\d+)!/g, (match, p1) => factorial(parseInt(p1)));

        const angleMultiplier = isDegreeMode ? Math.PI / 180 : 1;
        const inverseAngleMultiplier = isDegreeMode ? 180 / Math.PI : 1;

        const sin = (val) => Math.sin(val * angleMultiplier);
        const cos = (val) => Math.cos(val * angleMultiplier);
        const tan = (val) => Math.tan(val * angleMultiplier);
        
        const sinInv = (val) => Math.asin(val) * inverseAngleMultiplier;
        const cosInv = (val) => Math.acos(val) * inverseAngleMultiplier;
        const tanInv = (val) => Math.atan(val) * inverseAngleMultiplier;

        const ln = (val) => Math.log(val);
        const log = (val) => Math.log10(val);
        const exp = (val) => Math.exp(val);
        const pow10 = (val) => Math.pow(10, val);

        let evaluableString = processedInput
            .replace(/sin⁻¹\(/g, 'sinInv(')
            .replace(/cos⁻¹\(/g, 'cosInv(')
            .replace(/tan⁻¹\(/g, 'tanInv(')
            .replace(/eˣ\(/g, 'exp(')
            .replace(/10ˣ\(/g, 'pow10(');

        let res = Function('sin', 'cos', 'tan', 'sinInv', 'cosInv', 'tanInv', 'ln', 'log', 'exp', 'pow10', `return ${evaluableString};`)(
            sin, cos, tan, sinInv, cosInv, tanInv, ln, log, exp, pow10
        );

        document.getElementById('sci-history').innerText = sciInput + " =";
        addHistory(sciInput, res);
        sciInput = String(res);
        document.getElementById('sci-display').innerText = sciInput;
    } catch (e) {
        document.getElementById('sci-display').innerText = "Error";
        sciInput = "";
    }
}

// --- Unit Converter Logic ---
const units = {
    length: { 'Meter': 1, 'Centimeter': 0.01, 'Millimeter': 0.001, 'Kilometer': 1000, 'Inch': 0.0254, 'Foot': 0.3048, 'Mile': 1609.34, 'Yard': 0.9144, 'Nautical Mile': 1852 },
    weight: { 'Kilogram': 1, 'Gram': 0.001, 'Milligram': 0.000001, 'Pound': 0.453592, 'Tonne': 1000, 'Stone': 6.35029, 'Ounce': 0.0283495, 'US Ton': 907.185, 'Imperial Ton': 1016.05 },
    temperature: { celsius: 'C', fahrenheit: 'F', kelvin: 'K' },
    area: { 'Square Meter': 1, 'Square Kilometer': 1000000, 'Square Foot': 0.092903, 'Square Yard': 0.836127, 'Square Inch': 0.00064516, 'Hectare': 10000, 'Acre': 4046.86 },
    volume: { 'Liter': 1, 'Milliliter': 0.001, 'Cubic Meter': 1000, 'Cubic Foot': 28.3168, 'Cubic Inch': 0.0163871, 'Imperial Gallon': 4.54609 },
    time: { 'Second': 1, 'Minute': 60, 'Hour': 3600, 'Day': 86400, 'Week': 604800 },
    speed: { 'Km / h': 1, 'm / s': 3.6, 'Mile / Hour': 1.60934, 'Foot / Second': 1.09728, 'Knot': 1.852},
    data: { bit: 0.125, byte: 1, KB: 1024, MB: 1048576, GB: 1073741824 }
};

function updateUnits() {
    const typeElement = document.getElementById('conv-type');
    const fromSelect = document.getElementById('conv-from');
    const toSelect = document.getElementById('conv-to');

    if (!typeElement || !fromSelect || !toSelect) return;

    const type = typeElement.value;
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    for (let unit in units[type]) {
        fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    }
    if (toSelect.options.length > 1) toSelect.selectedIndex = 1;
    convertUnits();
}

function convertUnits() {
    const type = document.getElementById('conv-type').value;
    const from = document.getElementById('conv-from').value;
    const to = document.getElementById('conv-to').value;
    const val = parseFloat(document.getElementById('conv-value').value);

    if (isNaN(val)) {
        document.getElementById('conv-result').innerText = "Result: 0";
        return;
    }

    let finalVal = 0;

    if (type === 'temperature') {
        let celsiusVal = val;
        if (from === 'fahrenheit') celsiusVal = (val - 32) * 5/9;
        if (from === 'kelvin') celsiusVal = val - 273.15;

        if (to === 'celsius') finalVal = celsiusVal;
        else if (to === 'fahrenheit') finalVal = (celsiusVal * 9/5) + 32;
        else if (to === 'kelvin') finalVal = celsiusVal + 273.15;
    } else {
        const baseVal = val * units[type][from];
        finalVal = baseVal / units[type][to];
    }

    document.getElementById('conv-result').innerText = `Result: ${finalVal.toFixed(4)} ${to}`;
}

updateUnits();

// --- Currency Converter Logic ---
const exchangeRates = {
    USD: { INR: 95.94, EUR: 0.87, GBP: 0.75, USD: 1 },
    EUR: { USD: 1.15, INR: 110.41, GBP: 0.86, EUR: 1 },
    INR: { USD: 0.010, EUR: 0.0091, GBP: 0.0078, INR: 1 },
    GBP: { USD: 1.34, EUR: 1.17, INR: 128.57, GBP: 1 }
};

function convertCurrency() {
    const fromElement = document.getElementById('curr-from');
    const toElement = document.getElementById('curr-to');
    const valElement = document.getElementById('curr-value');
    const resultElement = document.getElementById('curr-result');

    if (!fromElement || !toElement || !valElement || !resultElement) return;

    const from = fromElement.value;
    const to = toElement.value;
    const val = parseFloat(valElement.value);

    if (isNaN(val) || val === "") {
        resultElement.innerText = "Result: 0";
        return;
    }

    const rate = exchangeRates[from][to];
    if (rate === undefined) {
        resultElement.innerText = "Result: Invalid";
        return;
    }

    const result = val * rate;
    resultElement.innerText = `Result: ${result.toFixed(2)} ${to}`;
}

// --- BMI Calculator Logic ---
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const heightCm = parseFloat(document.getElementById('bmi-height').value);

    if (!weight || !heightCm) {
        document.getElementById('bmi-result').innerText = "Please enter valid numbers";
        return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(2);
    let category = "";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    document.getElementById('bmi-result').innerText = `BMI: ${bmi} (${category})`;
}

// --- Age Calculator Logic ---
function calculateAge() {
    const dobVal = document.getElementById('birth-date').value;
    if (!dobVal) {
        document.getElementById('age-result').innerText = "Please select a date";
        return;
    }

    const dob = new Date(dobVal);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('age-result').innerText = `${years} Years, ${months} Months, ${days} Days`;
}
