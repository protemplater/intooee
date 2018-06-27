
export function interpolateCSS(str, params) {
    return str.replace(/{{([a-zA-Z]+)}}/gi, function (a, match) {
        return params[match];
    });
}

export function unloadStyle(id) {
    let styleNode = document.querySelector(`#${id}`);
    styleNode.parentNode.removeChild(styleNode);
}
export function loadStyle(name, ext, css1, params) {
    console.warn(`[data-name="${name}"][data-ext="${ext}"][type="less/intooee"]`);
    let css = document.querySelector(`[data-name="${name}"][data-ext="${ext}"][type="less/intooee"]`).innerHTML;
    let styleNode = document.querySelector(`[data-name="${name}"][data-ext="${ext}"][type="text/css"]`);
    if (!styleNode) {
        styleNode = document.createElement('style');
        styleNode.dataset.name = name;
        styleNode.dataset.ext = ext;
        styleNode.type = 'text/css';
        document.head.appendChild(styleNode);
    }
    if (params instanceof Array) {
        css = params.reduce(function (acc, param) {
            acc += interpolateCSS(css, param);
            return acc;
        }, '');
    } else {
        css = interpolateCSS(css, params);
    }
    styleNode.innerHTML = css;
    return styleNode;
}

export function setStyleData(name, ext, css, params) {
    loadStyle(name, ext, css, params); //id.replace(/\.+/g, '_')
}