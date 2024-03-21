const idiomas = ['es', 'en', 'de', 'fr', 'ar', 'el', 'ja', 'zh', 'hi'];
const idiomaEnSS = sessionStorage.getItem('idioma') || 'es';

const pfecha = document.getElementById('fecha'),
idiomaSelect = document.getElementById('idioma-select');

DateTime = luxon.DateTime;
const fecha = DateTime.now();


idiomas.forEach((idioma) => {
  const opcion = crearElementoHTML({ tag: 'option', text: idioma, value: idioma });
  idioma == idiomaEnSS && (opcion.defaultSelected = true);
  idiomaSelect.append(opcion);
});

pfecha.innerText = fecha.setLocale(idiomaEnSS).toLocaleString(DateTime.DATE_MED);

idiomaSelect.addEventListener('change', () => {
  pfecha.innerText = fecha.setLocale(idiomaSelect.value).toLocaleString(DateTime.DATE_MED);
  sessionStorage.setItem('idioma', idiomaSelect.value);
});