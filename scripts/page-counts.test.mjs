import test from 'node:test';
import assert from 'node:assert/strict';
import { countPage, pageCountId, pageCountsUrl, referrerSource } from '../app/analytics/pageCounts.ts';
import { analyticsCollectorOrigin } from '../app/analytics/config.ts';

const origin = 'https://radovar.com';
const host = (navigator = {}) => {
  const calls = [];
  return { calls, navigator, fetch: (url, init) => { calls.push({ url, init, body: JSON.parse(init.body) }); return Promise.resolve({}); } };
};

test('the count goes to the collector origin the CSP already allows', () => {
  assert.equal(new URL(pageCountsUrl).origin, analyticsCollectorOrigin);
});

test('referrer is reduced to one coarse bucket', () => {
  assert.equal(referrerSource('', origin), 'direct');
  assert.equal(referrerSource('https://radovar.com/press/', origin), 'internal');
  assert.equal(referrerSource('https://www.google.com/', origin), 'search');
  assert.equal(referrerSource('https://github.com/x', origin), 'github');
  assert.equal(referrerSource('https://www.linkedin.com/feed', origin), 'social');
  assert.equal(referrerSource('https://perplexity.ai/', origin), 'ai');
  assert.equal(referrerSource('https://codevalanche.com/', origin), 'other');
});

test('known pages keep their id, articles get one from the path, anything else is other', () => {
  assert.equal(pageCountId('/', 'home'), 'home');
  assert.equal(pageCountId('/press/codevalanche-1-1-68/', 'not_found'), 'press_codevalanche_1_1_68');
  assert.equal(pageCountId('/wp-admin/', 'not_found'), 'other');
});

test('an outside arrival counts a page view and a visit; a route change only a page view', () => {
  const h = host();
  assert.deepEqual(countPage('/', 'home', 'search', h), ['page_view', 'visit']);
  assert.deepEqual(h.calls.map(c => c.body), [
    { p_site: 'radovar', p_page: 'home', p_metric: 'page_view', p_source: 'search', p_locale: 'en' },
    { p_site: 'radovar', p_page: 'home', p_metric: 'visit', p_source: 'search', p_locale: 'en' },
  ]);
  for (const { init } of h.calls) {
    assert.equal(init.credentials, 'omit');
    assert.equal(init.referrerPolicy, 'no-referrer');
    assert.deepEqual(Object.keys(init.headers).sort(), ['apikey', 'content-type']);
  }
  const inside = host();
  assert.deepEqual(countPage('/press/', 'press', 'internal', inside), ['page_view']);
});

test('privacy signals and automated browsers are not counted', () => {
  for (const navigator of [{ globalPrivacyControl: true }, { doNotTrack: '1' }, { webdriver: true }]) {
    const h = host(navigator);
    assert.deepEqual(countPage('/', 'home', 'direct', h), []);
    assert.equal(h.calls.length, 0);
  }
});
