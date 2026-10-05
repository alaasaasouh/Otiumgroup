/* Local, reversible translations. English source nodes are retained for switching back. */
(() => {
  'use strict';
  const catalog=window.OTIUM_TRANSLATIONS||{};
  const enabled=window.OTIUM_SITE?.localizationEnabled!==false&&Object.keys(catalog).length>0;
  const supported=['en','fr','ar'];
  const storageKey='otium-language';
  const siteRoot=new URL('../',document.currentScript.src);
  const sources=new WeakMap();
  const attributes=new WeakMap();
  const linkSources=new WeakMap();
  const ignored='script,style,noscript,textarea,pre,.brand-name,.footer-wordmark,[data-i18n-ignore]';
  const attributeNames=['alt','title','placeholder','aria-label','aria-valuetext'];
  let language='en';
  function requestedLanguage(){
    const requested=new URLSearchParams(location.search).get('lang');
    if(supported.includes(requested))return requested;
    try{const saved=localStorage.getItem(storageKey);if(supported.includes(saved))return saved;}catch{}
    return 'en';
  }
  function t(source,vars={}){
    const key=String(source).trim().replace(/\s+/g,' ');
    let result=language==='en'?key:catalog[key]?.[language==='fr'?0:1];
    if(result===undefined){
      let match;
      if((match=key.match(/^(\d+) videos shown(?: in (.+))?\.$/))){
        return t(match[2]?'{count} videos shown in {category}.':'{count} videos shown.',{count:match[1],category:t(match[2]||'All')});
      }
      if((match=key.match(/^(\d+) of (\d+)$/)))return t('{number} of {total}',{number:match[1],total:match[2]});
      if(key.startsWith('Play ')&&catalog[key.slice(5)])return t('Play {title}',{title:t(key.slice(5))});
      if(key.endsWith(' Please try again.')&&catalog[key.slice(0,-18)])return t(key.slice(0,-18))+' '+t('Please try again.');
      result=key;
    }
    return result.replace(/\{(\w+)\}/g,(match,name)=>Object.hasOwn(vars,name)?String(vars[name]):match);
  }
  function text(node){
    if(!node.parentElement||node.parentElement.closest(ignored))return;
    const previous=sources.get(node);
    const source=previous&&node.data===previous.rendered?previous.source:node.data;
    const rendered=language==='en'?source:source.replace(/\S[\s\S]*\S|\S/,value=>t(value));
    if(node.data!==rendered)node.data=rendered;
    sources.set(node,{source,rendered});
  }
  function attribute(element,name){
    if(!element.hasAttribute(name)||element.closest(ignored))return;
    let records=attributes.get(element);
    if(!records){records=new Map();attributes.set(element,records);}
    const current=element.getAttribute(name),previous=records.get(name);
    const source=previous&&current===previous.rendered?previous.source:current;
    const rendered=language==='en'?source:t(source);
    if(current!==rendered)element.setAttribute(name,rendered);
    records.set(name,{source,rendered});
  }
  function link(element){
    if(!enabled||!element.matches('a[href]')||element.hasAttribute('download'))return;
    const raw=element.getAttribute('href');
    if(!raw||raw.startsWith('#'))return;
    const previous=linkSources.get(element);
    const source=previous&&raw===previous.rendered?previous.source:raw;
    let url;try{url=new URL(source,location.href);}catch{return;}
    if(url.origin!==siteRoot.origin||!url.pathname.startsWith(siteRoot.pathname)||!/(?:\.html|\/)$/i.test(url.pathname))return;
    url.searchParams.set('lang',language);
    const rendered=url.href;
    if(raw!==rendered)element.setAttribute('href',rendered);
    linkSources.set(element,{source,rendered});
  }
  function visit(root){
    if(root.nodeType===Node.TEXT_NODE){text(root);return;}
    if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return;
    if(root.nodeType===Node.ELEMENT_NODE&&root.closest(ignored))return;
    const elements=root.nodeType===Node.ELEMENT_NODE?[root,...root.querySelectorAll('*')]:[...root.querySelectorAll('*')];
    for(const element of elements){
      for(const name of attributeNames)attribute(element,name);
      if(element.matches('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[property="og:site_name"]'))attribute(element,'content');
      link(element);
    }
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode())text(walker.currentNode);
  }
  const observer=new MutationObserver(records=>{
    observer.disconnect();
    for(const record of records){
      if(record.type==='attributes')attribute(record.target,record.attributeName);
      else if(record.type==='characterData')text(record.target);
      else for(const node of record.addedNodes)if(node.isConnected)visit(node);
    }
    observe();
  });
  function observe(){observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributeNames});}
  function translate(root=document.documentElement){observer.disconnect();visit(root);observe();}
  function setLanguage(next,{persist=true,updateUrl=true}={}){
    if(!supported.includes(next))return;
    language=enabled?next:'en';
    document.documentElement.lang=language;
    document.documentElement.dir=language==='ar'?'rtl':'ltr';
    translate();
    document.querySelectorAll('[data-language-select]').forEach(select=>{select.value=language;});
    document.querySelectorAll('[data-language-switch]').forEach(control=>{control.hidden=!enabled;});
    if(enabled&&persist)try{localStorage.setItem(storageKey,language);}catch{}
    if(updateUrl)try{
      const url=new URL(location.href);
      if(enabled)url.searchParams.set('lang',language);else url.searchParams.delete('lang');
      history.replaceState(history.state,'',url);
    }catch{}
    document.dispatchEvent(new CustomEvent('otium:languagechange',{detail:{language}}));
    window.dispatchEvent(new Event('resize'));
  }
  window.OtiumI18n={t,setLanguage,translate,get language(){return language;},enabled};
  document.querySelectorAll('[data-language-select]').forEach(select=>select.addEventListener('change',()=>setLanguage(select.value)));
  setLanguage(requestedLanguage(),{persist:false,updateUrl:false});
  clearTimeout(window.otiumLocaleDeadline);
  document.documentElement.classList.remove('locale-pending');
  addEventListener('popstate',()=>setLanguage(requestedLanguage(),{persist:false,updateUrl:false}));
})();
