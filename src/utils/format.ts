const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convert(n: number): string {
  if (n < 20) {
    return ONES[n];
  }
  if (n < 100) {
    return `${TENS[Math.floor(n / 10)]}${
      n % 10 !== 0 ? ` ${ONES[n % 10]}` : ""
    }`;
  }
  if (n < 1000) {
    return `${ONES[Math.floor(n / 100)]} Hundred${
      n % 100 !== 0 ? ` ${convert(n % 100)}` : ""
    }`;
  }
  if (n < 1_000_000) {
    return `${convert(Math.floor(n / 1000))} Thousand${
      n % 1000 !== 0 ? ` ${convert(n % 1000)}` : ""
    }`;
  }
  if (n < 1_000_000_000) {
    return `${convert(Math.floor(n / 1_000_000))} Million${
      n % 1_000_000 !== 0 ? ` ${convert(n % 1_000_000)}` : ""
    }`;
  }
  return "Number too large";
}

export function numberToWords(amount: number): string {
  const num = Math.floor(amount);
  if (num === 0) {
    return "Zero";
  }

  return convert(num);
}
