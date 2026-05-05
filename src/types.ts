import { INPUT_VALUES, OPERATORS } from "./constants";

export type CalculatorState = {
  displayValue: string;
  operator: Operator | null;
  firstOperand: number | null;
  waitingForInput: boolean;
}

export type Operator = typeof OPERATORS[number];

export type Input = typeof INPUT_VALUES[number];

export type Submit = "=";
