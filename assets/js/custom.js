const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsBox = document.getElementById('formResults');

const fields = {
  firstName: {
    el: document.getElementById('firstName'),
    err: document.getElementById('firstNameError'),
    check: v => !v ? 'Įveskite vardą.' : !/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]+$/.test(v) ? 'Vardą gali sudaryti tik raidės.' : ''
  },
  lastName: {
    el: document.getElementById('lastName'),
    err: document.getElementById('lastNameError'),
    check: v => !v ? 'Įveskite pavardę.' : !/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]+$/.test(v) ? 'Pavardę gali sudaryti tik raidės.' : ''
  },
  email: {
    el: document.getElementById('email'),
    err: document.getElementById('emailError'),
    check: v => !v ? 'Įveskite el. paštą.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Neteisingas el. pašto formatas.' : ''
  },
  phone: {
    el: document.getElementById('phone'),
    err: document.getElementById('phoneError'),
    check: v => !/^\+370 6\d{2} \d{5}$/.test(v) ? 'Formatas turi būti +370 6xx xxxxx.' : ''
  },
  address: {
    el: document.getElementById('address'),
    err: document.getElementById('addressError'),
    check: v => !v ? 'Įveskite adresą.' : ''
  }
};

const phoneEl = document.getElementById('phone');
const phonePrefix = '+370 ';

if (phoneEl) {
  phoneEl.addEventListener('input', () => {
    if (!phoneEl.value.startsWith(phonePrefix)) {
      phoneEl.value = phonePrefix;
    }

    const digits = phoneEl.value.slice(phonePrefix.length).replace(/\D/g, '').slice(0, 8);

    phoneEl.value = digits.length > 3 
      ? `${phonePrefix}${digits.slice(0, 3)} ${digits.slice(3)}` 
      : `${phonePrefix}${digits}`;
  });

  phoneEl.addEventListener('click', () => {
    if (phoneEl.selectionStart < phonePrefix.length) {
      phoneEl.setSelectionRange(phonePrefix.length, phonePrefix.length);
    }
  });
}

function updateSubmitState() {
  const r = [1, 2, 3].map(i => Number(document.getElementById(`rating${i}`).value));
  const ratingsOk = r.every(n => n >= 1 && n <= 10);
  const inputsOk = Object.values(fields).every(f => f.check(f.el.value.trim()) === '');
  submitBtn.disabled = !(inputsOk && ratingsOk);
}

if (contactForm && resultsBox) {
  Object.values(fields).forEach(f => {
    f.el.addEventListener('input', () => {
      const msg = f.check(f.el.value.trim());
      f.el.classList.toggle('is-invalid', Boolean(msg));
      if (f.err) f.err.textContent = msg;
      updateSubmitState();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      contactForm.reset();

      document.getElementById('rating1Val').textContent = '8';
      document.getElementById('rating2Val').textContent = '9';
      document.getElementById('rating3Val').textContent = '10';

      Object.values(fields).forEach(f => {
        f.el.classList.remove('is-invalid');
        if (f.err) f.err.textContent = '';
      });

      resultsBox.innerHTML = '';
      resultsBox.style.display = 'none';
      submitBtn.disabled = true;
    });
  }

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

    const averageRating = ((formData.klausimas1 + formData.klausimas2 + formData.klausimas3) / 3).toFixed(1);

    formData.vidurkis = Number(averageRating);

    console.log(formData);
    console.log(`${formData.vardas} ${formData.pavarde}: ${averageRating}`);

    resultsBox.innerHTML = `
      <p><strong>Vardas:</strong> ${formData.vardas}</p>
      <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
      <p><strong>El. paštas:</strong> <a href="mailto:${formData.elPastas}">${formData.elPastas}</a></p>
      <p><strong>Tel. Numeris:</strong> ${formData.telNumeris}</p>
      <p><strong>Adresas:</strong> ${formData.adresas}</p>
      <p><strong>1 klausimas (Dizainas):</strong> ${formData.klausimas1}</p>
      <p><strong>2 klausimas (Projektai):</strong> ${formData.klausimas2}</p>
      <p><strong>3 klausimas (Rekomendacija):</strong> ${formData.klausimas3}</p>
      <hr>
      <p><strong>${formData.vardas} ${formData.pavarde}:</strong> ${averageRating}</p>
    `;

    resultsBox.style.display = 'block';
  });
}

const STORAGE_KEY = 'competence_skills_data';

