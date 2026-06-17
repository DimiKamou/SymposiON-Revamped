/* ============================================================
   SymposiON · admin-atlas.js  —  Command Atlas overlay
   Gated: isAdmin === true only.
   ============================================================ */

/* ── Feature catalog ──────────────────────────────────────────
   ATLAS_GROUPS  → top-level domains. `emergency` is rendered first
                   and styled high-visibility (accent:'danger').
   ATLAS_FEATURES→ each entry carries:
     g      domain id (matches an ATLAS_GROUPS id)
     path   hierarchical breadcrumb, e.g. 'Συνδρομές › Kill Switch'
     tab    admin tab to switch to (adminSwitchTab) — null = backend-only
     init   optional window fn that builds the sub-panel DOM
     anchor section element to reveal
     focus  optional selector of the exact control to focus; when
            omitted, atlasNavigate focuses the first field in `anchor`
   ────────────────────────────────────────────────────────────── */
const ATLAS_GROUPS = [
  { id:'emergency',  icon:'🚨', label:'System Emergency',   accent:'danger' },
  { id:'users',      icon:'👥', label:'Χρήστες & Πρόσβαση'                  },
  { id:'curriculum', icon:'📚', label:'Πρόγραμμα Σπουδών'                   },
  { id:'subs',       icon:'📐', label:'Συνδρομές & Tiers'                   },
  { id:'system',     icon:'⚙',  label:'Σύστημα & Backend'                   },
];

const ATLAS_FEATURES = [
  /* ══ System Emergency — υψηλή προτεραιότητα ══
     NB: το Kill Switch ΔΕΝ είναι εδώ — ζει στη μόνιμη "Global Emergency"
     μπάρα πάνω από τα tabs (emOpenModal). */
  { g:'emergency', path:'Tiers › Καθολική Πρόσβαση', tab:'tiers', anchor:'tr-wildcard-section', init:'_trInitPanel',
    focus:'#tr-wildcard-checkbox',
    icon:'🃏', name:'Καθολική Πρόσβαση (Wildcard)', tag:'danger',
    desc:'Global override — ξεκλειδώνει ΟΛΑ τα modules. Χρήση με προσοχή.',
    fn:'_trSaveWildcard()',        bdg:'wildcard' },

  /* ══ Χρήστες & Πρόσβαση ══ */
  { g:'users', path:'Γενικά › Χορήγηση Πρόσβασης', tab:'general', anchor:'admin-grant-form', init:null,
    icon:'🔑', name:'Χορήγηση Πρόσβασης',     tag:'action',
    desc:'Δωρεάν πρόσβαση σε χρήστη — ρόλος, διάρκεια 1–120 μήνες, τάξη.',
    fn:'adminGrantAccess()' },
  { g:'users', path:'Γενικά › Χορήγηση XP / Δραχμών', tab:'general', anchor:'admin-prog-form', init:null,
    icon:'⚔',  name:'Χορήγηση XP / Δραχμών', tag:'action',
    desc:'Πρόσθεσε XP & Δραχμές στην πρόοδο χρήστη — υπολογίζει νέο level.',
    fn:'adminGrantProgression()' },
  { g:'users', path:'Γενικά › Μαζική Χορήγηση', tab:'general', anchor:'admin-mass-grant-form', init:null,
    icon:'⚡', name:'Μαζική Χορήγηση',         tag:'action',
    desc:'Bulk grant με λίστα ή import Excel/CSV — preview & ανά-γραμμή κατάσταση.',
    fn:'adminExecuteMassGrant()' },
  { g:'users', path:'Συνδρομές › Σύνδεση Τάξης', tab:'subscriptions', anchor:'sp-sec-classroom', init:'spInitPanel',
    icon:'🔗', name:'Σύνδεση Τάξης',             tag:'action',
    desc:'Σύνδεση καθηγητή — τύπος συνδρομής, λήξη, τάξεις, feature flags.',
    fn:'adminBindClassroom()' },

  /* ══ Πρόγραμμα Σπουδών ══ */
  { g:'curriculum', path:'Πρόγραμμα › Πλάνο ανά Τάξη', tab:'curriculum', anchor:'cp-class-tabs', init:'_cpInitPanel',
    icon:'🏗',  name:'Πλάνο ανά Τάξη',           tag:'config',
    desc:'6 τάξεις (Α–Γ Γυμν., Α–Γ Λυκ.) — ανάθεση datasets & game engines.',
    fn:'_cpSelectClass()' },
  { g:'curriculum', path:'Πρόγραμμα › Ανάθεση Datasets', tab:'curriculum', anchor:'cp-datasets-grid', init:'_cpInitPanel',
    icon:'📦',  name:'Ανάθεση Datasets',          tag:'config',
    desc:'Toggle datasets γραμματικής ανά κατηγορία.',
    fn:'_cpToggleDataset()' },
  { g:'curriculum', path:'Πρόγραμμα › Επίπεδα Γραμματικής', tab:'curriculum', anchor:'cp-datasets-grid', init:'_cpInitPanel',
    icon:'🎚',  name:'Επίπεδα Γραμματικής',       tag:'config',
    desc:'Δυναμικός χάρτης επιπέδων — εντοπίζει αυτόματα κάθε παιχνίδι γραμματικής (Λύω, Συνηρημένα, Αόριστος Β΄, …) με level config.',
    fn:'_generateLevelConfigUI()' },
  { g:'curriculum', path:'Πρόγραμμα › Εναλλαγές Παιχνιδιών', tab:'curriculum', anchor:'cp-engines-inner', init:'_cpInitPanel',
    icon:'🎮',  name:'Εναλλαγές Παιχνιδιών',      tag:'config',
    desc:'Ενεργοποίηση παιχνιδιών ανά τάξη, σήμανση PvP.',
    fn:'_cpToggleEngine()' },
  { g:'curriculum', path:'Συνδρομές › Περιεχόμενο ανά Τάξη', tab:'subscriptions', anchor:'sp-sec-ccm', init:'spInitPanel',
    icon:'◉',  name:'Περιεχόμενο ανά Τάξη',    tag:'config',
    desc:'On/off datasets ανά τάξη με αναζήτηση, κατηγορίες & αντιγραφή config.',
    fn:'spCCMSave()' },

  /* ══ Συνδρομές & Tiers ══ */
  { g:'subs', path:'Γενικά › Τιμές Συνδρομών', tab:'general', anchor:'admin-pricing-form', init:null,
    icon:'💶', name:'Τιμές Συνδρομών',         tag:'config',
    desc:'Τιμές Μαθητή/Καθηγητή ανά 1/3/6/12 μήνες + custom πλάνα.',
    fn:'adminSavePricing()' },
  { g:'subs', path:'Γενικά › Έλεγχος Πρόσβασης', tab:'general', anchor:'admin-access-form', init:null,
    icon:'🔒', name:'Έλεγχος Πρόσβασης',       tag:'config',
    desc:'Tier πρόσβασης για 9 τάξεις & κάθε dataset στο Games Panel.',
    fn:'adminSaveAccess()' },
  { g:'subs', path:'Γενικά › Εκπτωτικοί Κωδικοί', tab:'general', anchor:'admin-code-form', init:null,
    icon:'🏷️', name:'Εκπτωτικοί Κωδικοί',     tag:'action',
    desc:'Δημιουργία, auto-gen, στατιστικά χρήσης & απενεργοποίηση κουπονιών.',
    fn:'adminCreateCode()',        bdg:'coupons' },
  { g:'subs', path:'Συνδρομές › Πίνακας Tier', tab:'subscriptions', anchor:'sp-sec-tier', init:'spInitPanel',
    icon:'⬡',  name:'Πίνακας Tier',             tag:'config',
    desc:'Δυναμικοί κανόνες tier (προσθήκη/διαγραφή) + payment gateway.',
    fn:'spSaveTierMatrix()' },
  { g:'subs', path:'Συνδρομές › Δημιουργός Πακέτων', tab:'subscriptions', anchor:'sp-sec-bundle', init:'spInitPanel',
    icon:'🎁', name:'Δημιουργός Πακέτων',        tag:'action',
    desc:'Επαναχρησιμοποιήσιμα πακέτα τάξεων για ανάθεση σε Tiers.',
    fn:'spShowBundleModal()' },
  { g:'subs', path:'Συνδρομές › Παρακολούθηση Θέσεων', tab:'subscriptions', anchor:'sp-sec-seats', init:'spInitPanel',
    icon:'🪑', name:'Παρακολούθηση Θέσεων',      tag:'monitor',
    desc:'Χρήση θέσεων B2B/σχολικών συνδρομών.',
    fn:'spLoadSeats()',            bdg:'seats' },
  { g:'subs', path:'Συνδρομές › Προσομοίωση Πρόσβασης', tab:'subscriptions', anchor:'sp-sec-sim', init:'spInitPanel',
    icon:'▶',  name:'Προσομοίωση Πρόσβασης',    tag:'monitor',
    desc:'Simulation tier & τάξης — εφαρμόζει αμέσως χωρίς αλλαγή δεδομένων.',
    fn:'spToggleSimulation()' },
  { g:'subs', path:'Συνδρομές › Διαχειριστής Assets', tab:'subscriptions', anchor:'sp-sec-dasm', init:'spInitPanel',
    icon:'◈',  name:'Διαχειριστής Assets',       tag:'config',
    desc:'Ανέβασμα & styling assets ανά entity/target.',
    fn:'spDASMSave()' },
  { g:'subs', path:'Tiers › ανά Dataset', tab:'tiers', anchor:'tr-ds-section', init:'_trInitPanel',
    icon:'📦', name:'Tiers ανά Dataset',          tag:'config',
    desc:'Free / Student / Teacher tier για κάθε dataset — ισχύει άμεσα.',
    fn:'_trSetTier()' },
  { g:'subs', path:'Tiers › ανά Παιχνίδι', tab:'tiers', anchor:'tr-eng-section', init:'_trInitPanel',
    icon:'🎮', name:'Tiers ανά Παιχνίδι',         tag:'config',
    desc:'Το απαιτούμενο tier για κάθε game engine.',
    fn:'_trSave()' },

  /* ══ Σύστημα & Backend ══ */
  { g:'system', path:'Γενικά › Στατιστικά Πίνακα', tab:'general', anchor:'admin-stats-row', init:null,
    icon:'📊', name:'Στατιστικά Πίνακα',      tag:'monitor',
    desc:'Σύνολο χρηστών, Pro users, ενεργοί κωδικοί, χρήσεις & ενεργά banners.',
    fn:'_adminLoadStats()',        bdg:'coupons' },
  { g:'system', path:'Γενικά › Ανακοινώσεις', tab:'general', anchor:'admin-banner-form', init:null,
    icon:'📢', name:'Ανακοινώσεις',             tag:'action',
    desc:'Banner GR/EN — τύπος info/promo/warning, λήξη & CTA.',
    fn:'adminCreateBanner()',      bdg:'banners' },
  { g:'system', path:'Γενικά › Περιεχόμενο Σελίδων', tab:'general', anchor:'admin-pages-form', init:null,
    icon:'📝', name:'Περιεχόμενο Σελίδων',     tag:'config',
    desc:'Κείμενα GR/EN για Σχετικά, Επικοινωνία & εισαγωγή Σχολίων.',
    fn:'adminSavePageContent()' },
  { g:'system', path:'Γενικά › Σχόλια Χρηστών', tab:'general', anchor:'admin-feedback-card', init:null,
    icon:'💬', name:'Σχόλια Χρηστών',           tag:'monitor',
    desc:'Τελευταία 30 μηνύματα χρηστών από τη φόρμα επικοινωνίας.',
    fn:'_adminLoadFeedback()',     bdg:'feedback' },
  { g:'system', path:'Assets › Ανεβαστής Εικονιδίων', tab:'assets', anchor:'admin-asset-studio-content', init:'_adminRenderAssetStudio',
    icon:'🖼', name:'Ανεβαστής Εικονιδίων',       tag:'action',
    desc:'Ανέβασμα & διαχείριση εικονιδίων/illustrations.',
    fn:'_adminRenderAssetStudio()' },
  { g:'system', path:'Assets › Γκαλερί Αποθηκευμένων', tab:'assets', anchor:'admin-asset-studio-content', init:'_adminRenderAssetStudio',
    icon:'🗂', name:'Γκαλερί Αποθηκευμένων',      tag:'monitor',
    desc:'Προβολή & διαχείριση αποθηκευμένων assets.',
    fn:'_assetLoadStoredIcons()' },
  { g:'system', path:'Backend › Ολοκλήρωση Αγοράς', tab:null, anchor:null, init:null,
    icon:'💳', name:'Ολοκλήρωση Αγοράς',          tag:'action',
    desc:'Cloud Function — checkout session με δυναμικές τιμές από /config/pricing.',
    fn:'functions/index.js' },
  { g:'system', path:'Backend › Webhook Πληρωμής', tab:null, anchor:null, init:null,
    icon:'🧵', name:'Webhook Πληρωμής',            tag:'monitor',
    desc:'Επιβεβαίωση πληρωμής & ενεργοποίηση συνδρομής στο users/{uid}.',
    fn:'functions/index.js' },
  { g:'system', path:'Backend › adminGrantAccess', tab:null, anchor:null, init:null,
    icon:'🛡', name:'adminGrantAccess',            tag:'action',
    desc:'Server-side grant — επαληθεύει ADMIN_EMAIL, βρίσκει χρήστη, γράφει ρόλο.',
    fn:'functions/index.js' },
  { g:'system', path:'Backend › Καθαρισμός Sessions', tab:null, anchor:null, init:null,
    icon:'🧹', name:'Καθαρισμός Sessions',         tag:'monitor',
    desc:'Καθαρισμός ληγμένων live-arena sessions (cutoff 3 ώρες).',
    fn:'functions/index.js' },
];

