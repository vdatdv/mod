/

* ASTUTE FF OB55 BY MOD SKIN FF - FISH MOD Z

* Shadowrocket Script Runner (Surge / Loon / QuanX / SR compatible)
  \*/

async function main() {
let response = \$response;
let request = \$request;

```
// Phân tích URL và path
let urlObj = new URL(request.url);
if (!urlObj.pathname.startsWith('/live')) {
    $done({ body: response.body });
    return;
}

try {
    let metaRes = await fetch('https://version.freefire.info/public/smeta');
    let meta = await metaRes.json();

    // Kiểm tra xem host có nằm trong danh sách vh hay không
    if (!meta.vh || !meta.vh.includes(urlObj.host)) {
        $done({ body: response.body });
        return;
    }

    // Thay đổi trường server_url trong response JSON
    let bodyJson = JSON.parse(response.body);
    bodyJson.server_url = meta.s_url;

    $done({ body: JSON.stringify(bodyJson) });
} catch (err) {
    // Nếu có lỗi mạng hoặc parse JSON, giữ nguyên response gốc
    $done({ body: response.body });
}

```

}

main();