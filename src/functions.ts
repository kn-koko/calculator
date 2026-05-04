export function getDisplay(
  pressed: string,
  current: string,
): string {
  let result: string;

  const currentWithoutDecimalPoint = current.replace(".", "");

  // current は 小数点を除いて7桁以下か？
  if (currentWithoutDecimalPoint.length < 8) {
    // 7桁以下なら、pressed を current の末尾に追加したものを result とする
    result = current + pressed;
  } else {
    // 8桁以上なら、current を result とする
    result = current;
  }

  return result;
}
