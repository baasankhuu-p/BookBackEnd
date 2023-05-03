module.exports = function (numbers) {
  const min = Math.pow(10, numbers - 1); // Минимум 10-н digits
  const max = Math.pow(10, numbers) - 1; // Максимум 10^(numbers+1) - 1
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
