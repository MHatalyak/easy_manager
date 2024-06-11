var html = document.getElementsByTagName('html')[0];
var langSlider = document.getElementById('langSlider');
var enRadio = document.getElementById('lang-en');
var ukRadio = document.getElementById('lang-uk');

function setLangByRadio() {
  var selectedLang = enRadio.checked ? 'lang-en' : 'lang-uk';
  setLang(selectedLang);
  updateSlider();
}

function setLangBySlider() {
  var sliderValue = parseInt(langSlider.value);
  var selectedLang = sliderValue < 50 ? 'lang-en' : 'lang-uk';
  setLang(selectedLang);
}

function setLang(langName) {
  html.classList.remove('lang-en', 'lang-uk');
  html.classList.add(langName);
  localStorage.setItem('selectedLang', langName);
  if (enRadio || ukRadio) {
    enRadio.checked = langName === 'lang-en';
    ukRadio.checked = langName === 'lang-uk';
  }
  updateSlider();
}

function updateSlider() {
  var selectedLang = localStorage.getItem('selectedLang');
  if (selectedLang) {
    langSlider.value = selectedLang === 'lang-en' ? 0 : 100;
  }
}

var selectedLang = localStorage.getItem('selectedLang');
if (selectedLang) {
  setLang(selectedLang);
} else {
  setLangBySlider();
}

enRadio.addEventListener('change', setLangByRadio);
ukRadio.addEventListener('change', setLangByRadio);

langSlider.addEventListener('input', setLangBySlider);
langSlider.addEventListener('change', function () {
  var sliderValue = parseInt(langSlider.value);
  var selectedLang = sliderValue < 50 ? 'lang-en' : 'lang-uk';
  setLang(selectedLang);
});
