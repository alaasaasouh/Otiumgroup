/* Merge faithful document translations into the existing local catalog. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const copy = require('./document-content.cjs');
const fr = require('./client-content.fr.json');
const ar = require('./client-content.ar.json');
const file = path.join(__dirname,'../data/translations.js');
const scope = {window:{}};
vm.runInNewContext(fs.readFileSync(file,'utf8'),scope);
const catalog = scope.window.OTIUM_TRANSLATIONS;
for (const paragraph of copy.source.paragraphs) {
  if (!fr[paragraph.id] || !ar[paragraph.id]) throw new Error(`Missing document translation ${paragraph.id}`);
  catalog[paragraph.text] = [fr[paragraph.id],ar[paragraph.id]];
}
// Card titles and descriptions occupy separate text nodes in the design.
for (const id of [2,37,38,39,40,41,60,61,62,63,64,65]) {
  const parts = [copy.text(id),fr[id],ar[id]].map(value => {
    const split = value.indexOf('. ') + 1;
    if (!split) throw new Error(`Missing service-title separator ${id}`);
    return [value.slice(0,split),value.slice(split+1)];
  });
  for (let i=0;i<2;i++) catalog[parts[0][i]] = [parts[1][i],parts[2][i]];
}
Object.assign(catalog, {
  'Otium Nexus Group': ['Otium Nexus Group','مجموعة أوتيوم نيكسوس'],
  'Welcome to Otium Nexus Group': ['Bienvenue chez Otium Nexus Group','مرحبًا بك في مجموعة أوتيوم نيكسوس'],
  'OTIUM NEXUS GROUP — PROJECT INQUIRY': ['OTIUM NEXUS GROUP — DEMANDE DE PROJET','مجموعة أوتيوم نيكسوس — استفسار عن مشروع'],
  'This brief was prepared locally and has not been submitted to Otium Nexus Group.': ['Ce brief a été préparé localement et n’a pas été transmis à Otium Nexus Group.','أُعدّ هذا الموجز محليًا ولم يُرسل إلى مجموعة أوتيوم نيكسوس.'],
  'Otium Nexus Group — Global standards. Local roots.': ['Otium Nexus Group — Des standards internationaux. Des racines locales.','مجموعة أوتيوم نيكسوس — معايير عالمية. جذور محلية.'],
  'London · Amman · Beirut · Cairo · Doha · Riyadh': ['Londres · Amman · Beyrouth · Le Caire · Doha · Riyad','لندن · عمّان · بيروت · القاهرة · الدوحة · الرياض'],
  'Visit Productions page': ['Découvrir la page Productions','زيارة صفحة الإنتاج'],
  'Visit Events page': ['Découvrir la page Events','زيارة صفحة الفعاليات'],
  'Otium Nexus Group. All rights reserved.': ['Otium Nexus Group. Tous droits réservés.','مجموعة أوتيوم نيكسوس. جميع الحقوق محفوظة.'],
  'Close company information': ['Fermer la présentation de la société','إغلاق معلومات الشركة'],
  'About Us — Otium Nexus Group': ['À propos — Otium Nexus Group','من نحن — مجموعة أوتيوم نيكسوس'],
  'Our Companies — Otium Nexus Group': ['Nos sociétés — Otium Nexus Group','شركاتنا — مجموعة أوتيوم نيكسوس'],
  'Films, television series, documentaries, web-series, video podcasts, branded and corporate content.': ['Films, séries télévisées, documentaires, webséries, podcasts vidéo, contenus de marque et d’entreprise.','أفلام ومسلسلات تلفزيونية وأفلام وثائقية ومسلسلات ويب وبودكاست مرئي ومحتوى للعلامات التجارية والشركات.'],
  'Large-scale and intimate concerts, corporate events and launches, luncheons and dinners, receptions, exhibitions and weddings.': ['Concerts de grande envergure et intimistes, événements d’entreprise et lancements, déjeuners et dîners, réceptions, expositions et mariages.','حفلات موسيقية كبرى وحميمة، وفعاليات شركات وحفلات إطلاق، وغداء وعشاء، واستقبالات ومعارض وحفلات زفاف.'],
  'Otium Productions — Otium Nexus Group': ['Otium Productions — Otium Nexus Group','أوتيوم للإنتاج — مجموعة أوتيوم نيكسوس'],
  'Films, television series, documentaries, web-series and video podcasts.': ['Films, séries télévisées, documentaires, webséries et podcasts vidéo.','أفلام ومسلسلات تلفزيونية وأفلام وثائقية ومسلسلات ويب وبودكاست مرئي.'],
  'International stories. Local intelligence. Creative ambition.': ['Des récits internationaux. Une connaissance locale. Une ambition créative.','قصص دولية. معرفة محلية. طموح إبداعي.'],
  'Otium Events — Every occasion, every size.': ['Otium Events — Toutes les occasions, toutes les envergures.','أوتيوم للفعاليات — لكل مناسبة، مهما كان حجمها.'],
  'Every occasion,': ['Toutes les occasions,','لكل مناسبة،'],
  'every size.': ['toutes les envergures.','مهما كان حجمها.'],
  'Concerts, festivals and shared experiences that bring people together.': ['Concerts, festivals et expériences partagées qui rapprochent les gens.','حفلات موسيقية ومهرجانات وتجارب مشتركة تجمع الناس.'],
  'Corporate & brand experiences': ['Événements d’entreprise et expériences de marque','تجارب الشركات والعلامات التجارية'],
  'Ideas brought': ['Des idées qui prennent','أفكار تنبض'],
  'to life.': ['vie.','بالحياة.'],
  'Conferences, launches and brand experiences, shaped around your ambition.': ['Conférences, lancements et expériences de marque conçus autour de votre ambition.','مؤتمرات وحفلات إطلاق وتجارب علامات تجارية نصمّمها حول طموحك.'],
  'Weddings & private celebrations': ['Mariages et célébrations privées','حفلات الزفاف والاحتفالات الخاصة'],
  'An occasion': ['Une occasion','مناسبة'],
  'entirely yours.': ['qui vous ressemble.','خاصة بك تمامًا.'],
  'Personal celebrations, thoughtfully imagined and carefully delivered.': ['Des célébrations personnelles, imaginées avec attention et réalisées avec soin.','احتفالات شخصية، نصمّمها باهتمام وننفّذها بعناية.'],
  'Live entertainment': ['Spectacles vivants','عروض حية'],
  'Otium Events introduction': ['Présentation d’Otium Events','مقدمة أوتيوم للفعاليات'],
  'Ideas brought to life.': ['Des idées qui prennent vie.','أفكار تنبض بالحياة.'],
  'An occasion entirely yours.': ['Une occasion qui vous ressemble.','مناسبة خاصة بك تمامًا.'],
  'Events page sections': ['Rubriques de la page Events','أقسام صفحة الفعاليات'],
  'Event services': ['Prestations événementielles','خدمات الفعاليات'],
  'Contact — Otium Nexus Group': ['Contact — Otium Nexus Group','تواصل معنا — مجموعة أوتيوم نيكسوس'],
  'London headquarters': ['Siège à Londres','المقر الرئيسي في لندن'],
  'Contact Otium Nexus Group for productions and events. London headquarters, with offices in Amman, Beirut, Cairo, Doha and Riyadh.': ['Contactez Otium Nexus Group pour vos productions et événements. Siège à Londres, avec des bureaux à Amman, Beyrouth, Le Caire, Doha et Riyad.','تواصل مع مجموعة أوتيوم نيكسوس للإنتاج والفعاليات. مقرنا الرئيسي في لندن، ولدينا مكاتب في عمّان وبيروت والقاهرة والدوحة والرياض.']
});
fs.writeFileSync(file,'/* English source text -> [French, Modern Standard Arabic]. */\nwindow.OTIUM_TRANSLATIONS = '+JSON.stringify(catalog,null,2)+';\n');
console.log('Synchronized all 65 document paragraphs, service titles and shared UI translations.');
