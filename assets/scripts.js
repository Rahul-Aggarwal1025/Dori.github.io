// Shared interaction scripts for Dori
document.addEventListener('DOMContentLoaded', function(){
  // Modal close on Esc
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      var modal = document.getElementById('modal');
      if(modal) modal.style.display = 'none';
    }
  });

  // Render shop/product pages if present
  if(document.querySelector('#products-root')){
    fetch('/data/products.json').then(r=>r.json()).then(renderProducts).catch(()=>{});
  }

  if(document.querySelector('#product-root')){
    fetch('/data/products.json').then(r=>r.json()).then(renderProduct).catch(()=>{});
  }
});

function openModal(src, caption){
  var el = document.getElementById('modal-img') || document.getElementById('img-large');
  var cap = document.getElementById('modal-caption') || document.getElementById('img-caption');
  var wrapper = document.getElementById('modal') || document.getElementById('img-modal');
  if(el) el.src = src;
  if(cap) cap.textContent = caption || '';
  if(wrapper) wrapper.style.display = 'flex';
}

function closeModal(){
  var wrapper = document.getElementById('modal') || document.getElementById('img-modal');
  var el = document.getElementById('modal-img') || document.getElementById('img-large');
  if(wrapper) wrapper.style.display = 'none';
  if(el) el.src = '';
}

// compatibility helpers matching index.js naming
function openImgModal(src, caption){ openModal(src, caption); }
function closeImgModal(){ closeModal(); }

function openRegModal(){ var r = document.getElementById('reg-modal'); if(r) { r.style.display='flex'; var f = document.getElementById('name'); if(f) f.focus(); } }
function closeRegModal(){ var r = document.getElementById('reg-modal'); if(r) { r.style.display='none'; } }

function renderProducts(products){
  var root = document.querySelector('#products-root');
  if(!root) return;
  root.innerHTML = '';
  var grid = document.createElement('div');
  grid.className = 'products-grid';
  products.forEach(function(p){
    var card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = '<a href="/product.html?id='+encodeURIComponent(p.id)+'"><img src="'+p.image+'" alt="'+escapeHtml(p.name)+'"></a>'+
      '<div class="meta"><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:700">'+escapeHtml(p.name)+'</div><div class="badge">₹'+p.price+'</div></div><div class="muted" style="margin-top:8px">'+escapeHtml(p.short)+'</div></div>';
    grid.appendChild(card);
  });
  root.appendChild(grid);
}

function renderProduct(products){
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var p = products.find(function(x){return String(x.id) === String(id);}) || products[0];
  var root = document.querySelector('#product-root');
  if(!root) return;
  root.innerHTML = '<div style="display:grid;grid-template-columns:320px 1fr;gap:18px;align-items:start">'+
    '<div><img src="'+p.image+'" style="width:100%;border-radius:10px;object-fit:cover"><div style="margin-top:10px" class="muted">Artisan: '+escapeHtml(p.artisan)+'</div></div>'+
    '<div><h2 style="margin-top:0">'+escapeHtml(p.name)+'</h2><div class="badge">₹'+p.price+'</div><p class="muted" style="margin-top:12px">'+escapeHtml(p.description)+'</p><div style="margin-top:14px"><a class="btn" href="mailto:hello@dori.org?subject=Order%20for%20'+encodeURIComponent(p.name)+'">Contact to order</a></div></div>'+
    '</div>';
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// close modal with ESC
document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ closeModal(); var r = document.getElementById('reg-modal'); if(r && r.style.display==='flex') closeRegModal(); } });
