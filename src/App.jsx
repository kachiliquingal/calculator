import { useState } from 'react';
import './App.css';

export default function App() {
    const [display, setDisplay] = useState('0');
    const [currentValue, setCurrentValue] = useState('');
    const [previousValue, setPreviousValue] = useState('');
    const [operator, setOperator] = useState(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);
    const [error, setError] = useState('');

    const handleNumberClick = (num) => {
        setError('');
        if (waitingForNewValue) {
            setCurrentValue(String(num));
            setDisplay(String(num));
            setWaitingForNewValue(false);
        } else {
            setCurrentValue(prev => (prev === '0' || prev === '' ? String(num) : prev + String(num)));
            setDisplay(prev => (prev === '0' || prev === '' ? String(num) : prev + String(num)));
        }
    };

    const handleOperatorClick = (nextOperator) => {
        setError('');
        const prevNum = parseFloat(previousValue);
        const currNum = parseFloat(currentValue);

        if (operator && !waitingForNewValue) {
            try {
                const result = calculate(prevNum, currNum, operator);
                setPreviousValue(String(result));
                setCurrentValue(String(result));
                setDisplay(String(result));
            } catch (err) {
                setError(err.message);
                setDisplay('Error');
                setPreviousValue('');
                setCurrentValue('');
                setOperator(null);
                setWaitingForNewValue(false);
                return;
            }
        } else if (currentValue) {
            setPreviousValue(currentValue);
        }
        setOperator(nextOperator);
        setWaitingForNewValue(true);
    };

    const handleEqualsClick = () => {
        setError('');
        const prevNum = parseFloat(previousValue);
        const currNum = parseFloat(currentValue);

        if (operator && !waitingForNewValue) {
            try {
                const result = calculate(prevNum, currNum, operator);
                setPreviousValue('');
                setCurrentValue(String(result));
                setDisplay(String(result));
                setOperator(null);
                setWaitingForNewValue(true);
            } catch (err) {
                setError(err.message);
                setDisplay('Error');
                setPreviousValue('');
                setCurrentValue('');
                setOperator(null);
                setWaitingForNewValue(false);
            }
        } else {
            setError('Operación inválida');
        }
    };

    const calculate = (num1, num2, op) => {
        if (isNaN(num1) || isNaN(num2)) {
            throw new Error("Formato numérico inválido.");
        }
        switch (op) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case 'X':
                return num1 * num2;
            case '/':
                if (num2 === 0) {
                    throw new Error("División por cero.");
                }
                return num1 / num2;
            case '%': // Porcentaje se aplica al número actual
                return num1 * (num2 / 100);
            default:
                return num2;
        }
    };

    const handleClear = () => {
        setError('');
        setDisplay('0');
        setCurrentValue('');
        setPreviousValue('');
        setOperator(null);
        setWaitingForNewValue(false);
    };

    const handleDeleteLastChar = () => {
        setError('');
        if (currentValue.length > 0 && !waitingForNewValue) {
            const newCurrentValue = currentValue.slice(0, -1);
            setCurrentValue(newCurrentValue === '' ? '0' : newCurrentValue);
            setDisplay(newCurrentValue === '' ? '0' : newCurrentValue);
        }
    };

    return (
        <div className="calculator-container">
            <div className="display-area">
                <input type="text" className="display" value={error ? error : display} readOnly />
            </div>
            <div className="buttons-grid">
                <button onClick={handleClear} className="operator-btn">C</button>
                <button onClick={() => handleOperatorClick('/')} className="operator-btn">/</button>
                <button onClick={() => handleOperatorClick('X')} className="operator-btn">X</button>
                <button onClick={handleDeleteLastChar} className="delete-btn">Borrar</button>

                <button onClick={() => handleNumberClick(7)}>7</button>
                <button onClick={() => handleNumberClick(8)}>8</button>
                <button onClick={() => handleNumberClick(9)}>9</button>
                <button onClick={() => handleOperatorClick('-')} className="operator-btn">-</button>

                <button onClick={() => handleNumberClick(4)}>4</button>
                <button onClick={() => handleNumberClick(5)}>5</button>
                <button onClick={() => handleNumberClick(6)}>6</button>
                <button onClick={() => handleOperatorClick('+')} className="operator-btn">+</button>

                <button onClick={() => handleNumberClick(1)}>1</button>
                <button onClick={() => handleNumberClick(2)}>2</button>
                <button onClick={() => handleNumberClick(3)}>3</button>
                <button onClick={() => handleOperatorClick('%')} className="operator-btn">%</button>

                <button onClick={() => handleNumberClick(0)} className="span-two">0</button>
                <button onClick={handleEqualsClick} className="equals-btn">=</button>
            </div>
        </div>
    );
}