document.addEventListener("DOMContentLoaded", async function() {
  const marcas = await fetchMarcas();
  const marcaDropdown = document.getElementById("marca");

  marcas.forEach(marca => {
    const option = document.createElement("option");
    option.text = marca;
    marcaDropdown.add(option);
  });

  marcaDropdown.addEventListener("change", async function() {
    await populateModels();
  });

  const modeloDropdown = document.getElementById("modelo");
  modeloDropdown.addEventListener("change", calculatePrices);
});

async function fetchMarcas() {
  const response = await fetch('CarFilms.xlsx');
  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(worksheet);

  return [...new Set(json.map(row => row.MARCA))];
}

async function populateModels() {
  const selectedMarca = document.getElementById("marca").value;
  const modelos = await fetchModelos(selectedMarca);
  const modeloDropdown = document.getElementById("modelo");

  modeloDropdown.innerHTML = ""; // Limpa as opções existentes

  modelos.forEach(modelo => {
    const option = document.createElement("option");
    option.text = modelo;
    modeloDropdown.add(option);
  });
}

async function fetchModelos(marca) {
  const response = await fetch('CarFilms.xlsx');
  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(worksheet);

  const modelos = json.filter(row => row.MARCA === marca).map(row => row.MODELO);
  return [...new Set(modelos)];
}

async function calculatePrices() {
  const selectedMarca = document.getElementById("marca").value;
  const selectedModelo = document.getElementById("modelo").value;

  const response = await fetch('CarFilms.xlsx');
  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(worksheet);

  const carInfo = json.find(row => row.MARCA === selectedMarca && row.MODELO === selectedModelo);

  document.getElementById("traseiro").innerText = carInfo["LATERAL TRASEIRO"];
  document.getElementById("parabrisa").innerText = carInfo["PARABRISA"];
  document.getElementById("tetosolar").innerText = carInfo["TETO SOLAR"];
}