const defaultSkillsData = [
  { id: 1, title: 'FPGA ir VHDL programavimas', status: 'Planuojama', xp: 60, icon: 'bi-cpu' },
  { id: 2, title: 'RF grandinių projektavimas', status: 'Planuojama', xp: 50, icon: 'bi-broadcast' },
  { id: 3, title: 'STM32 mikrovaldikliai (C/C++)', status: 'Mokomasi', xp: 50, icon: 'bi-motherboard' },
  { id: 4, title: 'HTML, CSS ir JavaScript', status: 'Mokomasi', xp: 40, icon: 'bi-code-slash' },
  { id: 5, title: 'MATLAB signalų apdorojimas', status: 'Mokomasi', xp: 40, icon: 'bi-graph-up' },
  { id: 6, title: 'KiCad PCB plokščių dizainas', status: 'Atlikta', xp: 60, icon: 'bi-layers' },
  { id: 7, title: 'SMD litavimas ir osciloskopija', status: 'Atlikta', xp: 50, icon: 'bi-tools' }
];

function loadSkillsData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [...defaultSkillsData];
    }
  }
  return [...defaultSkillsData];
}

function saveSkillsData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skillsData));
}

let skillsData = loadSkillsData();

const boardContainers = {
  'Planuojama': document.getElementById('cards-planned'),
  'Mokomasi': document.getElementById('cards-learning'),
  'Atlikta': document.getElementById('cards-done')
};

function renderSkillCards() {
  Object.values(boardContainers).forEach(col => col.innerHTML = '');

  skillsData.forEach(skill => {
    const targetColumn = boardContainers[skill.status];
    if (targetColumn) {
      targetColumn.innerHTML += `
        <div class="skill-card">
          <div class="skill-icon">
            <i class="bi ${skill.icon}"></i>
          </div>
          <div class="skill-info">
            <h4>${skill.title}</h4>
            <div class="skill-meta">
              <select class="status-select" data-id="${skill.id}">
                <option value="Planuojama" ${skill.status === 'Planuojama' ? 'selected' : ''}>Planuojama</option>
                <option value="Mokomasi" ${skill.status === 'Mokomasi' ? 'selected' : ''}>Mokomasi</option>
                <option value="Atlikta" ${skill.status === 'Atlikta' ? 'selected' : ''}>Atlikta</option>
              </select>
              <span class="badge-xp">XP: ${skill.xp}</span>
            </div>
          </div>
        </div>
      `;
    }
  });
}

function updateProgressInfo() {
  const doneSkills = skillsData.filter(s => s.status === 'Atlikta');
  const earnedXP = doneSkills.reduce((sum, s) => sum + s.xp, 0);

  let level = 1;
  let rank = 'Pradedantysis';
  let progressPercent = Math.round((earnedXP / 50) * 100);

  if (earnedXP >= 300) {
    level = 4;
    rank = 'Profesionalas';
    progressPercent = 100;
  } else if (earnedXP >= 150) {
    level = 3;
    rank = 'Specialistas';
    progressPercent = Math.round(((earnedXP - 150) / 150) * 100);
  } else if (earnedXP >= 50) {
    level = 2;
    rank = 'Praktikantas';
    progressPercent = Math.round(((earnedXP - 50) / 100) * 100);
  }

  document.getElementById('total-xp').textContent = `${earnedXP} XP`;
  document.getElementById('current-level').textContent = level;
  document.getElementById('current-rank').textContent = rank;
  document.getElementById('level-progress-bar').style.width = `${progressPercent}%`;
  document.getElementById('level-progress-text').textContent = `${progressPercent}%`;
}

function updateSummaryStats() {
  const totalSkills = skillsData.length;
  const doneCount = skillsData.filter(s => s.status === 'Atlikta').length;
  const percent = Math.round((doneCount / totalSkills) * 100);

  document.getElementById('skills-total').textContent = totalSkills;
  document.getElementById('skills-done').textContent = doneCount;
  document.getElementById('skills-percent').textContent = `${percent}%`;
}

function handleStatusChange(skillId, newStatus) {
  const skill = skillsData.find(s => s.id === skillId);
  if (skill) {
    skill.status = newStatus;
    saveSkillsData();
    initCompetenceModule();
  }
}

function initCompetenceModule() {
  if (!boardContainers['Planuojama'] || !boardContainers['Mokomasi'] || !boardContainers['Atlikta']) return;

  renderSkillCards();
  updateProgressInfo();
  updateSummaryStats();

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', function () {
      handleStatusChange(Number(this.dataset.id), this.value);
    });
  });
}

initCompetenceModule();