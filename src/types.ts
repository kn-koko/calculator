import { INPUT_VALUES, OPERATORS } from "./constants";

// INPUT_VALUES の要素のいずれかを表す型
// export type Input = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0" | "." | "C"; と同じ意味
export type Input = typeof INPUT_VALUES[number];

// OPERATORS の要素のいずれかを表す型
// export type Operator = "+" | "-" | "*" | "/"; と同じ意味
export type Operator = typeof OPERATORS[number];

// Submit は "=" のみを表す型
export type Submit = "=";
