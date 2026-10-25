// Explicit local-only HTTP collector. Never enables a published build or contacts a live provider.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const shared=process.env.OWNED_ANALYTICS_SITE_ROOT??path.join(root,'.superpowers','test-contract');
import { chromium } from 'playwright';
const {validateWebsiteEvent,validateContractDto}=await import(pathToFileURL(path.join(shared,'supabase/functions/_shared/websiteAnalyticsContract.ts')));
const prefix=process.env.BASE_PATH??'', events=new Map(),receipts=new Map(),requests=[],errors=[];
const isSdkUrl=url=>url.pathname.endsWith('/analytics/consent-manager.js');
let failReceipt=false;
const server=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://fixture');res.setHeader('Content-Type','application/json');
 if(req.headers.origin===site){res.setHeader('Access-Control-Allow-Origin',site);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','POST, DELETE, OPTIONS');}
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 if(url.pathname==='/events'||url.pathname===prefix+'/events')throw new Error('A relative optional events request must never occur');
 if(url.pathname==='/collector/consent/receipts'&&req.method==='POST'){
  if(failReceipt){res.writeHead(503);res.end('{}');return;}
  const body=JSON.parse(await bodyText(req)),receipt={receiptId:crypto.randomUUID(),...body,issuedAt:new Date().toISOString(),expiresAt:new Date(Date.now()+180*86400000).toISOString(),collectionToken:'local_fixture_collection_capability_123',revocationProof:'local_fixture_revocation_capability_123'};
  assert.ok(validateContractDto('ConsentReceipt',receipt));receipts.set(receipt.receiptId,receipt);res.end(JSON.stringify(receipt));return;
 }
 if(url.pathname.startsWith('/collector/consent/receipts/')&&req.method==='DELETE'){res.end('{"revoked":true}');return;}
 if(url.pathname==='/collector/events'){
  const raw=await bodyText(req),body=JSON.parse(raw);requests.push(body);assert.equal(req.headers.cookie,undefined);assert.equal(req.headers.authorization,undefined);assert.ok(Buffer.byteLength(raw)<=32768);
  const acceptedIds=[],duplicateIds=[];
  for(const event of body.events){const result=validateWebsiteEvent(event,{origin:event.site_id==='radovar'?'https://radovar.com':'https://codevalanche.com',receivedAt:new Date().toISOString(),receipt:receipts.get(body.receiptId)});assert.equal(result.accepted,true,JSON.stringify({event,result}));if(events.has(event.event_id)){assert.deepEqual(events.get(event.event_id),event);duplicateIds.push(event.event_id);}else{events.set(event.event_id,event);acceptedIds.push(event.event_id);}}
  res.end(JSON.stringify({acceptedIds,duplicateIds,rejected:[],generation:body.generation,receivedAt:new Date().toISOString(),retryAfterMs:null}));return;
 }
 if(prefix&&!url.pathname.startsWith(prefix+'/')){res.writeHead(404);res.end();return;}
 let local=decodeURIComponent(url.pathname.slice(prefix.length));local=local.endsWith('/')?local+'index.html':local;
 const target=path.resolve(root,'out','.'+local);assert.ok(target.startsWith(path.join(root,'out')+path.sep));
 let data;try{data=await readFile(target);}catch{data=await readFile(path.join(root,'out/404.html'));res.statusCode=404;local='.html';}
 res.setHeader('Content-Type',local.endsWith('.js')?'text/javascript':local.endsWith('.css')?'text/css':local.endsWith('.svg')?'image/svg+xml':local.endsWith('.webp')?'image/webp':local.endsWith('.png')?'image/png':local.endsWith('.woff2')?'font/woff2':local.endsWith('.txt')?'text/plain':'text/html');res.end(data);
 }catch(error){errors.push(error.message);res.writeHead(500);res.end('{}');}}).listen(0,'127.0.0.1');
