test(' Testing', () => {
  const n = null;
  expect(n).toBeNull()
}
)

test(' Check if true', () => {
  const n = 2;
  if (n % 2 == 0) {
    expect(true).toBeTruthy();
  } else {
    expect(false).toBeFalsy();
  }
})

test('2+2', () => {
  const result = 2 + 2;
  expect(result).toBeGreaterThan(3);
})