
/*
 * FISH MOD Z - Shadowrocket
 * HTTP Response Script
 */

(function () {
  'use strict';

  function finishUnchanged(message) {
    if (message) {
      console.log('[FISH MOD Z] ' + message);
    }
    $done({});
  }

  var requestUrl =
    (typeof $request !== 'undefined' && $request.url) || '';

  var parts = /^https?:\/\/([^\/?#]+)(\/[^?#]*)?/i.exec(requestUrl);

  if (!parts) {
    return finishUnchanged('Invalid request URL');
  }

  var host = parts[1].replace(/:\d+$/, '').toLowerCase();
  var path = parts[2] || '/';

  if (path.indexOf('/live') !== 0) {
    return finishUnchanged('Not a live endpoint');
  }

  if (
    typeof $response === 'undefined' ||
    typeof $response.body !== 'string'
  ) {
    return finishUnchanged('Missing response body');
  }

  $httpClient.get(
    {
      url: 'https://version.freefire.info/public/smeta',
      timeout: 5
    },
    function (error, response, body) {
      if (error || !body) {
        return finishUnchanged('Metadata request failed');
      }

      try {
        var metadata = JSON.parse(body);

        if (
          !metadata ||
          !Array.isArray(metadata.vh) ||
          metadata.vh.indexOf(host) === -1 ||
          typeof metadata.s_url !== 'string' ||
          !metadata.s_url
        ) {
          return finishUnchanged('Invalid metadata or host');
        }

        var original = JSON.parse($response.body);

        if (
          !original ||
          typeof original !== 'object' ||
          Array.isArray(original)
        ) {
          return finishUnchanged('Invalid response JSON');
        }

        original.server_url = metadata.s_url;

        console.log(
          '[FISH MOD Z] server_url modified for ' + host
        );

        $done({
          body: JSON.stringify(original)
        });

      } catch (e) {
        finishUnchanged('Error: ' + e.message);
      }
    }
  );
})();
