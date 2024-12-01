document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('overlay');
    const exploreButton = document.getElementById('explore-button');
    const header = document.querySelector('header'); // Ambil elemen header

    // Nonaktifkan scrolling
    document.body.style.overflow = 'hidden';

    // Tambahkan event listener ke tombol Explore
    exploreButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Aktifkan kembali scrolling

        // Mulai animasi header
        header.classList.remove('header-paused');
        header.classList.add('header-running');

        // Mulai animasi elemen lainnya
        const animatedElements = document.querySelectorAll('.paused');
        animatedElements.forEach((el) => {
            el.classList.remove('paused');
        });
    });
});



    // Variabel global
    const canvas = document.getElementById('grafikCanvas');
    const ctx = canvas.getContext('2d');
    const coordinatesDiv = document.getElementById('coordinates');
    const width = canvas.width;
    const height = canvas.height;
    const scale = 20; // 1 unit = 20px
    const originX = width / 2;
    const originY = height / 2;
    let roots = [];
    let yIntercept = null;
    let peaks = [];
    let compiledFunction = null;
    let animationX = -10; // Awal dari animasi

    // Fungsi menggambar sumbu
    function drawAxes() {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
  
      // Gambar grid (garis-garis pola)
      ctx.strokeStyle = '#ccc'; // Warna garis grid
      ctx.lineWidth = 0.5;
      
      // Garis vertikal (grid X)
      for (let x = -10; x <= 10; x++) {
          const canvasX = originX + x * scale;
          ctx.beginPath();
          ctx.moveTo(canvasX, 0);
          ctx.lineTo(canvasX, height);
          ctx.stroke();
      }
  
      // Garis horizontal (grid Y)
      for (let y = -10; y <= 10; y++) {
          const canvasY = originY - y * scale;
          ctx.beginPath();
          ctx.moveTo(0, canvasY);
          ctx.lineTo(width, canvasY);
          ctx.stroke();
      }
  
      // Gambar sumbu utama
      ctx.strokeStyle = '#333'; // Warna garis utama
      ctx.lineWidth = 1;
  
      // Sumbu X
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();
  
      // Sumbu Y
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();
  
      // Gambar label angka pada sumbu X
      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
      for (let x = -10; x <= 10; x++) {
          const canvasX = originX + x * scale;
          if (x !== 0) { // Hindari menggambar label di tengah
              ctx.fillText(x, canvasX - 5, originY + 15);
          }
      }
  
      // Gambar label angka pada sumbu Y
      for (let y = -10; y <= 10; y++) {
          const canvasY = originY - y * scale;
          if (y !== 0) { // Hindari menggambar label di tengah
              ctx.fillText(y, originX + 5, canvasY + 5);
          }
      }
  }
  


    drawAxes();
    // Fungsi menggambar grafik dengan animasi
    function animateGraph() {
        ctx.clearRect(0, 0, width, height);
        drawAxes();

        // Gambar kurva sampai titik animasiX
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let started = false;

        for (let x = -10; x <= animationX; x += 0.1) {
            const y = compiledFunction.evaluate({ x });
            const canvasX = originX + x * scale;
            const canvasY = originY - y * scale;

            if (!started) {
                ctx.moveTo(canvasX, canvasY);
                started = true;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }
        ctx.stroke();

        // Perbarui posisi animasi
        if (animationX < 10) {
            animationX += 0.1;
            requestAnimationFrame(animateGraph); // Lanjutkan animasi
        } else {
            // Setelah selesai, tambahkan titik potong dan titik puncak
            drawRoots(roots);
            drawYIntercept(yIntercept);
            drawPeaks(peaks);
        }
    }

    // Fungsi menggambar grafik (memulai animasi)
    function drawGraph() {
        // Reset posisi animasi
        animationX = -10;

        // Ambil ekspresi fungsi
        const inputExpression = document.getElementById('functionInput').value;

        // Kompilasi fungsi
        try {
            compiledFunction = math.compile(inputExpression);
        } catch (error) {
            alert("Ekspresi fungsi tidak valid!");
            return;
        }

        // Temukan akar, titik potong y, dan titik puncak
        roots = findRoots(compiledFunction);
        yIntercept = findYIntercept(compiledFunction);
        peaks = findPeaks(math.derivative(inputExpression, 'x'));

        // Mulai animasi
        animateGraph();

        // JavaScript untuk Kalkulator
        function Kalkulator() {
        const input = document.getElementById("functionInput").value;
        const resultDiv = document.getElementById("result");
      
        // Regex untuk mengekstrak koefisien a, b, dan c
        const regex = /([+-]?\d*\.?\d*)x\^2\s*([+-]?\d*\.?\d*)x\s*([+-]?\d*\.?\d*)/;
        const match = input.replace(/\s+/g, '').match(regex);
      
        if (!match) {
            resultDiv.textContent = "Harap masukkan fungsi dalam format ax² + bx + c yang valid.";
            return;
        }
      
        const a = parseFloat(match[1]) || 1; // Default ke 1 jika tidak ada a
        const b = parseFloat(match[2]) || 0; // Default ke 0 jika tidak ada b
        const c = parseFloat(match[3]) || 0; // Default ke 0 jika tidak ada c
      
        const D = b * b - 4 * a * c;
        let solusi = "";
      
        solusi += `<p>Langkah Penyelesaian:</p>`;
        solusi += `<p>1. Hitung diskriminan: D = b² - 4ac</p>`;
        solusi += `<p>&emsp; D = ${b}² - 4 * ${a} * ${c}</p>`;
        solusi += `<p>&emsp; D = ${D}</p>`;
      
        const x_v = -b / (2 * a);
        const y_v = a * x_v * x_v + b * x_v + c;
        solusi += `<p>2. Titik balik (vertex) dari fungsi kuadrat adalah: (${x_v.toFixed(2)}, ${y_v.toFixed(2)})</p>`;
      
        if (D > 0) {
            const x1 = (-b + Math.sqrt(D)) / (2 * a);
            const x2 = (-b - Math.sqrt(D)) / (2 * a);
            solusi += "<p>3. Karena D > 0, persamaan memiliki dua akar nyata:</p>";
            solusi += `<p>&emsp; x₁ = (-b + √D) / 2a = (${ -b } + √${D}) / ${2 * a} = ${x1.toFixed(2)}</p>`;
            solusi += `<p>&emsp; x₂ = (-b - √D) / 2a = (${ -b } - √${D}) / ${2 * a} = ${x2.toFixed(2)}</p>`;
            solusi += `<p>Jadi, akar-akar persamaan adalah x₁ = ${x1.toFixed(2)} dan x₂ = ${x2.toFixed(2)}</p>`;
        } else if (D === 0) {
            const x = -b / (2 * a);
            solusi += "<p>3. Karena D = 0, persamaan memiliki satu akar:</p>";
            solusi += `<p>&emsp; x = -b / 2a = ${ -b } / ${2 * a} = ${x.toFixed(2)}</p>`;
        } else {
            solusi += "<p>3. Karena D < 0, persamaan tidak memiliki akar real.</p>";
        }
      
        resultDiv.innerHTML = solusi; // Pastikan menampilkan solusi di sini
        resultDiv.style.display = "block";
    }
    Kalkulator();
}
    

    // Temukan akar
    function findRoots(compiledFunction) {
        const roots = [];
        for (let x = -10; x <= 10; x += 0.1) {
            const y1 = compiledFunction.evaluate({ x });
            const y2 = compiledFunction.evaluate({ x: x + 0.1 });
            if (y1 * y2 < 0) {
                roots.push(x);
            }
        }
        return roots;
    }

    // Temukan titik potong y
    function findYIntercept(compiledFunction) {
        return compiledFunction.evaluate({ x: 0 });
    }

    // Temukan titik puncak
    function findPeaks(derivativeFunction) {
        const peaks = [];
        for (let x = -10; x <= 10; x += 0.1) {
            const slope1 = derivativeFunction.evaluate({ x });
            const slope2 = derivativeFunction.evaluate({ x: x + 0.1 });
            if (slope1 * slope2 < 0) {
                const peakX = x + (slope1 / (slope1 - slope2)) * 0.1;
                const peakY = compiledFunction.evaluate({ x: peakX });
                peaks.push({ x: peakX, y: peakY });
            }
        }
        return peaks;
    }

    // Gambar akar
    function drawRoots(roots) {
        ctx.fillStyle = 'red';
        roots.forEach(root => {
            const canvasX = originX + root * scale;
            ctx.beginPath();
            ctx.arc(canvasX, originY, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // Gambar titik potong y
    function drawYIntercept(yIntercept) {
        const canvasY = originY - yIntercept * scale;
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(originX, canvasY, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Gambar titik puncak
    function drawPeaks(peaks) {
        ctx.fillStyle = 'orange';
        peaks.forEach(peak => {
            const canvasX = originX + peak.x * scale;
            const canvasY = originY - peak.y * scale;
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    
 // Event listener kursor
 canvas.addEventListener('mousemove', event => {
    const rect = canvas.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
    const xMath = (cursorX - originX) / scale;
    const yMath = (originY - cursorY) / scale;
  
    if (compiledFunction) {
        const evaluatedY = compiledFunction.evaluate({ x: xMath });
  
        // Periksa kedekatan dengan titik potong x
        const closeToRoot = roots.find(root => Math.abs(root - xMath) < 0.2);
        if (closeToRoot !== undefined) {
            coordinatesDiv.innerHTML = `Koordinat (titik potong x): (x: ${closeToRoot.toFixed(2)}, y: 0)`;
            return;
        }
  
        // Periksa kedekatan dengan titik potong y
        if (Math.abs(yMath - yIntercept) < 0.2 && Math.abs(xMath) < 0.2) {
            coordinatesDiv.innerHTML = `Koordinat (titik potong y): (x: 0, y: ${yIntercept.toFixed(2)})`;
            return;
        }
  
        // Periksa kedekatan dengan titik puncak
        const closeToPeak = peaks.find(peak => Math.abs(peak.x - xMath) < 0.2 && Math.abs(peak.y - yMath) < 0.2);
        if (closeToPeak) {
            coordinatesDiv.innerHTML = `Koordinat (titik puncak): (x: ${closeToPeak.x.toFixed(2)}, y: ${closeToPeak.y.toFixed(2)})`;
            return;
        }
  
        // Periksa kedekatan dengan kurva
        if (xMath <= animationX && Math.abs(yMath - evaluatedY) < 0.2) {
            coordinatesDiv.innerHTML = `Koordinat: (x: ${xMath.toFixed(2)}, y: ${evaluatedY.toFixed(2)})`;
        } else {
            coordinatesDiv.innerHTML = `Koordinat: (x: -, y: -)`;
        }
    }
  });
  


