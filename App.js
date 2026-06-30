import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
} from 'react-native';

const buttons = [
  ['C', '⌫', '√', '÷'],
  ['sin', 'cos', 'tan', '×'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', 'x²'],
  ['0', '.', '=', '%'],
];

export default function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const updateDisplay = (value) => setDisplayValue(value);

  const clearAll = () => {
    setDisplayValue('0');
    setExpression('');
    setJustEvaluated(false);
  };

  const deleteLast = () => {
    if (justEvaluated) {
      clearAll();
      return;
    }

    if (displayValue.length <= 1) {
      updateDisplay('0');
    } else {
      updateDisplay(displayValue.slice(0, -1));
    }
  };

  const appendNumber = (value) => {
    if (justEvaluated) {
      setDisplayValue('0');
      setJustEvaluated(false);
    }

    if (value === '.' && displayValue.includes('.')) {
      return;
    }

    if (displayValue === '0' && value !== '.') {
      updateDisplay(value);
    } else {
      updateDisplay(displayValue + value);
    }
  };

  const applyOperator = (operator) => {
    if (operator === '%') {
      const percentValue = Number(displayValue) / 100;
      updateDisplay(String(percentValue));
      setExpression('');
      setJustEvaluated(true);
      return;
    }

    if (expression === '') {
      setExpression(`${displayValue}${operator}`);
    } else {
      setExpression(`${expression}${displayValue}${operator}`);
    }

    updateDisplay('0');
    setJustEvaluated(false);
  };

  const evaluateExpression = () => {
    if (expression === '') {
      return;
    }

    const fullExpression = `${expression}${displayValue}`;
    const sanitized = fullExpression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/%/g, '/100');

    try {
      const result = Function(`"use strict"; return (${sanitized})`)();
      const nextValue = Number.isFinite(result) ? String(result) : 'Error';
      updateDisplay(nextValue);
      setExpression('');
      setJustEvaluated(true);
    } catch (error) {
      updateDisplay('Error');
      setExpression('');
      setJustEvaluated(true);
    }
  };

  const applyFunction = (func) => {
    const value = Number(displayValue);
    let result = value;

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'sqr':
        result = value * value;
        break;
      case 'sin':
        result = Math.sin((value * Math.PI) / 180);
        break;
      case 'cos':
        result = Math.cos((value * Math.PI) / 180);
        break;
      case 'tan':
        result = Math.tan((value * Math.PI) / 180);
        break;
      default:
        result = value;
    }

    updateDisplay(Number.isFinite(result) ? String(result) : 'Error');
    setExpression('');
    setJustEvaluated(true);
  };

  const handlePress = (value) => {
    if (value === 'C') {
      clearAll();
      return;
    }

    if (value === '⌫') {
      deleteLast();
      return;
    }

    if (value === '=') {
      evaluateExpression();
      return;
    }

    if (['√', 'sin', 'cos', 'tan', 'x²'].includes(value)) {
      applyFunction(value === '√' ? 'sqrt' : value === 'x²' ? 'sqr' : value.toLowerCase());
      return;
    }

    if (['+', '-', '×', '÷', '%'].includes(value)) {
      applyOperator(value);
      return;
    }

    if (value === '.') {
      appendNumber('.');
      return;
    }

    if (/^[0-9]$/.test(value)) {
      appendNumber(value);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.card}>
        <Text style={styles.display}>{displayValue}</Text>
        <View style={styles.grid}>
          {buttons.flat().map((button) => (
            <Pressable
              key={button}
              style={({ pressed }) => [
                styles.button,
                button === '='
                  ? styles.equalsButton
                  : ['+', '-', '×', '÷', '%', '√', 'sin', 'cos', 'tan', 'x²'].includes(button)
                    ? styles.operatorButton
                    : ['C', '⌫'].includes(button)
                      ? styles.actionButton
                      : styles.numberButton,
                pressed && styles.pressed,
              ]}
              onPress={() => handlePress(button)}
            >
              <Text style={styles.buttonText}>{button}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ebff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  display: {
    fontSize: 36,
    color: '#2b1347',
    fontWeight: '700',
    textAlign: 'right',
    minHeight: 90,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    width: '23%',
    minHeight: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberButton: {
    backgroundColor: '#f7f1ff',
  },
  operatorButton: {
    backgroundColor: '#e9dcff',
  },
  actionButton: {
    backgroundColor: '#efe2ff',
  },
  equalsButton: {
    backgroundColor: '#7c3aed',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2b1347',
  },
});
