/* Shared localization hooks, also applied to existing pages without regenerating their content. */
module.exports=function withLocalization(html,base=''){
  if(html.includes('js/i18n.js'))return html;
  const boot=`<style>html.locale-pending body{visibility:hidden}</style><script>try{var l=new URLSearchParams(location.search).get('lang')||localStorage.getItem('otium-language');if(l==='fr'||l==='ar'){document.documentElement.classList.add('locale-pending');window.otiumLocaleDeadline=setTimeout(function(){document.documentElement.classList.remove('locale-pending');},2500);}}catch(e){}</script>`;
  const select=`<label class="language-switch" data-language-switch hidden><span class="sr-only">Website language</span><select data-language-select aria-label="Website language"><option value="en" lang="en" data-i18n-ignore>English</option><option value="fr" lang="fr" data-i18n-ignore>Français</option><option value="ar" lang="ar" data-i18n-ignore>العربية</option></select></label>`;
  html=html.replace('<meta charset="UTF-8">','<meta charset="UTF-8">'+boot)
    .replace(`<script defer src="${base}js/main.js"></script>`,`<script defer src="${base}data/translations.js"></script><script defer src="${base}js/i18n.js"></script><script defer src="${base}js/main.js"></script>`)
    .replace('</head>',`<link rel="stylesheet" href="${base}i18n.css"></head>`)
    .replace('<button class="menu-toggle"',select+'<button class="menu-toggle"')
    .replace('<div class="footer-bottom">',`<div class="footer-language">${select}</div><div class="footer-bottom">`);
  return html;
};