const TAG_LABEL = {
  action:  'Ενέργεια',
  config:  'Ρύθμιση',
  monitor: 'Παρακολούθηση',
  danger:  'Κρίσιμο'
};

/* Steps guide shown in detail panel — keyed by feature fn */
var ATLAS_STEPS = {
  '_adminLoadStats()':        ['Τα στατιστικά φορτώνουν αυτόματα.', 'Δες χρήστες, Pro accounts, κωδικούς & banners σε πραγματικό χρόνο.', 'Πάτα "Ανανέωση" αν τα νούμερα φαίνονται παλιά.'],
  'adminGrantAccess()':       ['Εισήγαγε το email του χρήστη.', 'Επίλεξε ρόλο: Μαθητής ή Καθηγητής.', 'Επίλεξε διάρκεια σε μήνες (1–120).', 'Προαιρετικά: επίλεξε συγκεκριμένη τάξη.', 'Πάτα "Χορήγηση" — ισχύει άμεσα.'],
  'adminGrantProgression()':  ['Εισήγαγε το email του χρήστη.', 'Συμπλήρωσε XP και/ή Δραχμές να προσθέσεις.', 'Το νέο Level υπολογίζεται αυτόματα.', 'Πάτα "Χορήγηση".'],
  'adminExecuteMassGrant()':  ['Επίλεξε μέθοδο: χειροκίνητη λίστα ή αρχείο Excel/CSV.', 'Επικόλλησε emails ή ανέβασε αρχείο.', 'Πάτα "Preview" — έλεγξε τη λίστα.', 'Επίλεξε ρόλο & διάρκεια.', 'Πάτα "Εκτέλεση" — βλέπεις status ανά γραμμή.'],
  'adminCreateCode()':        ['Πάτα "Auto-gen" ή γράψε κωδικό χειροκίνητα.', 'Ορίσε έκπτωση (%) και ημερομηνία λήξης.', 'Προαιρετικά: ορίσε μέγιστες χρήσεις.', 'Πάτα "Δημιουργία" — ο κωδικός εμφανίζεται στη λίστα.'],
  'adminSavePricing()':       ['Άλλαξε τις τιμές για Μαθητή ή Καθηγητή ανά διάρκεια.', 'Πρόσθεσε custom πλάνα με "Προσθήκη Πλάνου".', 'Πάτα "Αποθήκευση" — αλλαγές ισχύουν για νέες συνδρομές.'],
  'adminSaveAccess()':        ['Επίλεξε tier (Free / Student / Teacher) για κάθε από τις 9 τάξεις.', 'Πάτα "Αποθήκευση" — αλλαγές ισχύουν άμεσα για όλους.'],
  'adminCreateBanner()':      ['Συμπλήρωσε τίτλο GR (υποχρεωτικό) και EN.', 'Επίλεξε τύπο: Info / Promo / Warning.', 'Ορίσε ημερομηνία λήξης.', 'Προαιρετικά: πρόσθεσε CTA κουμπί με action.', 'Πάτα "Δημοσίευση".'],
  'adminSavePageContent()':   ['Επίλεξε σελίδα (Σχετικά, Επικοινωνία, κ.ά.).', 'Επεξεργάσου κείμενο GR και EN.', 'Πάτα "Αποθήκευση".'],
  '_adminLoadFeedback()':     ['Τα σχόλια φορτώνουν αυτόματα.', 'Διάβασε μηνύματα χρηστών από τελευταίο μήνα.', 'Αν υπάρχει urgent θέμα, επικοινώνησε απευθείας.'],
  'spCCMSave()':              ['Επίλεξε τάξη από το dropdown.', 'Ενεργοποίησε/απενεργοποίησε datasets για αυτή την τάξη.', 'Χρησιμοποίησε αναζήτηση για γρήγορη εύρεση.', 'Αντίγραψε config σε άλλη τάξη αν χρειάζεται.', 'Πάτα "Αποθήκευση".'],
  'spSaveTierMatrix()':       ['Επεξεργάσου τους κανόνες tier (free/student/teacher).', 'Ορίσε διάρκειες και τιμές ανά tier.', 'Ρύθμισε payment gateway αν χρειάζεται.', 'Πάτα "Save Tier Rules".'],
  'spShowBundleModal()':      ['Πάτα "+ Δημιουργία Πακέτου".', 'Ορίσε όνομα και επίλεξε τάξεις που περιλαμβάνονται.', 'Ανάθεσε το πακέτο σε ένα ή περισσότερα Tiers.', 'Αποθήκευσε — επαναχρησιμοποιείται αυτόματα.'],
  'spLoadSeats()':            ['Πάτα "Refresh" για νέα δεδομένα.', 'Βλέπεις χρήση θέσεων ανά σχολείο/B2B λογαριασμό.', 'Υψηλό ποσοστό (>90%) σημαίνει πρέπει να επεκταθεί η συνδρομή.'],
  'adminBindClassroom()':     ['Αναζήτησε τον καθηγητή με email.', 'Επίλεξε τύπο συνδρομής & ημερομηνία λήξης.', 'Τσέκαρε τις τάξεις που ξεκλειδώνονται για τον καθηγητή.', 'Ενεργοποίησε Feature Flags αν χρειάζεται (π.χ. Custom Quiz).', 'Πάτα "Save Classroom Settings".'],
  'spToggleSimulation()':     ['Επίλεξε tier και τάξη για simulation.', 'Πάτα "Run Simulation" — εφαρμόζεται μόνο για εσένα.', 'Δοκίμασε πώς βλέπουν οι χρήστες του tier αυτού.', 'Τερμάτισε simulation από τη μπάρα κάτω.'],
  'spDASMSave()':             ['Επίλεξε entity type (τάξη ή μάθημα).', 'Επίλεξε target element.', 'Ανέβασε assets ή άλλαξε χρώματα/styling.', 'Πάτα "Αποθήκευση".'],
  '_cpSelectClass()':         ['Επίλεξε τάξη από τις καρτέλες (Α–Γ Γυμν., Α–Γ Λυκ.).', 'Ενεργοποίησε/απενεργοποίησε datasets για αυτή την τάξη.', 'Αν το dataset έχει επίπεδα, επίλεξε ποια να είναι διαθέσιμα.', 'Πάτα "Αποθήκευση".'],
  '_cpToggleDataset()':       ['Ενεργοποίησε ή απενεργοποίησε κάθε dataset.', 'Τα enabled datasets εμφανίζονται στο Games Panel της τάξης.'],
  '_generateLevelConfigUI()': ['Ο χάρτης εντοπίζει αυτόματα κάθε παιχνίδι γραμματικής με επίπεδα (από το GP_DATASETS).', 'Δες τα επίπεδα κάθε παιχνιδιού ομαδοποιημένα σε χρωματιστά chips.', 'Πάτα "Διαμόρφωση ανά τάξη →" σε ένα παιχνίδι για να επιλέξεις επίπεδα ανά τάξη.', 'Νέα παιχνίδια εμφανίζονται αυτόματα — δεν χρειάζεται αλλαγή στο Atlas.'],
  '_cpToggleEngine()':        ['Ενεργοποίησε τα παιχνίδια (engines) που θες για αυτή την τάξη.', 'Τα PvP παιχνίδια σημειώνονται ξεχωριστά.', 'Πάτα "Αποθήκευση".'],
  '_trSaveWildcard()':        ['ΠΡΟΣΟΧΗ: ξεκλειδώνει ΟΛΑ τα modules για ΟΛΑ τα accounts.', 'Χρησιμοποίησε μόνο για testing ή demo.', 'Απενεργοποίησε ΑΜΕΣΩΣ μετά τη χρήση.'],
  '_trSetTier()':             ['Επίλεξε tier (Free/Student/Teacher) για κάθε dataset.', 'Τα Free datasets είναι ορατά σε όλους.', 'Πάτα "Αποθήκευση" — ισχύει άμεσα.'],
  '_trSave()':                ['Επίλεξε tier για κάθε game engine.', 'Πάτα "Αποθήκευση" — ισχύει άμεσα.'],
  '_adminRenderAssetStudio()':['Επίλεξε κατηγορία assets.', 'Ανέβασε νέα εικονίδια ή illustrations.', 'Διαχειρίσου υπάρχοντα assets.'],
  '_assetLoadStoredIcons()':  ['Δες όλα τα αποθηκευμένα assets.', 'Κάνε κλικ για preview ή διαχείριση.'],
};