async function bodyText(req){const chunks=[];for await(const chunk of req)chunks.push(chunk);return Buffer.concat(chunks).toString();}
await new Promise(resolve=>server.once('listening',resolve));
const origin=`http://127.0.0.1:${server.address().port}`,site=process.env.RADOVAR_TEST_ORIGIN??origin;
// Allow real browser restoration instead of Playwright's default BFCache-disable switch.
const browser=await chromium.launch({headless:true,ignoreDefaultArgs:['--disable-back-forward-cache']});
const all=()=>[...events.values()],views=()=>all().filter(e=>e.event_name==='page_viewed');
async function context({enabled=true,...options}={}){const ctx=await browser.newContext({reducedMotion:'reduce',...options});ctx.on('page',page=>page.on('pageerror',e=>errors.push(e.message)));await ctx.addInitScript(()=>{window.__fixturePageShows=[];window.addEventListener('pageshow',event=>window.__fixturePageShows.push(event.persisted));});await ctx.route('https://**/*',route=>route.abort());if(enabled)await ctx.addInitScript(baseUrl=>{window.__RADOVAR_ANALYTICS_TEST_CONFIG__={enabled:true,baseUrl,pageVersion:'local_fixture'};},origin+'/collector');return ctx;}
async function ready(page,route='/'){await page.goto(site+prefix+route);await page.waitForFunction(()=>window.RadovarAnalytics?.consentManager,null,{timeout:7000});}
async function flush(page){await page.evaluate(()=>window.RadovarAnalytics.flush());}
async function choice(page,value){await page.evaluate(websiteAnalytics=>window.RadovarAnalytics.setConsent({websiteAnalytics}),value);}
async function core(page){await page.getByRole('tab',{name:'Your review',exact:true}).click();assert.equal(await page.getByRole('tab',{name:'Your review',exact:true}).getAttribute('aria-selected'),'true');await page.getByRole('button',{name:'Switch to dark theme',exact:true}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await page.locator('.nav__menu summary').click();await page.locator('.nav__panel a').first().click();assert.equal(await page.locator('.nav__menu').getAttribute('open'),null);}
async function referralBoundary(){
 // Actual browser cross-origin document navigation and referrer policy, with all responses
 // explicitly routed to local fixtures. No live provider or cross-domain consent/ID parameter.
 for(const policy of ['strict-origin-when-cross-origin','no-referrer']){
  const ctx=await context({enabled:false}),p=await ctx.newPage();let refusedReceipts=0,receiptAborted;const receiptAttempt=new Promise(resolve=>{receiptAborted=resolve;});
  // Canonical Radovar is active in this candidate. Explicitly model an unavailable
  // receipt service, aborting before network IO rather than treating it as disabled.
  await ctx.route('https://hvevaxsfeyiikjhcsafi.supabase.co/functions/v1/website-analytics/v1/consent/receipts',async route=>{refusedReceipts++;await route.abort();receiptAborted();});
  await ctx.route('https://radovar.com/**',async route=>{const url=new URL(route.request().url()),pathname=prefix&&url.pathname.startsWith(prefix+'/')?url.pathname:prefix+url.pathname;const response=await route.fetch({url:origin+pathname+url.search});await route.fulfill({response,headers:{...response.headers(),'referrer-policy':policy}});});
  await ctx.route('https://codevalanche.com/**',async route=>{
   const url=new URL(route.request().url());
   if(url.pathname==='/')return route.fulfill({contentType:'text/html',body:`<h1>Explicit local Codevalanche SDK fixture</h1><button>Accept fixture analytics</button><script type="module">import {createAnalyticsClient,createConsentManager,createConsentTransport} from '/analytics/owned-analytics.js';const manager=createConsentManager({siteId:'codevalanche',transport:createConsentTransport({baseUrl:location.origin+'/collector'})});const client=createAnalyticsClient({siteId:'codevalanche',baseUrl:location.origin+'/collector',consentManager:manager,pageVersion:'local_fixture'});client.startPage({pageId:'home'});window.referralFixture={manager,client};document.querySelector('button').onclick=()=>client.setConsent({websiteAnalytics:true});</script>`});
   const response=await route.fetch({url:origin+(url.pathname.startsWith('/collector/')?'':prefix)+url.pathname+url.search});await route.fulfill({response});
  });
  await p.goto('https://radovar.com/');await p.getByRole('button',{name:'Accept analytics',exact:true}).click();await receiptAttempt;await p.locator('.cmp-availability').waitFor();assert.equal(refusedReceipts,1,'the synthetic canonical receipt request is aborted before provider IO');
  // This routed local document models both available and withheld referrers.
  // Match its metadata to its synthetic response header after hydration too.
  await p.evaluate(policy=>document.querySelector('meta[name="referrer"]')?.setAttribute('content',policy),policy);
  assert.equal(await p.evaluate(()=>localStorage.getItem('owned_analytics:radovar:identity')),null,'Radovar without a valid receipt has no optional visitor ID');
  const before=events.size;await p.locator('#codevalanche .feature a[href="https://codevalanche.com"]').click();await p.waitForURL('https://codevalanche.com/');await p.waitForFunction(()=>window.referralFixture);
  assert.equal(await p.evaluate(()=>window.referralFixture.manager.getState().state),'unknown','Radovar choice is not Codevalanche consent');assert.equal(events.size,before,'no collection before separate destination consent');assert.equal(new URL(p.url()).search,'');assert.equal(await p.evaluate(()=>localStorage.getItem('owned_analytics:radovar:identity')),null);
  assert.equal(await p.evaluate(()=>document.referrer),policy==='no-referrer'?'':'https://radovar.com/');
  await p.getByRole('button',{name:'Accept fixture analytics'}).click();await p.waitForFunction(()=>window.referralFixture.manager.getCollectionContext({touchActivity:false}));await p.evaluate(()=>window.referralFixture.client.flush());
  const session=all().filter(e=>e.site_id==='codevalanche'&&e.event_name==='session_started').at(-1);assert.equal(session.context.referrer_domain,policy==='no-referrer'?'unknown':'radovar.com');assert.equal(session.properties.attribution_kind,policy==='no-referrer'?'unknown':'referrer');await ctx.close();
 }
}
async function bannerFocusRegression(){
 const problems=[];
 for(const action of ['Accept analytics','Decline']){
  const ctx=await context({enabled:false,viewport:{width:390,height:844}}),p=await ctx.newPage();await ready(p);
  assert.equal(await p.evaluate(()=>window.RadovarAnalytics.consentManager.getState().state),'unknown');
  await p.evaluate(()=>window.scrollTo({top:140,behavior:'instant'}));const before=await p.evaluate(()=>scrollY);
  await p.getByRole('button',{name:action,exact:true}).click();await p.waitForFunction(()=>window.RadovarAnalytics.consentManager.getState().state!=='unknown');await p.waitForTimeout(350);
  const after=await p.evaluate(()=>({scroll:scrollY,footerFocus:document.activeElement?.matches('.cookie-reopen')}));
  if(Math.abs(after.scroll-before)>2||after.footerFocus)problems.push({action,before,after});
  // Deliberately opening the footer dialog may scroll to its invoker; saving/escaping
  // restores that actual invoker without a second viewport movement.
  await p.getByRole('button',{name:'Manage cookies',exact:true}).click();const footerScroll=await p.evaluate(()=>scrollY);
  await p.getByRole('button',{name:'Save preferences',exact:true}).click();await p.waitForFunction(()=>document.querySelector('[role="dialog"]')===null);
  assert.equal(await p.evaluate(()=>document.activeElement?.matches('.cookie-reopen')),true,'dialog save restores footer invoker');assert.ok(Math.abs(await p.evaluate(()=>scrollY)-footerScroll)<=2,'dialog save keeps invoker viewport');
  await p.getByRole('button',{name:'Manage cookies',exact:true}).click();await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement?.matches('.cookie-reopen')),true,'dialog Escape restores footer invoker');await ctx.close();
 }
 const ctx=await context({enabled:false,viewport:{width:390,height:844}}),p=await ctx.newPage();await ready(p);await p.evaluate(()=>window.scrollTo({top:140,behavior:'instant'}));const before=await p.evaluate(()=>scrollY);
 await p.getByRole('button',{name:'Personalize',exact:true}).click();assert.equal(await p.getByRole('dialog',{name:'Cookie preferences'}).isVisible(),true);await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement?.textContent),'Personalize');assert.ok(Math.abs(await p.evaluate(()=>scrollY)-before)<=2,'Personalize Escape keeps banner invoker viewport');await ctx.close();
 assert.deepEqual(problems,[],'initial banner choices preserve viewport and do not focus the footer');
 console.log('PASS banner focus: unknown Accept + Decline preserve near-top viewport/no footer focus; Personalize/Escape and footer Save/Escape restore invokers');
}
async function pageCatalogRegression(){
 const ctx=await context({viewport:{width:1280,height:720}}),p=await ctx.newPage();
 try{
  await ready(p);await choice(p,true);await flush(p);
  const sessionId=views().at(-1).session_id,observed=()=>all().filter(event=>event.session_id===sessionId),pageViews=()=>observed().filter(event=>event.event_name==='page_viewed');
  await p.evaluate(()=>{window.__catalogDocument={};window.__catalogRuntime=window.RadovarAnalytics;});
  await p.locator('.nav__links [data-analytics-target="company"]').click();await p.waitForFunction(()=>window.RadovarAnalytics.pageId==='company');await flush(p);
  assert.deepEqual(pageViews().map(event=>event.page_id),['home','company'],'SPA company starts its own SDK page');
  const homeInstance=pageViews()[0].page_instance_id,homeAfterLeave=observed().filter(event=>event.page_instance_id===homeInstance&&event.event_name==='page_engagement_reported');
  await p.keyboard.press('Shift');await p.waitForTimeout(1300);await flush(p);
  await p.getByRole('link',{name:'Explore Codevalanche',exact:true}).click();await p.waitForFunction(()=>window.RadovarAnalytics.pageId==='codevalanche');
  await p.getByRole('tab',{name:'Your agents',exact:true}).click();await flush(p);
  await p.goBack();await p.waitForFunction(()=>window.RadovarAnalytics.pageId==='company');await p.keyboard.press('Shift');await p.waitForTimeout(1300);await flush(p);
  const sequence=pageViews();assert.deepEqual(sequence.map(event=>event.page_id),['home','company','codevalanche','company']);assert.equal(new Set(sequence.map(event=>event.page_instance_id)).size,4,'each committed route/back receives its own page instance');assert.deepEqual(sequence.map(event=>event.properties.navigation_type),['initial','route','route','back_forward']);
  assert.equal(await p.evaluate(()=>Boolean(window.__catalogDocument)&&window.__catalogRuntime===window.RadovarAnalytics),true,'route and Back retain one document and analytics client');
  assert.deepEqual(observed().filter(event=>event.page_instance_id===homeInstance&&event.event_name==='page_engagement_reported'),homeAfterLeave,'home engagement stops when company commits');
  assert.ok(observed().some(event=>event.event_name==='page_exited'&&event.page_instance_id===homeInstance&&event.properties.exit_kind==='navigation'));
  assert.deepEqual(observed().filter(event=>event.event_name==='navigation_used').map(event=>[event.page_id,event.properties.target_page_id]),[['home','company'],['company','codevalanche']],'new destination catalog IDs survive sanitization exactly once');
  assert.ok(observed().some(event=>event.event_name==='feature_selected'&&event.page_id==='codevalanche'&&event.properties.feature_id==='agents'),'product interactions use the product page instance');
  for(const event of sequence.filter(event=>event.page_id==='company'))assert.ok(observed().some(sample=>sample.event_name==='page_engagement_reported'&&sample.page_instance_id===event.page_instance_id&&sample.properties.active_ms_total>=1000),'company engagement belongs to each company instance');
 }finally{await ctx.close();}
 await sectionCatalogRegression();
 console.log('PASS Radovar catalog: SPA home/company/product/Back instances, navigation and engagement attribution');
}
async function sectionCatalogRegression(){
 const sections=await context({viewport:{width:1280,height:720}}),s=await sections.newPage();
 try{
  for(const [route,blocks] of [['/press/',[['news-title','resources']]],['/company/',[['mission-title','company'],['trust-title','resources']]]]){
   await ready(s,route);await choice(s,true);await flush(s);const instance=views().at(-1).page_instance_id;
   const ids=await s.locator('[data-analytics-section]').evaluateAll(elements=>elements.map(element=>element.dataset.analyticsSection));assert.equal(new Set(ids).size,ids.length,route+' registers one observer per semantic section');
   for(const [heading,id] of blocks){
    const block=s.locator(`[aria-labelledby="${heading}"]`);assert.equal(await block.evaluate(element=>element.closest('[data-analytics-section]')?.dataset.analyticsSection),id,'the earlier block belongs to its semantic observer');
    await block.evaluate(element=>window.scrollTo({top:scrollY+element.getBoundingClientRect().top+20,behavior:'instant'}));await s.keyboard.press('Shift');await s.waitForTimeout(1400);await flush(s);
    assert.ok(all().some(event=>event.page_instance_id===instance&&event.event_name==='section_viewed'&&event.properties.section_id===id),route+' observes earlier '+id+' content');
   }
  }
 }finally{await sections.close();}
 console.log('PASS Radovar sections: one registration per semantic ID; earlier newsroom/company/resource section exposure');
}
try{
 if(process.argv.includes('--catalog-only')){await pageCatalogRegression();assert.deepEqual(errors,[]);}
 else if(process.argv.includes('--sections-only')){await sectionCatalogRegression();assert.deepEqual(errors,[]);}
 else if(process.argv.includes('--referral-only')){await referralBoundary();assert.deepEqual(errors,[]);}
 else if(process.argv.includes('--banner-focus-only')){await bannerFocusRegression();assert.deepEqual(errors,[]);}
 else if(process.argv.includes('--strict-mode')){
  assert.ok(process.env.RADOVAR_TEST_ORIGIN,'StrictMode requires a real Next development server');
  const strict=await context();await strict.addInitScript(()=>{window.__fixtureEffects={adds:0,removes:0};for(const name of ['addEventListener','removeEventListener']){const original=window[name];window[name]=function(type,...args){if(type==='radovar:preferences')window.__fixtureEffects[name==='addEventListener'?'adds':'removes']++;return original.call(this,type,...args);};}});const p=await strict.newPage();
  let release;const gate=new Promise(resolve=>release=resolve),seen=p.waitForRequest(request=>isSdkUrl(new URL(request.url())));let sdkRequests=0;
  await strict.route(isSdkUrl,async route=>{sdkRequests++;await gate;await route.continue();});
  await p.goto(site+prefix+'/');await seen;
  await p.waitForFunction(()=>window.__fixtureEffects.adds>=2&&window.__fixtureEffects.removes>=1,null,{timeout:4000});assert.ok(await p.evaluate(()=>window.__fixtureEffects.adds>=2&&window.__fixtureEffects.removes>=1),'actual development effect setup/cleanup replay observed before SDK release');
  assert.equal(await p.evaluate(()=>window.RadovarAnalytics===undefined),true);
  await p.getByRole('tab',{name:'Your review',exact:true}).click();
  await p.locator('.nav__links a').filter({hasText:'Docs'}).click();await p.waitForURL(site+prefix+'/docs/');
  release();await p.waitForFunction(()=>window.RadovarAnalytics?.pageId==='docs');await choice(p,true);await flush(p);
  assert.equal(sdkRequests,1,'StrictMode caches one actual async SDK request');assert.equal(views().length,1,'StrictMode setup/cleanup and late load create one pageview');assert.equal(views()[0].page_id,'docs','late SDK uses committed route, no stale home page');assert.equal(receipts.size,1,'one live manager issues one receipt after replay');
  await p.goBack();await p.waitForFunction(()=>window.RadovarAnalytics.pageId==='home');await p.getByRole('tab',{name:'Your agents',exact:true}).click();await flush(p);assert.equal(views().length,2);assert.equal(all().filter(e=>e.event_name==='feature_selected').length,1,'one listener after StrictMode effect replay');
  await strict.close();assert.deepEqual(errors,[]);console.log('PASS real Next dev StrictMode: held async import, core controls/route before SDK, one request/client/pageview, latest route, back and one semantic listener');
 }else{
 await bannerFocusRegression();
 const ctx=await context(),page=await ctx.newPage();await ready(page,'/?utm_source=newsletter&utm_campaign=fall_launch&email=private@example.org#access_token=private');
 assert.equal(await page.locator('[data-owned-consent]').count(),1);assert.equal(requests.length,0,'unknown consent has zero IO');assert.equal(receipts.size,0,'unknown consent issues no receipt');
 await page.getByRole('button',{name:'Decline',exact:true}).click();await flush(page);assert.equal(requests.length,0,'denial has zero events');assert.equal(receipts.size,0,'denial issues no receipt');
 await page.getByRole('button',{name:'Manage cookies',exact:true}).first().click();assert.equal(await page.getByRole('dialog',{name:'Cookie preferences'}).isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
 await page.getByRole('button',{name:'Manage cookies',exact:true}).click();await page.getByRole('button',{name:'Accept analytics',exact:true}).click();await page.waitForFunction(()=>window.RadovarAnalytics.status()==='ready');await flush(page);assert.equal(views().length,1,'initial consented pageview exactly once');
 let session=all().find(e=>e.event_name==='session_started');assert.equal(session.context.acquisition_source,'newsletter');assert.equal(session.context.campaign,'fall_launch');assert.ok(!JSON.stringify(all()).includes('private'));
 const firstInstance=views()[0].page_instance_id;
 await page.getByRole('tab',{name:'Your agents',exact:true}).click();await page.getByRole('tab',{name:'Your review',exact:true}).click();await page.getByRole('tab',{name:'Your project',exact:true}).click();await page.getByRole('tab',{name:'Your project',exact:true}).click();
 await page.locator('.intro-link').click();await flush(page);assert.equal(views().length,1,'rerender and anchor do not add pageviews');assert.equal(views()[0].page_instance_id,firstInstance);assert.deepEqual(all().filter(e=>e.event_name==='feature_selected').map(e=>e.properties.feature_id),['agents','review','project']);
 // Next Link navigation retains the document/client; back creates one new route page instance.
 await page.locator('.nav__links a').filter({hasText:'Docs'}).click();await page.waitForURL(site+prefix+'/docs/');await page.waitForFunction(()=>window.RadovarAnalytics.pageId==='docs');await flush(page);assert.ok(all().some(e=>e.event_name==='navigation_used'&&e.properties.target_page_id==='docs'),'Next Link semantic navigation');assert.equal(views().filter(e=>e.page_id==='docs').length,1);await page.goBack();await page.waitForFunction(()=>window.RadovarAnalytics.pageId==='home',null,{timeout:4000});await flush(page);assert.equal(views().filter(e=>e.page_id==='home').length,2);assert.equal(views().at(-1).properties.navigation_type,'back_forward');assert.equal(await page.locator('#intro-title').isVisible(),true);assert.equal(new URL(page.url()).pathname,prefix+'/');assert.equal(new URL(page.url()).hash,'#company');await page.goForward();await page.waitForFunction(()=>window.RadovarAnalytics.pageId==='docs');assert.match(await page.getByRole('heading',{level:1}).innerText(),/Codevalanche/,'Forward restores the Codevalanche guide');await flush(page);assert.equal(views().filter(e=>e.page_id==='docs').length,2);
 for(const [route,id] of [['/docs/','docs'],['/security/','security'],['/privacy/','privacy'],['/terms/','terms'],['/press/','press'],['/changelog/','changelog_archive'],['/company/','company'],['/codevalanche/','codevalanche'],['/research/','research'],['/research/wave-ai/','research_wave_ai'],['/missing-fixture/','not_found']]){const before=views().length;await ready(page,route);await flush(page);assert.equal(views().length,before+1,route);assert.equal(views().at(-1).page_id,id);assert.equal(await page.locator('[data-owned-consent]').count(),1);}
 await ready(page,'/docs/');await flush(page);const beforeContentsViews=views().length;await page.getByRole('navigation',{name:'On this page',exact:true}).locator('a').first().click();await page.waitForFunction(()=>location.hash.startsWith('#article-'));await flush(page);assert.equal(views().length,beforeContentsViews,'chapter anchors do not add pageviews');const contentsEvent=all().filter(e=>e.event_name==='navigation_used').at(-1);assert.equal(contentsEvent.properties.target_page_id,'docs');assert.equal(contentsEvent.properties.placement,'resources','new chapter links use the existing semantic navigation contract');
 await ready(page);await page.setViewportSize({width:390,height:480});assert.ok(await page.locator('#company').evaluate(element=>element.getBoundingClientRect().height>innerHeight),'section actually taller than viewport');await page.locator('#company').scrollIntoViewIfNeeded();await page.waitForTimeout(1400);await flush(page);assert.ok(all().some(e=>e.event_name==='section_viewed'&&e.properties.section_id==='company'),'tall section reach');await page.setViewportSize({width:1280,height:720});
 // Ordinary product-link navigation: no prevention, awaited queue or flush in click path.
 await ctx.route('https://codevalanche.com/',route=>route.fulfill({contentType:'text/html',body:'<h1>Local product destination fixture</h1>'}));const beforeCta=all().filter(e=>e.event_name==='cta_clicked').length;await page.locator('#codevalanche .feature a[href="https://codevalanche.com"]').click();await page.waitForURL('https://codevalanche.com/');await page.waitForTimeout(500);assert.equal(all().filter(e=>e.event_name==='cta_clicked').length,beforeCta+1);assert.equal(new URL(page.url()).search,'');const nativeViews=views().length;await page.goBack();await page.waitForFunction(()=>window.RadovarAnalytics?.pageId==='home');await flush(page);const restored=await page.evaluate(()=>window.__fixturePageShows.at(-1));assert.equal(views().length,nativeViews+(restored?0:1),'native Back has no duplicate restored or new-document pageview');console.log('Native Back pageshow.persisted='+restored+' (browser eligibility, not simulated)');
 for(const [route,selector,id] of [['/','footer a[href="https://codevalanche.com"]','footer'],['/docs/','.docPage__body a[href="https://codevalanche.com"]','resources']]){await ready(page,route);await page.locator(selector).click();await page.waitForURL('https://codevalanche.com/');await page.waitForTimeout(300);assert.equal(all().filter(e=>e.event_name==='cta_clicked').at(-1).properties.cta_id,id,'catalog CTA location ID');}
 await ready(page);const peer=await ctx.newPage();await ready(peer);await peer.getByRole('button',{name:'Manage cookies',exact:true}).click();await peer.getByRole('button',{name:'Decline',exact:true}).click();await page.waitForFunction(()=>!window.RadovarAnalytics.consentManager.getState().websiteAnalytics);const beforeWithdrawal=requests.length;await flush(page);assert.equal(requests.length,beforeWithdrawal);await ctx.close();
 // Disabled build fences even a persisted valid grant, including relative /events.
 const granted=await context(),g=await granted.newPage();await ready(g);await choice(g,true);await flush(g);const savedGrant=await granted.storageState();await granted.close();const disabled=await context({enabled:false,storageState:savedGrant}),d=await disabled.newPage();await ready(d);assert.equal(await d.evaluate(()=>window.RadovarAnalytics.consentManager.getCollectionContext({touchActivity:false})),null);const beforeDisabled=requests.length;await flush(d);assert.equal(requests.length,beforeDisabled);assert.equal(await d.evaluate(()=>window.RadovarAnalytics.status()),'not_configured');await disabled.close();
 for(const mode of ['method','getter']){const noStorage=await context();await noStorage.addInitScript(mode=>{if(mode==='getter')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}});else for(const name of ['getItem','setItem','removeItem'])Storage.prototype[name]=()=>{throw new DOMException('blocked','SecurityError')};},mode);const p=await noStorage.newPage();await ready(p);await p.getByRole('tab',{name:'Your review',exact:true}).click();await choice(p,false);await noStorage.close();}
 failReceipt=true;const offline=await context(),o=await offline.newPage();await ready(o);await choice(o,true);assert.equal(await o.evaluate(()=>window.RadovarAnalytics.status()),'unavailable');await o.getByRole('button',{name:'Review cookie preferences',exact:true}).click();await o.getByRole('dialog',{name:'Cookie preferences',exact:true}).waitFor();await o.getByRole('button',{name:'Close preferences',exact:true}).click();await o.getByRole('tab',{name:'Your review',exact:true}).click();await offline.close();failReceipt=false;
 // A pending receipt is never a reason to lock the user out of withdrawing.
 const pending=await context(),q=await pending.newPage();let releaseReceipt,releaseRevoke;const receiptGate=new Promise(resolve=>releaseReceipt=resolve),revokeGate=new Promise(resolve=>releaseRevoke=resolve),receiptSeen=q.waitForRequest('**/collector/consent/receipts');await pending.route('**/collector/consent/receipts/*',async route=>{await revokeGate;await route.continue();});
 await pending.route('**/collector/consent/receipts',async route=>{await receiptGate;await route.continue();});await ready(q);await q.getByRole('button',{name:'Accept analytics',exact:true}).click();await receiptSeen;await q.getByRole('button',{name:'Manage cookies',exact:true}).click();assert.equal(await q.getByRole('button',{name:'Decline',exact:true}).isEnabled(),true,'withdrawal stays available during a pending receipt');const beforePending=requests.length;await q.getByRole('button',{name:'Decline',exact:true}).click();const lateReceipt=q.waitForResponse('**/collector/consent/receipts'),revokeSeen=q.waitForRequest('**/collector/consent/receipts/*');releaseReceipt();await lateReceipt;await revokeSeen;await q.getByRole('button',{name:'Manage cookies',exact:true}).click();assert.equal(await q.getByRole('button',{name:'Decline',exact:true}).isEnabled(),true,'withdrawal stays available while revoke ACK is held');await q.getByRole('button',{name:'Decline',exact:true}).click();await q.getByRole('button',{name:'Manage cookies',exact:true}).click();const revokeAck=q.waitForResponse('**/collector/consent/receipts/*');releaseRevoke();await revokeAck;await q.waitForFunction(()=>!window.RadovarAnalytics.consentManager.getState().websiteAnalytics);await flush(q);assert.equal(requests.length,beforePending,'late receipt/ACK cannot collect after UI withdrawal');assert.equal(await q.getByRole('dialog').isVisible(),true,'late completion does not close reopened preferences');assert.equal(await q.evaluate(()=>window.RadovarAnalytics.consentManager.getCollectionContext({touchActivity:false})),null);await pending.close();
 for(const mode of ['blocked','held','throwing','bootstrap']){const isolation=await context({enabled:false,viewport:{width:390,height:844}}),p=await isolation.newPage();let release;const gate=new Promise(resolve=>release=resolve),seen=p.waitForRequest(request=>isSdkUrl(new URL(request.url())));let count=0;if(mode==='bootstrap')await isolation.addInitScript(()=>{window.__RADOVAR_ANALYTICS_TEST_CONFIG__={enabled:false,baseUrl:'',get pageVersion(){window.fixtureBootstrapAttempted=true;return 'invalid bootstrap/version';}};});await isolation.route(isSdkUrl,async route=>{count++;if(mode==='blocked')return route.abort();if(mode==='held')await gate;if(mode==='throwing')return route.fulfill({contentType:'text/javascript',body:'throw new Error("fixture SDK evaluation failed");'});return route.continue();});await p.goto(site+prefix+'/');await seen;if(mode==='bootstrap')await p.waitForFunction(()=>window.fixtureBootstrapAttempted===true);await core(p);if(mode==='held'){release();await p.waitForFunction(()=>window.RadovarAnalytics);assert.equal(count,1);}await p.locator('.footer__col a').filter({hasText:'Product guide'}).click();await p.waitForURL(site+prefix+'/docs/');await isolation.close();}
 const screenshotDir=process.env.RADOVAR_SCREENSHOT_DIR;if(screenshotDir)await mkdir(screenshotDir,{recursive:true});
 for(const width of [320,390,768,1440])for(const colorScheme of ['light','dark']){const visual=await context({enabled:false,viewport:{width,height:900},colorScheme}),v=await visual.newPage();await ready(v);assert.equal(await v.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}/${colorScheme} overflow`);await v.getByRole('button',{name:'Decline',exact:true}).click();await v.getByRole('button',{name:'Manage cookies',exact:true}).first().click();assert.equal(await v.getByRole('dialog').isVisible(),true);await v.getByRole('checkbox',{name:'Account analytics'}).isDisabled().then(assert.ok);await v.keyboard.press('Shift+Tab');assert.equal(await v.evaluate(()=>document.activeElement.textContent),'Save preferences');await v.keyboard.press('Tab');assert.equal(await v.evaluate(()=>document.activeElement.textContent),'Close preferences');if(screenshotDir&&[320,1440].includes(width))await v.screenshot({path:path.join(screenshotDir,`cmp-${width}-${colorScheme}.png`)});await v.keyboard.press('Escape');assert.equal(await v.evaluate(()=>document.activeElement.textContent),'Manage cookies');if(screenshotDir){await v.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});await v.screenshot({path:path.join(screenshotDir,`radovar-${width}-${colorScheme}.png`),fullPage:true});}await visual.close();}
 await pageCatalogRegression();await referralBoundary();assert.deepEqual(errors,[]);console.log(`PASS Radovar integration: ${events.size} T1-validated events; twelve pages + 404; route/back/hash/rerender; consent/cross-tab/disabled/storage/API outage; real blocked/held/throwing SDK and bootstrap exception; pending receipt/revoke UI race; eight visual combinations; native referral with available/missing referrer and separate consent${prefix?' BASE_PATH='+prefix:''}`);
 }
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
