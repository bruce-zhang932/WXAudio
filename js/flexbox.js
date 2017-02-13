(function (doc, win) {
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange': 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        clientWidth >= 750 ? clientWidth = 750 : clientWidth;
        docEl.style.fontSize = 40 * (clientWidth / 750) + 'px';
    };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    recalc();
})(document, window);
    