/* Features with inline mini-controls in detail panel */
var ATLAS_INLINE = {
  '_trSaveWildcard()':        'wildcard',
  '_generateLevelConfigUI()': 'grammarlevels',
};

/* ── State ──────────────────────────────────────────────────── */
var _atlasOpen     = false;
var _atlasKbdIdx   = -1;
var _atlasToastTmr;
var _atlasInitDone = false;
var ATLAS_RECENT_KEY = 'sympo_admin_recent';

/* ── Helpers ────────────────────────────────────────────────── */
function _ag(id) { return document.getElementById(id); }

function _atlasEsc(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function _atlasHl(text, q) {
  if (!q) return _atlasEsc(text);
  var lo = text.toLowerCase(), qi = lo.indexOf(q);
  if (qi < 0) return _atlasEsc(text);
  return _atlasEsc(text.slice(0, qi)) +
    '<mark>' + _atlasEsc(text.slice(qi, qi + q.length)) + '</mark>' +
    _atlasEsc(text.slice(qi + q.length));
}

/* ── Inject HTML ────────────────────────────────────────────── */
function _atlasInjectHTML() {
  if (_ag('admin-atlas')) return;
  var el = document.createElement('div');
  el.id = 'admin-atlas';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  /* Using unicode escapes so the file stays pure-ASCII */
  var GR = {
    atlas:     'Command Atlas',
    subtitle:  'Κάθε εργαλείο διαχείρισης, σε έναν χάρτη.',
    filter:    'Φιλτράρισμα…',
    close:     'Κλείσιμο (Esc)',
    sections:  'Ενότητες',
    legend:    'Υπόμνημα',
    la:        'Ενέργεια — εκτελεί',
    lc:        'Ρύθμιση — αποθήκευση',
    lm:        'Παρακολούθηση — προβολή',
    ld:        'Κρίσιμο — προσοχή',
    admin:     'Συνδεδεμένος ως Admin',
    recent:    'Πρόσφατα',
    empty_t:   'Κανένα αποτέλεσμα',
    empty_s:   'Δοκίμασε άλλον όρο αναζήτησης.'
  };
  el.innerHTML =
    '<div class="atlas-top">' +
      '<div class="atlas-brand">' +
        '<svg class="atlas-sig" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="square" aria-hidden="true">' +
          '<line x1="22" y1="20" x2="78" y2="20"/><line x1="22" y1="20" x2="48" y2="50"/>' +
          '<line x1="48" y1="50" x2="22" y2="80"/><line x1="22" y1="80" x2="78" y2="80"/>' +
          '<g stroke="#D97B5C" stroke-width="2.8" fill="none">' +
            '<circle cx="64" cy="50" r="12" stroke-dasharray="62 12" stroke-dashoffset="-7" transform="rotate(-90 64 50)"/>' +
            '<line x1="64" y1="39" x2="64" y2="49"/>' +
          '</g>' +
        '</svg>' +
        '<div><div class="atlas-brand-nm">Symposi<b>ON</b></div>' +
        '<span class="atlas-brand-sub">COMMAND ATLAS</span></div>' +
      '</div>' +
      '<div class="atlas-title-block"><h1>' + GR.atlas + '</h1><p>' + GR.subtitle + '</p></div>' +
      '<div class="atlas-search">' +
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="9" r="6"/><line x1="13.5" y1="13.5" x2="17" y2="17"/></svg>' +
        '<input id="atlas-search-input" class="atlas-search-input" type="text" placeholder="' + GR.filter + '" autocomplete="off" spellcheck="false"/>' +
        '<span class="atlas-search-clr" id="atlas-search-clr" style="display:none">✕</span>' +
      '</div>' +
      '<button class="atlas-close" id="atlas-close-btn" title="' + GR.close + '">✕</button>' +
    '</div>' +
    '<div class="atlas-body">' +
      '<nav class="atlas-rail">' +
        '<div class="atlas-rail-lbl">' + GR.sections + '</div>' +
        '<div id="atlas-toc"></div>' +
        '<div class="atlas-legend">' +
          '<div class="atlas-legend-lbl">' + GR.legend + '</div>' +
          '<div class="atlas-legend-row"><span class="atlas-ld atlas-ld-action"></span>' + GR.la + '</div>' +
          '<div class="atlas-legend-row"><span class="atlas-ld atlas-ld-config"></span>' + GR.lc + '</div>' +
          '<div class="atlas-legend-row"><span class="atlas-ld atlas-ld-monitor"></span>' + GR.lm + '</div>' +
          '<div class="atlas-legend-row"><span class="atlas-ld atlas-ld-danger"></span>' + GR.ld + '</div>' +
        '</div>' +
        '<div class="atlas-rail-foot">' +
          '<div class="atlas-meander"></div>' +
          '<div class="atlas-who">' +
            '<span class="atlas-who-dot"></span>' +
            '<div><div class="atlas-who-name">' + GR.admin + '</div>' +
            '<div class="atlas-who-email" id="atlas-who-email">dimikamou@gmail.com</div></div>' +
          '</div>' +
        '</div>' +
      '</nav>' +
      '<main class="atlas-canvas" id="atlas-canvas">' +
        '<div class="atlas-recent" id="atlas-recent" style="display:none">' +
          '<div class="atlas-recent-hd">' +
            '<span>🕓</span>' +
            '<span class="atlas-recent-lbl">' + GR.recent + '</span>' +
            '<span class="atlas-recent-line"></span>' +
          '</div>' +
          '<div class="atlas-recent-chips" id="atlas-recent-chips"></div>' +
        '</div>' +
        '<div id="atlas-bands"></div>' +
        '<div class="atlas-detail" id="atlas-detail" style="display:none">' +
          '<button class="atlas-detail-back" id="atlas-detail-back">← Πίσω</button>' +
          '<div class="atlas-detail-crumb" id="atlas-detail-crumb"></div>' +
          '<div class="atlas-detail-hero">' +
            '<div class="atlas-detail-ico" id="atlas-detail-ico"></div>' +
            '<div>' +
              '<div class="atlas-detail-name" id="atlas-detail-name"></div>' +
              '<span class="atlas-detail-tag" id="atlas-detail-tag"></span>' +
            '</div>' +
          '</div>' +
          '<div class="atlas-detail-desc" id="atlas-detail-desc"></div>' +
          '<div class="atlas-detail-steps" id="atlas-detail-steps"></div>' +
          '<div class="atlas-detail-inline" id="atlas-detail-inline"></div>' +
          '<div class="atlas-detail-actions">' +
            '<button class="atlas-detail-nav" id="atlas-detail-nav">Μεταβαίνω στο εργαλείο →</button>' +
          '</div>' +
        '</div>' +
        '<div class="atlas-empty" id="atlas-empty" style="display:none">' +
          '<div class="atlas-empty-ico">🏺</div>' +
          '<div class="atlas-empty-tt">' + GR.empty_t + '</div>' +
          '<div class="atlas-empty-sub">' + GR.empty_s + '</div>' +
        '</div>' +
      '</main>' +
    '</div>' +
    '<div class="atlas-toast" id="atlas-toast">' +
      '<span class="atlas-toast-ic">◈</span>' +
      '<div class="atlas-toast-body" id="atlas-toast-body"></div>' +
    '</div>';
  el.style.display = 'none';
  // SYNTHESIS: the admin overlay host (#page-admin) sits at z-index 9600
  // (index.html). admin-atlas.css gives #admin-atlas z-index:400 — fine in
  // Ver1, but here it would render BEHIND the admin shell. Lift it above the
  // host via an inline style (the CSS file is shared/untouched).
  el.style.zIndex = '9700';
  document.body.appendChild(el);
}

/* ── Init ───────────────────────────────────────────────────── */
function initAtlas() {
  if (_atlasInitDone) return;
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  _atlasInitDone = true;
  _atlasInjectHTML();
  _atlasBindEvents();
}

/* ── Open / Close ───────────────────────────────────────────── */
function openAtlas() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  if (!_atlasInitDone) initAtlas();
  var el = _ag('admin-atlas');
  if (!el) return;
  el.style.display = '';
  requestAnimationFrame(function() { el.classList.add('atlas-in'); });
  _atlasOpen = true; _atlasKbdIdx = -1;
  _atlasRenderToc();
  _atlasRenderBands();
  _atlasRenderRecent();
  _atlasLoadBadges();
  var emailEl = _ag('atlas-who-email');
  if (emailEl && typeof currentUser !== 'undefined' && currentUser && currentUser.email) {
    emailEl.textContent = currentUser.email;
  }
  var si = _ag('atlas-search-input');
  if (si) { si.value = ''; si.focus(); }
  var clr = _ag('atlas-search-clr');
  if (clr) clr.style.display = 'none';
}

