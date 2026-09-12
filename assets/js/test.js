
// Hover Animation with GSAP
// document.querySelectorAll(".sidebar ul li").forEach(item => {
//     item.addEventListener("mouseenter", () => {
//         gsap.to(item, { scale: 1.07, duration: 0.5 });
//     });

//     item.addEventListener("mouseleave", () => {
//         gsap.to(item, { scale: 1, duration: 0.2 });
//     });
// });

const liaisonBtn = document.getElementById('show-more-liaison-btn');
if (liaisonBtn) {
  liaisonBtn.onclick = function () {
    const el = document.querySelector('.more-liaison');
    if (el) el.classList.toggle('d-none');
    this.innerHTML = this.textContent.trim().startsWith('More') 
      ? '<i class="fa fa-chevron-up" style="margin-right: 6px;"></i>Less...' 
      : '<i class="fa fa-chevron-down" style="margin-right: 6px;"></i>More...';
  };
}

const rightBtn = document.getElementById('show-more-right-btn');
if (rightBtn) {
  rightBtn.onclick = function () {
    const el = document.querySelector('.more-right-1');
    if (el) el.classList.toggle('d-none');
    this.innerHTML = this.textContent.trim().startsWith('More') 
      ? '<i class="fa fa-chevron-up" style="margin-right: 6px;"></i>Less...' 
      : '<i class="fa fa-chevron-down" style="margin-right: 6px;"></i>More...';
  };
}