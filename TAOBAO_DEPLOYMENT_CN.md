# 淘宝售卖部署流程

## 1. 网页部署

把以下内容上传到 GitHub 仓库根目录：

```text
index.html
styles.css
app.js
admin.html
README.md
README_CN.md
assets/
worker/
.nojekyll
```

然后进入 GitHub 仓库：

```text
Settings → Pages → Deploy from a branch → main / root
```

最终用户访问地址一般是：

```text
https://你的用户名.github.io/仓库名/
```

## 2. 一次性访问码后台部署

进入 Cloudflare，准备 Worker + KV。命令如下：

```bash
cd worker
npm install -g wrangler
wrangler login
npx wrangler kv namespace create ACCESS_CODES
```

把命令输出的 namespace id 填到：

```text
worker/wrangler.toml
```

然后设置管理员密钥：

```bash
npx wrangler secret put ADMIN_TOKEN
```

最后部署：

```bash
npx wrangler deploy
```

## 3. 修改 app.js

把 `app.js` 里的配置改成：

```js
accessMode: "api",
apiBase: "你的 Cloudflare Worker 地址"
```

例如：

```js
accessMode: "api",
apiBase: "https://scl90-access-code-worker.xxx.workers.dev"
```

## 4. 管理访问码

打开：

```text
https://你的用户名.github.io/仓库名/admin.html
```

输入：

- Worker API 地址
- Admin Token

然后可以生成、导入、查看、导出访问码。

## 5. 淘宝发货流程

```text
用户淘宝下单
↓
你打开 admin.html
↓
复制一个 valid 状态访问码
↓
通过淘宝聊天发给用户
↓
用户扫码打开测评页面
↓
输入访问码
↓
后台把该码变成 used
↓
用户完成测评并下载 PDF 报告
```

## 6. 注意事项

- GitHub Pages 只能做静态网页，不能安全实现“一码一次”。一次性核销必须依赖 Worker 这样的后端。
- `admin.html` 可以公开，但 `ADMIN_TOKEN` 绝对不能泄露。
- Cloudflare KV 适合低并发手动售卖。如果未来订单很多、并发很高，建议改成 D1 或 Durable Objects，防止极端情况下同一码瞬时并发核销。
- 心理测评结果属于敏感信息，默认不要上传用户答题内容；如果未来保存报告，需要补充隐私政策、用户协议和删除机制。