function closeAtlas() {
  var el = _ag('admin-atlas');
  if (!el) return;
  el.classList.remove('atlas-in');
  _atlasOpen = false;
  setTimeout(function() { if (!_atlasOpen) el.style.display = 'none'; }, 380);
}

/* ── Routing ──────────────────────────────────────────────────
   SYNTHESIS adaptation. Ver1 used a flat tab router (adminSwitchTab);
   synthesis hosts every tool inside the Command Center (admin-cc.js),
   navigated by domain + category (ccGoDom / ccGoCat). This table maps
   each ATLAS feature's legacy `tab` id onto the synthesis Command Center
   {domain, category} that renders the same tool, so the Atlas remains a
   working launcher over the new shell. Unknown tabs fall back to a toast. */
var ATLAS_CC_ROUTE = {
  general:       { dom: 'system', cat: 'stats'       },
  curriculum:    { dom: 'curriculum', cat: 'classplan' },
  subscriptions: { dom: 'subs',   cat: 'tiers'       },
  tiers:         { dom: 'subs',   cat: 'tiers'       },
  assets:        { dom: 'content', cat: 'pages'      },
};
// Per-feature finer routing where the coarse tab→domain map isn't precise
// enough (keyed by the feature anchor). Optional — coarse map is the default.
var ATLAS_CC_ANCHOR_ROUTE = {
  'admin-pricing-form':  { dom: 'subs',   cat: 'plans'  },
  'admin-code-form':     { dom: 'subs',   cat: 'coupons' },
  'admin-banner-form':   { dom: 'content', cat: 'banners' },
  'admin-pages-form':    { dom: 'content', cat: 'pages'  },
  'admin-feedback-card': { dom: 'support', cat: 'feedback' },
  'admin-stats-row':     { dom: 'system', cat: 'stats'  },
  'admin-grant-form':    { dom: 'users',  cat: 'access' },
  'admin-prog-form':     { dom: 'users',  cat: 'progression' },
  'admin-mass-grant-form':{ dom: 'users', cat: 'import' },
  'sp-sec-classroom':    { dom: 'users',  cat: 'access' },
  'tr-wildcard-section': { dom: 'subs',   cat: 'tiers'  },
  'tr-ds-section':       { dom: 'subs',   cat: 'tiers'  },
  'tr-eng-section':      { dom: 'subs',   cat: 'tiers'  },
  'cp-class-tabs':       { dom: 'curriculum', cat: 'classplan' },
  'cp-datasets-grid':    { dom: 'curriculum', cat: 'classplan' },
  'cp-engines-inner':    { dom: 'curriculum', cat: 'classplan' },
};

