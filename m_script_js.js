
/*
 * FISH MOD Z - Shadowrocket HTTP response script
 * Converted from the original JSON.
 */

(function () {
  'use strict';

  function finishUnchanged(message) {
    if (message) console.log('[FISH MOD Z] ' + message);
    $done({});
  }

  var requestUrl = ($request && $request.url) || '';
  var parts = /^https?:\/\/([^\/?#]+)(\/[^?#]*)?/i.exec(requestUrl);

  if (!parts) return finishUnchanged('Invalid request URL');

  var host = parts[1].replace(/:\d+$/, '').toLowerCase();
  var path = parts[2] || '/';

  if (path.indexOf('/live') !== 0) return $done({});

  if (!$response || typeof $response.body !== 'string') {
    return finishUnchanged('Missing response text');
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
          metadata.s_url.length === 0
        ) {
          return finishUnchanged('Host not authorized or metadata invalid');
        }

        var original = JSON.parse($response.body);

        if (
          !original ||
          typeof original !== 'object' ||
          Array.isArray(original)
        ) {
          return finishUnchanged('Unexpected response body format');
        }

        original.server_url = metadata.s_url;

        console.log('[FISH MOD Z] server_url modified for ' + host);

        $done({
          body: JSON.stringify(original)
        });

      } catch (e) {
        return finishUnchanged(
          'Cannot parse metadata/response JSON: ' + e.message
        );
      }
    }
  );
})();
