import type { CalculatorState, Input, Operator } from "./types";

// =================================
// state management functions
// =================================

// 電卓の状態を初期化する関数
export function getInitialState(): CalculatorState {
  return {
    displayValue: "",
    operator: null,
    firstOperand: null,
    waitingForInput: false,
  };
}

// 入力ボタンが押されたときの状態更新関数
export function updateInputState(state: CalculatorState, inputValue: Input): void {
  // C ボタンが押された場合: 状態を初期化する
  if (inputValue === "C") {
    Object.assign(state, getInitialState());
    return;
  }

  // 小数点入力の場合: すでに小数点がある場合や、入力待ち状態・空文字・マイナス記号のみの場合は無視する
  if (inputValue === ".") {
    if (
      state.waitingForInput ||
      state.displayValue === "" ||
      state.displayValue === "-" ||
      state.displayValue.includes(".")
    ) return;
    state.displayValue += ".";
    return;
  }

  // 0 入力の場合
  if (inputValue === "0") {
    if (state.waitingForInput) {
      // 演算子または = の直後: 新しい数値 "0" の入力を開始する
      state.waitingForInput = false;
      state.displayValue = "0";
      return;
    }
    // 現在の表示が "0" のみの場合は無視する
    if (state.displayValue === "0") {
      return;
    }
    // それ以外の場合は現在の表示値の末尾に "0" を追加する
    state.displayValue += "0";
    return;
  }

  // 数字入力の場合: 第2オペランド待ち状態の場合は新しい数値の入力を開始し、それ以外の場合は現在の表示値の末尾に数字を追加する
  if (state.waitingForInput) {
    // 演算子または = の直後: 新しい数値の入力を開始する
    state.waitingForInput = false;
    state.displayValue = inputValue;
  } else {
    state.displayValue = appendDigit(inputValue, state.displayValue);
  }
}

// 演算子ボタンが押されたときの状態更新関数。成功時は true、0 除算エラー時は false を返す。
export function updateOperatorState(state: CalculatorState, operator: Operator): boolean {
  // 演算子入力直後（第2オペランド待ち）: 演算子を上書きする
  if (state.waitingForInput && state.firstOperand !== null) {
    state.operator = operator;
    return true;
  }

  // 数値が未入力: マイナス記号のみ負の数の符号として許可する
  if (state.displayValue === "" || state.displayValue === "-") {
    if (operator === "-") {
      state.displayValue = "-";
    }
    return true;
  }

  // 現在の表示値を数値に変換する
  const currentValue = toNumber(state.displayValue);

  // 演算子が既にある場合: 左から順に計算してから新しい演算子を設定する
  if (state.firstOperand !== null && state.operator !== null) {
    const result = calculate(state.firstOperand, state.operator, currentValue);
    // result が null になるのは 0 除算エラーのみなので、エラー (false) を返す
    if (result === null) {
      return false;
    }
    // 計算結果を第1オペランド・表示値に設定する
    state.firstOperand = result;
    state.displayValue = formatResult(result);
  } else {
    // 演算子が未設定の場合: 第1オペランドに現在の表示値を設定する
    state.firstOperand = currentValue;
  }

  // 演算子を設定して、第2オペランドの入力待ち状態へ移行
  state.operator = operator;
  state.waitingForInput = true;
  return true;
}

// イコールボタンが押された場合の処理を行う関数。成功時は true、0 除算エラー時は false を返す
export function handleSubmit(state: CalculatorState): boolean {
  // 演算子直後・演算子未入力の場合は何もしない
  if (state.waitingForInput || state.operator === null || state.firstOperand === null) {
    return true;
  }

  // 第2オペランドを数値に変換して計算を実行する
  const secondOperand = toNumber(state.displayValue);
  const result = calculate(state.firstOperand, state.operator, secondOperand);

  // 0 除算エラーの場合は false を返す
  if (result === null) {
    return false;
  }

  // 計算結果を表示して状態をリセットする
  state.displayValue = formatResult(result);
  state.firstOperand = null;
  state.operator = null;
  state.waitingForInput = true;
  return true;
}

// =================================
// calculation functions
// =================================

// 計算を行う関数。0 除算エラーの場合は null を返す。
export function calculate(first: number, operator: Operator, second: number): number | null {
  switch (operator) {
    case '+': return first + second;
    case '-': return first - second;
    case '*': return first * second;
    case '/': return second === 0 ? null : first / second;
  }
}

// =================================
// display functions
// =================================

// 計算結果を表示用の文字列に変換する関数。整数部分の桁数が 8 桁を超える場合は指数表記にする。
export function formatResult(value: number): string {
  const str = String(value);
  // 負符号と小数点を除いた桁数をカウントする
  const digitCount = str.replace('-', '').replace('.', '').length;
  // 8桁を超える場合は指数表記にする
  return digitCount > 8 ? value.toExponential(7) : str;
}

// 入力された digit を current の末尾に追加した文字列を返す関数。
// ただし、current は小数点・負符号を除いて 8 桁未満の場合に限る。
function appendDigit(digit: string, current: string): string {
  // 現在の表示が "0" のみの場合は、入力された digit を新しい表示値とする
  if (current === "0") {
    return digit;
  }

  // 負符号と小数点を除いた桁数をカウントする
  const digitCount = current.replace('-', '').replace('.', '').length;
  if (digitCount < 8) {
    // 8桁未満なら、digit を current の末尾に追加したものを返す
    return current + digit;
  } else {
    // 8桁以上なら、current をそのまま返す
    return current;
  }
}

// 現在の状態から表示すべき文字列を取得する関数
export function getDisplayString(state: CalculatorState): string {
  return state.displayValue;
}

// display-value 要素のテキストを更新する関数
export function display(message: string): void {
  document.getElementById('display-value')!.textContent = String(message);
}

// =================================
// utility functions
// =================================

// 入力を数値に変換する関数
export function toNumber(input: string): number {
  const halfWidthInput = toHalfWidthAlnum(input);
  const inputNumber = Number(halfWidthInput);

  // バリデーション (検証)
  // Not a Number
  if (Number.isNaN(inputNumber)) {
    alert("数値を入力してください");
  }

  return inputNumber;
}

// 全角文字を半角文字に変換する関数
function toHalfWidthAlnum(str: string) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  );
}