// Open the synthesis admin overlay + navigate to the Command Center
// domain/category that hosts the feature's tool. Returns true if routed.
function _atlasRouteCC(feature) {
  var route = (feature.anchor && ATLAS_CC_ANCHOR_ROUTE[feature.anchor]) ||
              ATLAS_CC_ROUTE[feature.tab];
  if (!route) return false;
  // Ensure the admin overlay is showing (Atlas can be opened over any screen).
  if (typeof window.goTo === 'function') { try { window.goTo('admin'); } catch (_e) {} }
  if (typeof window._renderAdminPage === 'function') { try { window._renderAdminPage(); } catch (_e) {} }
  if (typeof window.ccGoDom === 'function') { try { window.ccGoDom(route.dom); } catch (_e) {} }
  if (typeof window.ccGoCat === 'function') { try { window.ccGoCat(route.cat); } catch (_e) {} }
  return true;
}

function atlasNavigate(feature) {
  if (!feature.tab) { _atlasToast(feature); return; }
  closeAtlas();
  // 1 ▸ route into the synthesis Command Center (domain + category)
  var routed = _atlasRouteCC(feature);
  // legacy fallback: if a Ver1 tab router is ever present, use it too
  if (!routed && typeof adminSwitchTab === 'function') {
    adminSwitchTab(feature.tab, _ag('admin-tab-btn-' + feature.tab));
  }
  // 2 ▸ build / refresh the sub-panel DOM if it has an initializer
  if (feature.init && typeof window[feature.init] === 'function') {
    try { window[feature.init](); } catch (_e) {}
  }
  // 3 ▸ reveal and focus the precise sub-module / form
  requestAnimationFrame(function() {
    setTimeout(function() { _atlasFocusModule(feature); }, 160);
  });
}

/* Reveal the feature's section, then drop the cursor into its form.
   Falls back to the first interactive control when no `focus` is set. */
function _atlasFocusModule(feature) {
  if (!feature.anchor) return;
  var target = _ag(feature.anchor);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  target.classList.add('atlas-flash');
  setTimeout(function() { target.classList.remove('atlas-flash'); }, 1400);

  var focusEl = null;
  if (feature.focus) { try { focusEl = document.querySelector(feature.focus); } catch (_e) {} }
  if (!focusEl) {
    focusEl = target.querySelector(
      'input:not([type=hidden]):not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), button:not([disabled])'
    );
  }
  if (focusEl) {
    try { focusEl.focus({ preventScroll: true }); } catch (_e) { focusEl.focus(); }
    focusEl.classList.add('atlas-focus-ring');
    setTimeout(function() { focusEl.classList.remove('atlas-focus-ring'); }, 1600);
  }
}

/* ── TOC ────────────────────────────────────────────────────── */
function _atlasRenderToc() {
  var toc = _ag('atlas-toc');
  if (!toc) return;
  toc.innerHTML = ATLAS_GROUPS.map(function(g, i) {
    var n = ATLAS_FEATURES.filter(function(f) { return f.g === g.id; }).length;
    return '<button class="atlas-toc-btn' + (i === 0 ? ' on' : '') +
      (g.accent === 'danger' ? ' atlas-toc-danger' : '') + '" data-g="' + g.id + '">' +
      '<span class="atlas-toc-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="atlas-toc-ic">' + g.icon + '</span>' +
      '<span class="atlas-toc-tx"><span class="atlas-toc-lb">' + _atlasEsc(g.label) + '</span></span>' +
      '<span class="atlas-toc-ct">' + n + '</span>' +
      '</button>';
  }).join('');
  toc.querySelectorAll('.atlas-toc-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var band = _ag('atlas-band-' + btn.dataset.g);
      var canvas = _ag('atlas-canvas');
      if (band && canvas) canvas.scrollTo({ top: band.offsetTop - 8, behavior: 'smooth' });
    });
  });
}

