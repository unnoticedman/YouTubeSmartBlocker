(function() {
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
      this.addEventListener('readystatechange', function() {
          if (this.readyState === 4 && /\\b(ad|ads|googleads|doubleclick|pagead|googlevideo)\\b/.test(url)) {
              Object.defineProperty(this, 'responseText', { value: '{}' });
              Object.defineProperty(this, 'status', { value: 200 });
          }
      });
      originalXHROpen.apply(this, arguments);
  };
})();
