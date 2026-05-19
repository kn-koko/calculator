import { describe, it, expect } from 'vitest';
import { getDisplay } from '../src/functions';

describe('getDisplay 関数のテスト', () => {
  // 正常系
  it('2が表示されているときに3をおすと23になる', () => {
    expect(getDisplay("3", "2")).toBe("23");
  });

  it('23が表示されているときに3をおすと233になる', () => {
    expect(getDisplay("3", "23")).toBe("233");
  });

  // 異常系
  it('既に0が表示されているときに1を押すと1になる', () => {
    expect(getDisplay("1", "0")).toBe("1");
  });
});
