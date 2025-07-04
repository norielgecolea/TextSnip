const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const outputText = document.getElementById('outputText');
const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
let uploadedImage = null;

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    uploadedImage = reader.result;
    imagePreview.innerHTML = `<img src="${uploadedImage}" alt="Preview" />`;
  };
  reader.readAsDataURL(file);
});

extractBtn.addEventListener('click', () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  outputText.textContent = "Processing...";
  Tesseract.recognize(uploadedImage, 'eng', {
    logger: m => console.log(m),
  }).then(({ data: { text } }) => {
    outputText.textContent = text || "No text found.";
  });
});

copyBtn.addEventListener('click', () => {
  const text = outputText.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Text copied to clipboard!");
  });
});