/* ── Bands ──────────────────────────────────────────────────── */
function _atlasRenderBands() {
  var bandsEl = _ag('atlas-bands'), emptyEl = _ag('atlas-empty');
  var si = _ag('atlas-search-input'), clrEl = _ag('atlas-search-clr');
  if (!bandsEl) return;
  var q = si ? si.value.trim().toLowerCase() : '';
  if (clrEl) clrEl.style.display = q ? '' : 'none';
  var anyBand = false;
  var GR_tools = 'εργαλεία';
  bandsEl.innerHTML = ATLAS_GROUPS.map(function(g, gi) {
    var items = ATLAS_FEATURES.filter(function(f) {
      return f.g === g.id && (!q || (f.name + ' ' + f.desc + ' ' + f.fn).toLowerCase().includes(q));
    });
    if (!items.length) return '';
    anyBand = true;
    return '<section class="atlas-band' + (g.accent === 'danger' ? ' atlas-band-danger' : '') +
      '" id="atlas-band-' + g.id + '" data-g="' + g.id + '">' +
      '<div class="atlas-band-hd">' +
        '<span class="atlas-band-no">' + String(gi + 1).padStart(2, '0') + '</span>' +
        '<span class="atlas-band-ic">' + g.icon + '</span>' +
        '<div class="atlas-band-tt"><h2>' + _atlasEsc(g.label) + '</h2></div>' +
        '<div class="atlas-band-rule"></div>' +
        '<div class="atlas-band-ct">' + items.length + ' ' + GR_tools + '</div>' +
      '</div>' +
      '<div class="atlas-tiles">' +
        items.map(function(f) {
          var fi = ATLAS_FEATURES.indexOf(f);
          var bdgHtml = f._badge
            ? '<span class="atlas-badge ' + f._badge.type + '"><span class="bdot"></span>' + _atlasEsc(f._badge.text) + '</span>' : '';
          return '<div class="atlas-tile' + (f.tag === 'danger' ? ' danger' : '') + '" data-fi="' + fi + '" tabindex="0">' +
            '<div class="atlas-tile-top">' +
              '<div class="atlas-tile-ico">' + f.icon + '</div>' +
              '<div class="atlas-tile-badges">' + bdgHtml +
                '<span class="atlas-tile-tag ' + f.tag + '">' + _atlasEsc(TAG_LABEL[f.tag]) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="atlas-tile-name">' + _atlasHl(f.name, q) + '</div>' +
            '<div class="atlas-tile-desc">' + _atlasHl(f.desc, q) + '</div>' +
            '<div class="atlas-tile-foot"><span class="atlas-tile-fn">' + _atlasEsc(f.fn) + '</span><span class="atlas-tile-go">→</span></div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</section>';
  }).join('');
  if (emptyEl) emptyEl.style.display = anyBand ? 'none' : '';
  if (!q) _atlasRenderRecent();
  bandsEl.querySelectorAll('.atlas-tile').forEach(function(tile) {
    tile.addEventListener('click', function() { _atlasShowDetail(ATLAS_FEATURES[+tile.dataset.fi]); });
    tile.addEventListener('mouseenter', function() {
      _atlasKbdIdx = _atlasVisibleTiles().indexOf(tile);
      _atlasSetKbd(_atlasKbdIdx, false);
    });
  });
  _atlasKbdIdx = -1;
}

/* ── Tile activate ──────────────────────────────────────────── */
function _atlasTileActivate(f) {
  if (!f) return;
  _atlasToast(f);
  _atlasPushRecent(ATLAS_FEATURES.indexOf(f));
  atlasNavigate(f);
}

/* ── Recent ─────────────────────────────────────────────────── */
function _atlasGetRecent() {
  try { return JSON.parse(localStorage.getItem(ATLAS_RECENT_KEY)) || []; } catch(_e) { return []; }
}
function _atlasPushRecent(fi) {
  var r = _atlasGetRecent().filter(function(x) { return x !== fi; });
  r.unshift(fi); r = r.slice(0, 5);
  localStorage.setItem(ATLAS_RECENT_KEY, JSON.stringify(r));
}
function _atlasRenderRecent() {
  var r = _atlasGetRecent().filter(function(i) { return !!ATLAS_FEATURES[i]; });
  var wrap = _ag('atlas-recent'), chips = _ag('atlas-recent-chips');
  var si = _ag('atlas-search-input');
  if (!wrap || !chips) return;
  if (!r.length || (si && si.value.trim().length > 0)) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  chips.innerHTML = r.map(function(i) {
    var f = ATLAS_FEATURES[i];
    return '<div class="atlas-rchip" data-fi="' + i + '">' +
      '<span class="atlas-rchip-ic">' + f.icon + '</span>' +
      '<span><div class="atlas-rchip-name">' + _atlasEsc(f.name) + '</div></span>' +
    '</div>';
  }).join('');
  chips.querySelectorAll('.atlas-rchip').forEach(function(c) {
    c.addEventListener('click', function() { _atlasShowDetail(ATLAS_FEATURES[+c.dataset.fi]); });
  });
}

/* ── Live badges ────────────────────────────────────────────── */
async function _atlasLoadBadges() {
  if (typeof firebase === 'undefined') return;
  try {
    var db = firebase.firestore();
    var res = await Promise.all([
      db.collection('coupons').where('active','==',true).get(),
      db.collection('banners').where('active','==',true).get(),
      db.collection('config').doc('app').get(),
    ]);
    _atlasSetBadge('coupons', { text: res[0].size + ' ενεργοί', type:'info' });
    _atlasSetBadge('banners', { text: res[1].size + ' ενεργά',  type:'info' });
    var wc = res[2].exists && !!(res[2].data() || {}).wildcard_access;
    _atlasSetBadge('wildcard', wc
      ? { text:'Ενεργό', type:'alert' }
      : { text:'Ανενεργό', type:'info' });
    try {
      var cut = new Date(Date.now() - 86400000);
      var fb = await db.collection('feedback').where('createdAt','>=',firebase.firestore.Timestamp.fromDate(cut)).get();
      if (fb.size > 0) _atlasSetBadge('feedback', { text: fb.size + ' νέα', type:'alert' });
    } catch(_e) {}
    try {
      var ms = await db.collection('config').doc('maintenance').get();
      if (ms.exists) {
        var cnt = Object.values(ms.data() || {}).filter(function(v){ return v === true; }).length;
        if (cnt > 0) _atlasSetBadge('maintenance', { text: cnt + ' σε συντήρηση', type:'alert' });
      }
    } catch(_e) {}
  } catch(_e) {}
}

function _atlasSetBadge(bdgKey, badge) {
  ATLAS_FEATURES.forEach(function(f) { if (f.bdg === bdgKey) f._badge = badge; });
  document.querySelectorAll('[data-fi]').forEach(function(tile) {
    var f = ATLAS_FEATURES[+tile.dataset.fi];
    if (!f || f.bdg !== bdgKey) return;
    var bw = tile.querySelector('.atlas-tile-badges');
    if (!bw) return;
    var ex = bw.querySelector('.atlas-badge');
    var html = '<span class="atlas-badge ' + badge.type + '"><span class="bdot"></span>' + _atlasEsc(badge.text) + '</span>';
    if (ex) ex.outerHTML = html; else bw.insertAdjacentHTML('afterbegin', html);
  });
}

/* ── Detail panel ───────────────────────────────────────────── */
function _atlasShowDetail(f) {
  if (!f) return;
  _atlasPushRecent(ATLAS_FEATURES.indexOf(f));

  var g = ATLAS_GROUPS.find(function(x) { return x.id === f.g; }) || {};

  // Populate breadcrumb from the feature's hierarchical path
  var crumb = _ag('atlas-detail-crumb');
  if (crumb) {
    var segs = String(f.path || ((g.label || '') + ' › ' + f.name))
      .split('›').map(function(s) { return s.trim(); }).filter(Boolean);
    var html = '<span class="adc-root">Admin</span>';
    segs.forEach(function(s, i) {
      var cls = (i === segs.length - 1) ? 'adc-current' : 'adc-section';
      html += '<span class="adc-sep"> › </span>' +
              '<span class="' + cls + '">' + _atlasEsc(s) + '</span>';
    });
    crumb.innerHTML = html;
  }

  // Hero
  var icoEl  = _ag('atlas-detail-ico');
  var nameEl = _ag('atlas-detail-name');
  var tagEl  = _ag('atlas-detail-tag');
  if (icoEl)  icoEl.textContent  = f.icon;
  if (nameEl) nameEl.textContent = f.name;
  if (tagEl)  { tagEl.textContent = TAG_LABEL[f.tag] || f.tag; tagEl.className = 'atlas-detail-tag ' + f.tag; }

  // Description
  var descEl = _ag('atlas-detail-desc');
  if (descEl) descEl.textContent = f.desc;

  // Steps
  var stepsEl = _ag('atlas-detail-steps');
  if (stepsEl) {
    var steps = ATLAS_STEPS[f.fn] || [];
    if (steps.length) {
      stepsEl.innerHTML =
        '<div class="ads-title">Βήματα χρήσης</div>' +
        '<ol class="ads-list">' +
        steps.map(function(s) { return '<li>' + _atlasEsc(s) + '</li>'; }).join('') +
        '</ol>';
    } else {
      stepsEl.innerHTML = '';
    }
  }

  // Inline controls
  var inlineEl = _ag('atlas-detail-inline');
  if (inlineEl) {
    inlineEl.innerHTML = '';
    var inlineType = ATLAS_INLINE[f.fn];
    if (inlineType === 'wildcard') _atlasRenderWildcard(inlineEl);
    else if (inlineType === 'grammarlevels') _generateLevelConfigUI(inlineEl);
  }

  // Navigate button
  var navBtn = _ag('atlas-detail-nav');
  if (navBtn) {
    navBtn.onclick = function() { _atlasTileActivate(f); };
    navBtn.style.display = f.tab ? '' : 'none';
  }

  // Switch canvas view
  var bandsEl  = _ag('atlas-bands');
  var recentEl = _ag('atlas-recent');
  var emptyEl  = _ag('atlas-empty');
  var detailEl = _ag('atlas-detail');
  if (bandsEl)  bandsEl.style.display  = 'none';
  if (recentEl) recentEl.style.display = 'none';
  if (emptyEl)  emptyEl.style.display  = 'none';
  if (detailEl) { detailEl.style.display = ''; requestAnimationFrame(function() { detailEl.classList.add('show'); }); }

  // Scroll canvas to top
  var canvas = _ag('atlas-canvas');
  if (canvas) canvas.scrollTop = 0;
}

function _atlasHideDetail() {
  var detailEl = _ag('atlas-detail');
  if (detailEl) { detailEl.classList.remove('show'); setTimeout(function() { detailEl.style.display = 'none'; }, 260); }
  var bandsEl = _ag('atlas-bands');
  if (bandsEl) bandsEl.style.display = ''; // restore: _atlasShowDetail hid it
  _atlasRenderBands(); // re-show bands
}

/* Wildcard inline control */
function _atlasRenderWildcard(container) {
  var domChk = document.getElementById('tr-wildcard-checkbox');
  var isOn   = domChk ? domChk.checked : false;
  container.innerHTML =
    '<div class="adi-title">Καθολική Πρόσβαση</div>' +
    '<div class="adi-wc-row">' +
      '<span class="adi-wc-label">Ξεκλείδωμα ΟΛΑ τα modules</span>' +
      '<span class="adi-wc-status ' + (isOn ? 'on' : 'off') + '" id="adi-wc-status">' + (isOn ? '⚠ ΕΝΕΡΓΟ' : 'Ανενεργό') + '</span>' +
      '<label class="subs-toggle">' +
        '<input type="checkbox" ' + (isOn ? 'checked' : '') + ' onchange="' +
          'if(typeof _trSaveWildcard===\'function\')_trSaveWildcard(this);' +
          'var st=document.getElementById(\'adi-wc-status\');' +
          'if(st){st.textContent=this.checked?\'⚠ ΕΝΕΡΓΟ\':\'Ανενεργό\';st.className=\'adi-wc-status \'+(this.checked?\'on\':\'off\');}' +
        '"/>' +
        '<span class="subs-toggle-track"></span>' +
      '</label>' +
    '</div>' +
    '<div class="adi-wc-warn">⚠ Ξεκλειδώνει ΟΛΑ για ΟΛΟΥΣ τους χρήστες. Χρήσε μόνο για testing.</div>';
}

/* ── Grammar Level Manager ──────────────────────────────────────
   Dynamic, registry-driven. No grammar game is hardcoded here:
   the manager discovers every grammar game that ships a level
   config, so adding a new game needs no edit to the Atlas. */

/* Discover grammar games that expose a level configuration.
   Source of truth, in order of preference:
     1) an explicit window.GRAMMAR_GAMES registry (optional override)
     2) GP_DATASETS entries: category 'Γραμματική', leveled, whose
        levelsGlobal resolves to a non-empty array on window.
   Returns: [{ id, label, icon, levelsGlobal, levels:[...] }]. */
function _atlasDetectGrammarGames() {
  var out = [];
  var seen = {};
  function add(id, label, icon, levelsGlobal, levels) {
    if (!id || seen[id] || !Array.isArray(levels) || !levels.length) return;
    seen[id] = true;
    out.push({ id: id, label: label || id, icon: icon || '📦',
               levelsGlobal: levelsGlobal || null, levels: levels });
  }
  // 1 ▸ explicit registry override
  if (Array.isArray(window.GRAMMAR_GAMES)) {
    window.GRAMMAR_GAMES.forEach(function(g) {
      if (!g) return;
      var levels = Array.isArray(g.levels) ? g.levels : _atlasResolveGlobal(g.levelsGlobal);
      add(g.id, g.label, g.icon, g.levelsGlobal, levels);
    });
  }
  // 2 ▸ derive from the existing dataset registry
  if (typeof GP_DATASETS !== 'undefined' && Array.isArray(GP_DATASETS)) {
    GP_DATASETS.forEach(function(ds) {
      if (!ds || ds.category !== 'Γραμματική' || !ds.leveled || !ds.levelsGlobal) return;
      add(ds.id, ds.label, ds.icon, ds.levelsGlobal, _atlasResolveGlobal(ds.levelsGlobal));
    });
  }
  return out;
}

/* Resolve a global declared by name. `var`/`function` globals are
   properties of window; top-level `const`/`let` (how the level
   arrays are declared, e.g. LYO_LVL) live in the global lexical
   scope instead, reachable only via indirect eval. The name always
   comes from our own registry, never user input. */
function _atlasResolveGlobal(name) {
  if (!name) return null;
  if (typeof window[name] !== 'undefined') return window[name];
  try {
    var v = (0, eval)(name); // indirect eval → runs in global scope
    return v;
  } catch (_e) { return null; }
}

/* Build the level-config UI for every detected grammar game.
   Pure read/overview + per-game deep-link into the curriculum
   picker (where per-class selections are actually saved). */
function _generateLevelConfigUI(container) {
  if (!container) return;
  var games = _atlasDetectGrammarGames();

  if (!games.length) {
    container.innerHTML =
      '<div class="adi-title">Επίπεδα Γραμματικής</div>' +
      '<div class="adi-glm-empty">Δεν εντοπίστηκαν παιχνίδια γραμματικής με επίπεδα. ' +
      'Πρόσθεσε ένα leveled dataset στο <code>GP_DATASETS</code> (με <code>levelsGlobal</code>) ' +
      'ή όρισε <code>window.GRAMMAR_GAMES</code>.</div>';
    return;
  }

  var totalLevels = games.reduce(function(n, g) { return n + g.levels.length; }, 0);

  var cards = games.map(function(g) {
    var groups = {};
    g.levels.forEach(function(l) {
      var k = l.group || '—';
      (groups[k] = groups[k] || []).push(l);
    });
    var groupsHtml = Object.keys(groups).map(function(grp) {
      var chips = groups[grp].map(function(l) {
        var color = 'adi-glm-' + (l.color || 'lgreen');
        return '<span class="adi-glm-chip ' + color + '" title="' +
          _atlasEsc('Επίπεδο ' + l.id + ': ' + (l.desc || '')) + '">' +
          _atlasEsc(String(l.id)) + '</span>';
      }).join('');
      return '<div class="adi-glm-grp">' +
        '<span class="adi-glm-grp-nm">' + _atlasEsc(grp) + '</span>' +
        '<div class="adi-glm-chips">' + chips + '</div>' +
      '</div>';
    }).join('');

    return '<div class="adi-glm-card">' +
      '<div class="adi-glm-hd">' +
        '<span class="adi-glm-ic">' + g.icon + '</span>' +
        '<span class="adi-glm-nm">' + _atlasEsc(g.label) + '</span>' +
        '<span class="adi-glm-ct">' + g.levels.length + ' επίπεδα</span>' +
      '</div>' +
      '<div class="adi-glm-groups">' + groupsHtml + '</div>' +
      '<button class="adi-glm-cfg" onclick="_atlasGoToCurriculumDataset(\'' +
        _atlasEsc(g.id) + '\')">Διαμόρφωση ανά τάξη →</button>' +
    '</div>';
  }).join('');

  container.innerHTML =
    '<div class="adi-title">Επίπεδα Γραμματικής' +
      '<span class="adi-glm-meta">' + games.length + ' παιχνίδια · ' + totalLevels +
      ' επίπεδα · αυτόματη ανίχνευση</span>' +
    '</div>' +
    '<div class="adi-glm-grid">' + cards + '</div>' +
    '<div class="adi-glm-note">Η επιλογή επιπέδων αποθηκεύεται ανά τάξη στο Πρόγραμμα Σπουδών. ' +
    'Νέα παιχνίδια γραμματικής εμφανίζονται εδώ αυτόματα.</div>';
}

/* Deep-link: jump to the curriculum panel and focus a dataset's
   level picker. Curriculum rows render after an async Firestore
   load, so poll briefly for the target row. */
function _atlasGoToCurriculumDataset(dsId) {
  closeAtlas();
  // SYNTHESIS: route through the Command Center (Curriculum → Class Plan)
  if (typeof window.goTo === 'function') { try { window.goTo('admin'); } catch (_e) {} }
  if (typeof window._renderAdminPage === 'function') { try { window._renderAdminPage(); } catch (_e) {} }
  if (typeof window.ccGoDom === 'function') { try { window.ccGoDom('curriculum'); } catch (_e) {} }
  if (typeof window.ccGoCat === 'function') { try { window.ccGoCat('classplan'); } catch (_e) {} }
  // legacy fallback for the Ver1 flat tab router
  if (typeof adminSwitchTab === 'function') adminSwitchTab('curriculum', _ag('admin-tab-btn-curriculum'));
  if (typeof _cpInitPanel === 'function') { try { _cpInitPanel(); } catch (_e) {} }

  var tries = 0;
  (function poll() {
    var row = _ag('cp-ds-row-' + dsId);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('atlas-flash');
      setTimeout(function() { row.classList.remove('atlas-flash'); }, 1400);
      var toggle = row.querySelector('input[type=checkbox]');
      if (toggle) { try { toggle.focus({ preventScroll: true }); } catch (_e) {} }
      return;
    }
    if (tries++ < 30) setTimeout(poll, 100);
  })();
}

/* ── Toast ──────────────────────────────────────────────────── */
function _atlasToast(f) {
  var toast = _ag('atlas-toast'), body = _ag('atlas-toast-body');
  if (!toast || !body) return;
  var g = ATLAS_GROUPS.find(function(x) { return x.id === f.g; });
  var sub = f.path || ((g ? g.label : '') + ' › ' + f.fn);
  body.innerHTML = 'Άνοιγμα <b>' + _atlasEsc(f.name) + '</b>' +
    '<span class="atlas-toast-sub">' + _atlasEsc(sub) + '</span>';
  toast.classList.add('show');
  clearTimeout(_atlasToastTmr);
  _atlasToastTmr = setTimeout(function() { toast.classList.remove('show'); }, 2500);
}

/* ── Keyboard ───────────────────────────────────────────────── */
function _atlasVisibleTiles() { return Array.from(document.querySelectorAll('#atlas-bands .atlas-tile')); }
function _atlasSetKbd(idx, scroll) {
  var tiles = _atlasVisibleTiles();
  tiles.forEach(function(t) { t.classList.remove('kbd'); });
  _atlasKbdIdx = idx;
  if (idx >= 0 && tiles[idx]) { tiles[idx].classList.add('kbd'); if (scroll) tiles[idx].scrollIntoView({block:'nearest'}); }
}
function _atlasMoveKbd(dir) {
  var tiles = _atlasVisibleTiles();
  if (!tiles.length) return;
  if (_atlasKbdIdx < 0) { _atlasSetKbd(0, true); return; }
  if (dir === 'next') { _atlasSetKbd(Math.min(_atlasKbdIdx + 1, tiles.length - 1), true); return; }
  if (dir === 'prev') { _atlasSetKbd(Math.max(_atlasKbdIdx - 1, 0), true); return; }
  var cr = tiles[_atlasKbdIdx].getBoundingClientRect(), best = -1, score = Infinity;
  tiles.forEach(function(t, i) {
    if (i === _atlasKbdIdx) return;
    var r = t.getBoundingClientRect(), dy = r.top - cr.top;
    var dx = Math.abs(r.left - cr.left) * 0.6;
    if (dir === 'down' && dy > 6)  { var s = dy + dx; if (s < score) { score = s; best = i; } }
    if (dir === 'up'   && dy < -6) { var s2 = -dy + dx; if (s2 < score) { score = s2; best = i; } }
  });
  if (best >= 0) _atlasSetKbd(best, true);
}

/* ── Scrollspy ──────────────────────────────────────────────── */
function _atlasSpyScroll() {
  var bands = Array.from(document.querySelectorAll('#atlas-bands .atlas-band'));
  var canvas = _ag('atlas-canvas'), toc = _ag('atlas-toc');
  if (!bands.length || !canvas || !toc) return;
  var top = canvas.scrollTop + 120, cur = bands[0];
  bands.forEach(function(b) { if (b.offsetTop <= top) cur = b; });
  toc.querySelectorAll('.atlas-toc-btn').forEach(function(t) {
    t.classList.toggle('on', t.dataset.g === (cur && cur.dataset.g));
  });
}

/* ── Events ─────────────────────────────────────────────────── */
function _atlasBindEvents() {
  var closeBtn  = _ag('atlas-close-btn');
  var backBtn   = _ag('atlas-detail-back');
  if (closeBtn) closeBtn.addEventListener('click', closeAtlas);
  if (backBtn)  backBtn.addEventListener('click', _atlasHideDetail);
  var si = _ag('atlas-search-input'), clr = _ag('atlas-search-clr');
  if (si)  si.addEventListener('input', _atlasRenderBands);
  if (clr) clr.addEventListener('click', function() { si.value = ''; si.focus(); _atlasRenderBands(); });
  var canvas = _ag('atlas-canvas');
  if (canvas) canvas.addEventListener('scroll', function() { requestAnimationFrame(_atlasSpyScroll); });
  document.addEventListener('keydown', _atlasKeydown);
}

function _atlasKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    if (typeof isAdmin === 'undefined' || !isAdmin) return;
    e.preventDefault();
    _atlasOpen ? closeAtlas() : openAtlas();
    return;
  }
  if (!_atlasOpen) return;
  var si = _ag('atlas-search-input'), inSearch = (document.activeElement === si);
  if (e.key === 'Escape') {
    e.preventDefault();
    var det = _ag('atlas-detail');
    if (det && det.classList.contains('show')) { _atlasHideDetail(); } else { closeAtlas(); }
    return;
  }
  if (e.key === '/' && !inSearch) { e.preventDefault(); if (si) si.focus(); return; }
  if (inSearch) { if (e.key === 'ArrowDown') { e.preventDefault(); if (si) si.blur(); _atlasSetKbd(0, true); } return; }
  if      (e.key === 'ArrowRight') { e.preventDefault(); _atlasMoveKbd('next'); }
  else if (e.key === 'ArrowLeft')  { e.preventDefault(); _atlasMoveKbd('prev'); }
  else if (e.key === 'ArrowDown')  { e.preventDefault(); _atlasMoveKbd('down'); }
  else if (e.key === 'ArrowUp')    { e.preventDefault(); _atlasMoveKbd('up'); }
  else if (e.key === 'Enter' && _atlasKbdIdx >= 0) {
    e.preventDefault();
    var tile = _atlasVisibleTiles()[_atlasKbdIdx];
    if (tile) _atlasShowDetail(ATLAS_FEATURES[+tile.dataset.fi]);
  }
}

