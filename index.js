const { program } = require('commander');
const fs = require('fs');

// Сеттим команди
program
  .requiredOption('-i, --input <path>', 'Input file path')  //тре шоб було
  .option('-o, --output <path>', 'Output file path') //не обовязково шоб було
  .option('-d, --display', 'Display result in console');  //не обовязково шоб було

program.parse(process.argv);
const tipa_options = program.opts();

// Перевіряєм чи є такий файл
if (!fs.existsSync(tipa_options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читаєм дані з файлу
const tipa_data = JSON.parse(fs.readFileSync(tipa_options.input, 'utf-8'));

// Фільтруєм потрібні категорії
const tipa_incum = tipa_data.find(item => item.indicator === "Доходи, усього");
const tipa_vutraty = tipa_data.find(item => item.indicator === "Витрати, усього");

const tipa_resultat = {
  "Доходи, усього": tipa_incum ? tipa_incum.value : "Не знайдено",
  "Витрати, усього": tipa_vutraty ? tipa_vutraty.value : "Не знайдено"
};

// Записуєм результат у файлик або виводим в консоль
if (tipa_options.output) {
  fs.writeFileSync(tipa_options.output, JSON.stringify(tipa_resultat, null, 2));
}

if (tipa_options.display) {
  console.log(tipa_resultat);
}
