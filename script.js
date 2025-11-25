(function () {
    const img = document.getElementById('cristopher_face');
    if (!img) return;

    const maxTilt = 10;

    function handleMove(e) {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const relX = (x - centerX) / centerX;
        const relY = (y - centerY) / centerY;

        const rotateY = relX * maxTilt;
        const rotateX = -relY * maxTilt;

        img.style.transform =
            `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function resetTilt() {
        img.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    }

    img.addEventListener('mousemove', handleMove);
    img.addEventListener('mouseleave', resetTilt);
})();