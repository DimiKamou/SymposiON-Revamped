/* ════════════════════════════════════════════════════════════════════
   SymposiON · syn-assignments.js
   Admin-assigned TEMPLATE tiles. An admin assigns a Trivia or Istoria/History
   template to a specific CLASS + SUBJECT (admin-synthesis.js → Πρότυπα →
   «Ανάθεση σε τάξη/μάθημα»); the assignment is stored in SymStore
   ('template_assignments') + mirrored to Firestore config/templateAssignments.

   window.synAssignedTiles(classId, subjectId) returns the extra game-tile
   objects for that class+subject, which renderSubjectBlocks (screens-learn.js)
   merges into the subject's grid — so they render exactly like the hardcoded
   voyage (Ἰλιάδα/Ἑλένη) tiles and launch through the normal path.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function _all() {
    var a = (window.SymStore && SymStore.get('template_assignments', [])) || [];
    return Array.isArray(a) ? a : [];
  }

  // Build the plain game-tile object (the data.js g() shape) for one assignment.
  // launch.args flow to the opener (gameTile now forwards them); MVP openers:
  //   trivia  → openTriviaPanel(subjectPreset)   (panel.js; generic fallback if no preset)
  //   history → openIstoria(course)              (trivia-iframe-launchers.js; ?course=)
  function _tile(a) {
    var launch;
    if (a.type === 'history') {
      launch = { fn: 'openIstoria', args: [a.course || 'g3'] };
    } else {
      launch = { fn: 'openTriviaPanel', args: [a.preset || a.subjectId || 'iliada'] };
    }
    return {
      gr: (a.label && a.label.gr) || a.label || 'Πρότυπο',
      en: (a.label && a.label.en) || (a.label && a.label.gr) || 'Template',
      meta: a.meta || (a.type === 'history' ? 'Ιστορία' : 'Trivia'),
      illu: a.illu || (a.type === 'history' ? 'scroll' : 'amphora'),
      launch: launch,
    };
  }

  window.synAssignedTiles = function (classId, subjectId) {
    if (!classId || !subjectId) return [];
    return _all()
      .filter(function (a) { return a && a.classId === classId && a.subjectId === subjectId; })
      .map(_tile);
  };
})();
