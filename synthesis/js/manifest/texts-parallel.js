/* texts-parallel.js — manifest fragment for the "Κείμενα · Μεταφράσεις"
   (Παράλληλο Κείμενο) game mode. openParallelLesson is defined eagerly in
   theory-parallel.js; synLaunch still needs a SYN_GAMES entry (empty deps →
   it just calls the opener) + tile-name aliases so a subject tile resolves. */
(function () {
  window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
    openParallelLesson: { js: [], css: [], overlay: null, eager: false, fb: false },
  });
  window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
    'Κείμενα · Μεταφράσεις': 'openParallelLesson',
    'Κείμενα - Μεταφράσεις': 'openParallelLesson',
    'Texts · Translations': 'openParallelLesson',
    'Texts - Translations': 'openParallelLesson',
  });
})();
