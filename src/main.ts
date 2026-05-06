import './style.css'
import { getDisplay } from './functions';
import type { Input } from './types';

function main() {
  // ボタンを取得
  const inputButtons = document.querySelectorAll('.input-btn') as NodeListOf<HTMLButtonElement>;

  // 入力ボタンを押したときの処理
  inputButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // 入力ボタンの data-value 属性を取得する
      //
      const inputValue = button.dataset.value as Input;

      // 現在の display の値を取得する
      const display = document.getElementById('display-value') as HTMLSpanElement;
      const displayValue = display.textContent;

      // C を入力すると display を空にする
      if (inputValue === "C") {
        display.textContent = "";
        return;
      }

      // 未入力及び既に小数点が入力されている状態で . を入力しても何もしない
      if (inputValue === "." && (displayValue === "" || displayValue?.includes("."))) {
        return;
      }

      // 既に0が入力されている状態で0を入力しても何もしない
      if (inputValue === "0" && displayValue === "0") {
        return;
      }

      // 表示を更新
      const newDisplayValue = getDisplay(inputValue, displayValue);
      display.textContent = newDisplayValue;
    })
  })
}

main();
