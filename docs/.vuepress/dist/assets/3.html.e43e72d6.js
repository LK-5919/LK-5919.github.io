import{_ as n,o as s,c as a,a as p}from"./app.33147c80.js";const t={},e=p(`<h1 id="websocket-\u901A\u7528\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#websocket-\u901A\u7528\u914D\u7F6E" aria-hidden="true">#</a> WebSocket \u901A\u7528\u914D\u7F6E</h1><h2 id="\u57FA\u7840\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u57FA\u7840\u914D\u7F6E" aria-hidden="true">#</a> \u57FA\u7840\u914D\u7F6E</h2><p><code>websocket.js</code></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@description</span> websocket\u8FDE\u63A5
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">options</span>
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>url</span> websocket\u5730\u5740
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token operator">?</span><span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>onOpenEventName</span> \u8FDE\u63A5\u6210\u529F\u65F6\u6D3E\u53D1\u7684\u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token operator">?</span><span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>onMessageEventName</span> \u63A5\u6536\u5230\u6D88\u606F\u65F6\u6D3E\u53D1\u7684\u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token operator">?</span><span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>pingInterval</span> \u53D1\u9001\u5FC3\u8DF3\u7684\u65F6\u95F4\u95F4\u9694
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token operator">?</span><span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>getPingInfoFn</span> \u53D1\u9001\u5FC3\u8DF3\u7684\u81EA\u5B9A\u4E49\u6570\u636E\u51FD\u6570
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token operator">?</span><span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>reconnectCount</span> \u81EA\u52A8\u91CD\u8FDE\u6B21\u6570
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token operator">?</span><span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>count</span> \u5F53\u524D\u91CD\u8BD5\u6B21\u6570
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Boolean<span class="token operator">?</span><span class="token punctuation">}</span></span> <span class="token parameter">options<span class="token punctuation">.</span>isAutoPing</span> \u662F\u5426\u53D1\u9001\u5FC3\u8DF3
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> socket
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createSocket</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  url<span class="token punctuation">,</span>
  onOpenEventName <span class="token operator">=</span> <span class="token string">&#39;onWSOpen&#39;</span><span class="token punctuation">,</span>
  onMessageEventName <span class="token operator">=</span> <span class="token string">&#39;onMessageWS&#39;</span><span class="token punctuation">,</span>
  pingInterval <span class="token operator">=</span> <span class="token number">10000</span><span class="token punctuation">,</span>
  <span class="token function-variable function">getPingInfoFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  reconnectCount <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">,</span>
  count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span>
  isAutoPing <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> Socket <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> setIntervalWebsocketPush <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> isCloseByMySelf <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> reconnecting <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> WebSocket <span class="token operator">===</span> <span class="token string">&#39;undefined&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">&#39;\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301socket&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  Socket <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebSocket</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Socket<span class="token punctuation">.</span>onopen <span class="token operator">=</span> onOpenWS<span class="token punctuation">;</span>
  Socket<span class="token punctuation">.</span>onmessage <span class="token operator">=</span> onMessageWS<span class="token punctuation">;</span>
  Socket<span class="token punctuation">.</span>onclose <span class="token operator">=</span> onCloseWS<span class="token punctuation">;</span>
  Socket<span class="token punctuation">.</span>onerror <span class="token operator">=</span> onErrorWS<span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">onOpenWS</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    window<span class="token punctuation">.</span><span class="token function">dispatchEvent</span><span class="token punctuation">(</span>
      <span class="token keyword">new</span> <span class="token class-name">CustomEvent</span><span class="token punctuation">(</span>onOpenEventName<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">detail</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">isOpen</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
          <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token string">&#39;\u8FDE\u63A5\u6210\u529F\uFF01&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    isAutoPing <span class="token operator">&amp;&amp;</span> <span class="token function">sendPing</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">onErrorWS</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    Socket <span class="token operator">&amp;&amp;</span> Socket<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">clearInterval</span><span class="token punctuation">(</span>setIntervalWebsocketPush<span class="token punctuation">)</span><span class="token punctuation">;</span>
    window<span class="token punctuation">.</span><span class="token function">dispatchEvent</span><span class="token punctuation">(</span>
      <span class="token keyword">new</span> <span class="token class-name">CustomEvent</span><span class="token punctuation">(</span>onOpenEventName<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">detail</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">isOpen</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
          <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token string">&#39;\u8FDE\u63A5\u5931\u8D25\uFF01&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isCloseByMySelf <span class="token operator">&amp;&amp;</span> count <span class="token operator">&lt;</span> reconnectCount <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>reconnecting<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      reconnecting <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      Socket <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token function">createSocket</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          url<span class="token punctuation">,</span>
          onOpenEventName<span class="token punctuation">,</span>
          onMessageEventName<span class="token punctuation">,</span>
          pingInterval<span class="token punctuation">,</span>
          getPingInfoFn<span class="token punctuation">,</span>
          reconnectCount<span class="token punctuation">,</span>
          <span class="token literal-property property">count</span><span class="token operator">:</span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span>
          isAutoPing
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">onMessageWS</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    window<span class="token punctuation">.</span><span class="token function">dispatchEvent</span><span class="token punctuation">(</span>
      <span class="token keyword">new</span> <span class="token class-name">CustomEvent</span><span class="token punctuation">(</span>onMessageEventName<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">detail</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">data</span><span class="token operator">:</span> e<span class="token punctuation">.</span>data<span class="token punctuation">,</span>
          <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;\u8FD9\u662F\u6765\u81EA\u670D\u52A1\u7AEF\u7684\u6570\u636E&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">connecting</span><span class="token punctuation">(</span><span class="token parameter">message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>Socket <span class="token operator">&amp;&amp;</span> Socket<span class="token punctuation">.</span>readyState <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">connecting</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        Socket<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">sendWSPush</span><span class="token punctuation">(</span><span class="token parameter">message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Socket <span class="token operator">&amp;&amp;</span> Socket<span class="token punctuation">.</span>readyState <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      Socket<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>Socket <span class="token operator">&amp;&amp;</span> Socket<span class="token punctuation">.</span>readyState <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">connecting</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">onCloseWS</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">clearInterval</span><span class="token punctuation">(</span>setIntervalWebsocketPush<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isCloseByMySelf <span class="token operator">&amp;&amp;</span> count <span class="token operator">&lt;</span> reconnectCount <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>reconnecting<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      reconnecting <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      Socket <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token function">createSocket</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          url<span class="token punctuation">,</span>
          onOpenEventName<span class="token punctuation">,</span>
          onMessageEventName<span class="token punctuation">,</span>
          pingInterval<span class="token punctuation">,</span>
          getPingInfoFn<span class="token punctuation">,</span>
          reconnectCount<span class="token punctuation">,</span>
          <span class="token literal-property property">count</span><span class="token operator">:</span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span>
          isAutoPing
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">sendPing</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    setIntervalWebsocketPush <span class="token operator">&amp;&amp;</span> <span class="token function">clearInterval</span><span class="token punctuation">(</span>setIntervalWebsocketPush<span class="token punctuation">)</span><span class="token punctuation">;</span>
    Socket<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token function">getPingInfoFn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    setIntervalWebsocketPush <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      Socket<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token function">getPingInfoFn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> pingInterval<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">closeWebsocket</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    isCloseByMySelf <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    Socket <span class="token operator">&amp;&amp;</span> Socket<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    Socket <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    sendWSPush<span class="token punctuation">,</span>
    closeWebsocket<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u4F7F\u7528" tabindex="-1"><a class="header-anchor" href="#\u4F7F\u7528" aria-hidden="true">#</a> \u4F7F\u7528</h2><p>\u5728 pinia \u4E2D\u4F7F\u7528</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defineStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;pinia&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSocket <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@/utils/websocket.js&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> useWebsocketStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&#39;websocket&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">state</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">socket</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">isOpen</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">hasData</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token literal-property property">actions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      url <span class="token operator">=</span> <span class="token string">&#39;ws://localhost:9991&#39;</span><span class="token punctuation">,</span>
      onOpenEventName <span class="token operator">=</span> <span class="token string">&#39;onOpen&#39;</span><span class="token punctuation">,</span>
      onMessageEventName <span class="token operator">=</span> <span class="token string">&#39;onMessageWS&#39;</span><span class="token punctuation">,</span>
      pingInterval <span class="token operator">=</span> <span class="token number">10000</span><span class="token punctuation">,</span>
      reconnectCount <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">,</span>
      count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>isOpen<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>socket <span class="token operator">=</span> <span class="token function">createSocket</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          url<span class="token punctuation">,</span>
          onOpenEventName<span class="token punctuation">,</span>
          onMessageEventName<span class="token punctuation">,</span>
          pingInterval<span class="token punctuation">,</span>
          getPingInfoFn<span class="token punctuation">,</span>
          reconnectCount<span class="token punctuation">,</span>
          count<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">send</span><span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>isOpen<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>socket<span class="token punctuation">.</span><span class="token function">sendWSPush</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token literal-property property">code</span><span class="token operator">:</span> <span class="token string">&#39;02&#39;</span><span class="token punctuation">,</span>
          <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">[</span>data<span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>socket<span class="token punctuation">.</span><span class="token function">closeWebsocket</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">getPingInfoFn</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> ping <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">code</span><span class="token operator">:</span> <span class="token string">&#39;03&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> ping<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> useWebsocketStore<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),o=[e];function c(l,i){return s(),a("div",null,o)}var k=n(t,[["render",c],["__file","3.html.vue"]]);export{k as default};
