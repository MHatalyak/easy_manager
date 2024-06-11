var html = document.getElementsByTagName('html');
var themeSlider = document.getElementById('themeSlider');
var lightThemeRadio = document.getElementById('light-theme');
var darkThemeRadio = document.getElementById('dark-theme');

function setThemeByRadio() {
  var selectedTheme = lightThemeRadio.checked ? 'light-theme' : 'dark-theme';
  setTheme(selectedTheme);
}


function setThemeBySlider() {
  var sliderValue = parseInt(themeSlider.value);
  var selectedTheme = sliderValue < 50 ? 'light-theme' : 'dark-theme';

  if (html[0].classList.contains(selectedTheme)) {
    return;
  }
}


function setTheme(themeName) {
  html[0].classList.remove('light-theme', 'dark-theme');
  html[0].classList.add(themeName);
  localStorage.setItem('selectedTheme', themeName);
  if (lightThemeRadio || darkThemeRadio) {
    lightThemeRadio.checked = themeName === 'light-theme';
    darkThemeRadio.checked = themeName === 'dark-theme';
  }
}


var selectedTheme = localStorage.getItem('selectedTheme');
if (selectedTheme) {
  setTheme(selectedTheme);
} else {
  setThemeBySlider();
}


lightThemeRadio.addEventListener('change', setThemeByRadio);
darkThemeRadio.addEventListener('change', setThemeByRadio);

themeSlider.addEventListener('input', setThemeBySlider);

