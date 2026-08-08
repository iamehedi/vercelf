// Applies the saved theme before React mounts (avoids a dark-mode flash).
// Kept as a separate file so the production CSP can use script-src 'self'.
;(function () {
  try {
    var t = localStorage.getItem('theme')
    if (t !== 'light') document.documentElement.classList.add('dark')
  } catch {}
})()
