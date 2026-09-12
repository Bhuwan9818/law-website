
// Hover Animation with GSAP
// document.querySelectorAll(".sidebar ul li").forEach(item => {
//     item.addEventListener("mouseenter", () => {
//         gsap.to(item, { scale: 1.07, duration: 0.5 });
//     });

//     item.addEventListener("mouseleave", () => {
//         gsap.to(item, { scale: 1, duration: 0.2 });
//     });
// });

document.getElementById('show-more-liaison-btn').onclick = function () {
  document.querySelector('.more-liaison').classList.toggle('d-none');
  this.innerHTML = this.textContent === 'More...' 
    ? '<i class="fa fa-chevron-up" style="margin-right: 6px;"></i>Less...' 
    : '<i class="fa fa-chevron-down" style="margin-right: 6px;"></i>More...';
};

document.getElementById('show-more-right-btn').onclick = function () {
  document.querySelector('.more-right-1').classList.toggle('d-none');
  this.innerHTML = this.textContent === 'More...' 
    ? '<i class="fa fa-chevron-up" style="margin-right: 6px;"></i>Less...' 
    : '<i class="fa fa-chevron-down" style="margin-right: 6px;"></i>More...';
};