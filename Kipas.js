async function onRequest(context, request) {
    return request;
}

async function onResponse(context, response) {
    if (!response.url.includes('/live') && !response.url.includes('/player') && !response.url.includes('/inventory')) {
        return response;
    }

    try {
        let body = response.body;
        if (typeof body === 'string') {
            let data = JSON.parse(body);
            
            // Can thiệp dữ liệu phản hồi (mod skin / server_url)
            if (data.server_url) {
                data.server_url = "https://version.freefire.info/public/smeta";
            }
            
            response.body = JSON.stringify(data);
        }
    } catch (e) {
        // Bỏ qua nếu không phải JSON chuẩn
    }

    return response;
}
```[cite: 1]

---

### 2. File `.conf` hoàn chỉnh đã gán sẵn link Raw của bạn
*(Sau khi bạn up file lên GitHub và lấy link dạng `[https://raw.githubusercontent.com/](https://raw.githubusercontent.com/)...`, bạn dán vào phần `script-path=` dưới đây)*:

```ini
[General]
bypass-tun = 10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
skip-proxy = 127.0.0.1,localhost,apple.com,icloud.com
dns-server = 223.5.5.5, 8.8.8.8
ipv6 = true
udp-relay = true

[Rule]
FINAL,DIRECT

[URL Rewrite]
# Chuyển hướng domain từ Kipas
https://loginbp\.ppmainecoonghj\.com/(.+) https://loginbp.ggbluepanda.com/$1 302
https://clientbp\.ppmainecoonghj\.com/(.+) https://clientbp.ggbluepanda.com/$1 302
https://client\.us\.freefiremobile\.com/(.+) https://clientbp.ggbluepanda.com/$1 302

[Script]
# Đã trỏ thẳng tới file script.js trên git của bạn
game_mod = type=http-response,pattern=^https?:\/\/.+freefiremobile\.com\/(live|player|inventory),script-path=https://raw.githubusercontent.com/TEN_TAI_KHOAN/TEN_REPO/main/script.js,requires-body=1

[MITM]
skip-server-cert-verify = true
hostname = *.freefiremobile.com, *.ppmainecoonghj.com, *.ggbluepanda.com
```[cite: 1, 2]

*(Chỉ cần thay `TEN_TAI_KHOAN`, `TEN_REPO` và nhánh `main` bằng đúng đường dẫn Raw thực tế từ tài khoản GitHub của bạn là Shadowrocket sẽ tự động tải và chạy script mượt mà).*