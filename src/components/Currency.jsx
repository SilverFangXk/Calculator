import { useState, useEffect } from 'react';

export function Currency({ dark }) {
    const [currencies, setCurrencies] = useState([]);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');
    const [amount, setAmount] = useState(1); // Start at 1 to prevent 0 error
    const [result, setResult] = useState(0);

    // Fetch currency list
    useEffect(() => {
        fetch('/api/currencies')
            .then((res) => res.json())
            .then((data) => setCurrencies(Object.keys(data)))
            .catch((err) => console.error("Currency list fetch error:", err));
    }, []);

    // Convert function
    const handleConvert = () => {
        if (amount <= 0) return alert("Please enter an amount > 0");
        if (from === to) return setResult(amount);
        
        fetch(`/api/latest?amount=${amount}&from=${from}&to=${to}`)
            .then((res) => {
                if (!res.ok) throw new Error("API call failed");
                return res.json();
            })
            .then((data) => {
                setResult(data.rates[to]);
            })
            .catch((err) => console.error("Conversion error:", err));
    };

    return (
        <div className={`${dark ? "bg-card-dark" : "bg-card-light"} rounded-calculator p-7 w-100 transition-all duration-300 shadow-2xl`}>
            <h2 className={`text-xl font-bold mb-4 ${dark ? "text-text-dark" : "text-text-light"}`}>
                Currency Converter
            </h2>

            <div className="space-y-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className={`w-full p-3 rounded-xl ${dark ? "bg-button-dark text-white" : "bg-button-light text-black"}`}
                />

                <div className="flex gap-2">
                    <select 
                        value={from} 
                        onChange={(e) => setFrom(e.target.value)}
                        className={`flex-1 p-2 rounded-lg ${dark ? "bg-button-dark text-white" : "bg-button-light text-black"}`}
                    >
                        {currencies.map((curr) => <option key={curr} value={curr}>{curr}</option>)}
                    </select>

                    <select 
                        value={to} 
                        onChange={(e) => setTo(e.target.value)}
                        className={`flex-1 p-2 rounded-lg ${dark ? "bg-button-dark text-white" : "bg-button-light text-black"}`}
                    >
                        {currencies.map((curr) => <option key={curr} value={curr}>{curr}</option>)}
                    </select>
                </div>

                <button 
                    onClick={handleConvert}
                    className="w-full h-12 bg-accent text-white rounded-xl font-semibold active:scale-95 transition-all"
                >
                    Convert
                </button>

                <div className={`p-4 rounded-xl text-center font-bold text-lg ${dark ? "bg-button-dark text-white" : "bg-button-light text-black"}`}>
                    {result} {to}
                </div>
            </div>
        </div>
    );
}