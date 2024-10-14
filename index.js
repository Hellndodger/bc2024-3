const { program } = require('commander');
const fs = require('fs');

// Сеттим команди
program
  .configureOutput({
  outputError: (str, write) => {
      if (str.includes("-i")) write("Please, specify input file");
  }
  });
program
  .requiredOption('-i, --input <path>', 'Input file path')  // тре шоб було
  .option('-o, --output <path>', 'Output file path') // не обов'язково шоб було
  .option('-d, --display', 'Display result in console');  // не обов'язково шоб було

// Перевіряємо аргументи командного рядка
try {
  program.parse(process.argv);
} catch (err) {
  console.error("please specify input file");
  process.exit(1); // Вихід із програми
}

program.parse(process.argv);
const tipa_options = program.opts();

// Перевіряєм чи є такий файл
if (!fs.existsSync(tipa_options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читаєм дані з файлу
const tipa_data = JSON.parse(fs.readFileSync(tipa_options.input, 'utf-8'));
console.log(tipa_data); // Виводимо дані для перевірки

// Фільтруєм потрібні категорії "Доходи, усього" та "Витрати, усього"
const tipa_incum = tipa_data.find(item => item.txt === "Доходи, усього"); // Знаходимо доходи
const tipa_vutraty = tipa_data.find(item => item.txt === "Витрати, усього"); // Знаходимо витрати  

// Формуємо результат з знайдених значень
const tipa_resultat = {
  "Доходи, усього": tipa_incum ? tipa_incum.value : "Не знайдено", // Якщо знайдено, беремо значення
  "Витрати, усього": tipa_vutraty ? tipa_vutraty.value : "Не знайдено" // Якщо знайдено, беремо значення
};

// Записуєм результат у файлик або виводим в консоль
if (tipa_options.output) {
  fs.writeFileSync(tipa_options.output, JSON.stringify(tipa_resultat, null, 2)); // Записуємо у файл
}

if (tipa_options.display) {
  console.log(tipa_resultat); // Виводимо результат у консоль
}
