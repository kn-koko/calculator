import './style.css'
import { display, getDisplayString, getInitialState, updateInputState, updateOperatorState, handleSubmit } from './functions';
import type { Input, Operator } from './types';
import { ERROR_MESSAGE } from './constants';

function main() {
  // 電卓の状態を初期化
  let state = getInitialState();

  // 各種ボタンの要素を取得
  const inputButtons = document.querySelectorAll('.input-btn') as NodeListOf<HTMLButtonElement>;
  const operatorButtons = document.querySelectorAll('.operator-btn') as NodeListOf<HTMLButtonElement>;
  const submitButton = document.querySelector('.submit-btn') as HTMLButtonElement;

  // 入力ボタンをクリックしたときの処理
  inputButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // input ボタンの data-value 属性から入力値を取得
      const inputValue = button.dataset.value as Input;

      // 電卓の状態を更新
      updateInputState(state, inputValue);

      // 表示を更新
      display(getDisplayString(state));
    });
  });

  // 演算子ボタンをクリックしたときの処理
  operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // operator ボタンの data-value 属性から演算子を取得
      const operator = button.dataset.value as Operator;

      // 電卓の状態を更新
      const success = updateOperatorState(state, operator);

      // 状態更新に失敗した場合はエラーを表示して状態をリセット
      if (!success) {
        console.error("0 除算エラー");
        display(ERROR_MESSAGE);
        state = getInitialState();
        return;
      }

      // 表示を更新
      display(getDisplayString(state));
    });
  });

  // イコールボタンをクリックしたときの処理
  submitButton?.addEventListener('click', () => {
    // 状態を更新して計算を実行
    const success = handleSubmit(state);

    // 状態更新に失敗した場合はエラーを表示して状態をリセット
    if (!success) {
      console.error("0 除算エラー");
      display(ERROR_MESSAGE);
      state = getInitialState();
      return;
    }

    // 表示を更新
    display(getDisplayString(state));
  });
}

main();
