# WXAudio
移动端音频播放器插件

###html 部分

```html
<div class="audio-box jbox paused" data-strip = "[7,8,10,15,10]">
    <audio preload src="148350676860.mp3"></audio>
    <div class="prev-strip"></div>
    <div class="play"></div>
    <div class="progress">
        <div class="progress-wrap">
            <span class="progress-bar"></span>
        </div>
    </div>
    <p class="duration">50''</p>
    <div class="next-strip"></div>
    <div class="speed-dropdown">
        <a href="" class="sd-toggle">1倍</a>
        <ul class="sd-menu">
            <li><a href="" data-speed = "1">1</a></li>
            <li><a href="" data-speed = "0.8">0.8</a></li>
            <li><a href="" data-speed = "0.5">0.5</a></li>
        </ul>
    </div>
</div>
```
data-strip音频每一段的时长。

###js部分
```javascript
$('.audio-box').weixinAudio();
```

###方法
play()
pause()
