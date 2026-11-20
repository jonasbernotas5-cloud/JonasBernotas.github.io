const contactForm = document.getElementById('contactForm');
const resultsBox = document.getElementById('formResults');

if (contactForm && resultsBox) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
      vardas: document.getElementById('firstName').value.trim(),
      pavarde: document.getElementById('lastName').value.trim(),
      elPastas: document.getElementById('email').value.trim(),
      telNumeris: document.getElementById('phone').value.trim(),
      adresas: document.getElementById('address').value.trim(),
      klausimas1: Number(document.getElementById('rating1').value),
      klausimas2: Number(document.getElementById('rating2').value),
      klausimas3: Number(document.getElementById('rating3').value)
    };

    console.log(formData);

    resultsBox.innerHTML = `
      <p><strong>Vardas:</strong> ${formData.vardas}</p>
      <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
      <p><strong>El. paštas:</strong> <a href="mailto:${formData.elPastas}">${formData.elPastas}</a></p>
      <p><strong>Tel. Numeris:</strong> ${formData.telNumeris}</p>
      <p><strong>Adresas:</strong> ${formData.adresas}</p>
      <p><strong>1 klausimas (Dizainas):</strong> ${formData.klausimas1}</p>
      <p><strong>2 klausimas (Projektai):</strong> ${formData.klausimas2}</p>
      <p><strong>3 klausimas (Rekomendacija):</strong> ${formData.klausimas3}</p>
    `;

    resultsBox.style.display = 'block';
  });
}