/* ── SYNTHESIS bootstrap ──────────────────────────────────────────
   The Atlas is a standalone overlay (#admin-atlas) reachable two ways:
     • the global ⌘/Ctrl-K shortcut (admin-only), and
     • window.ccOpenAtlas() — wired into the Command Center's emergency
       bar (admin-cc.js). Lazy-builds its DOM on first open. Gated on the
       bare global isAdmin (auth.js) exactly like the rest of the admin. */
function ccOpenAtlas() { openAtlas(); }

// Expose for the Command Center + any caller. (Flat-script function decls
// are already global, but be explicit so this survives bundling/minification.)
window.openAtlas     = openAtlas;
window.closeAtlas    = closeAtlas;
window.initAtlas     = initAtlas;
window.atlasNavigate = atlasNavigate;
window.ccOpenAtlas   = ccOpenAtlas;

// Register the ⌘/Ctrl-K shortcut up-front (before first open) so the Atlas
// is reachable without any other entry point. initAtlas() also binds keydown
// once the DOM exists; _atlasInitDone guards against double-handling there.
(function _atlasGlobalKbd() {
  if (window.__atlasKbdBound) return;
  window.__atlasKbdBound = true;
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === 'k') {
      if (typeof isAdmin === 'undefined' || !isAdmin) return;
      if (_atlasInitDone) return; // initAtlas's own handler will take it
      e.preventDefault();
      openAtlas();
    }
  });
})();
