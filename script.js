document.querySelectorAll(".accordion-item").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const panel=btn.nextElementSibling;
    const open=panel.classList.toggle("open");
    if(open){panel.style.maxHeight=panel.scrollHeight+"px"}else{panel.style.maxHeight=0}
  });
});
