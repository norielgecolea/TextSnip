document.addEventListener('DOMContentLoaded', () => {
      const imageUpload = document.getElementById('imageUpload');
      const uploadArea = document.getElementById('uploadArea');
      const imagePreview = document.getElementById('imagePreview');
      const extractBtn = document.getElementById('extractBtn');
      const outputText = document.getElementById('outputText');
      const copyBtn = document.getElementById('copyBtn');
      const status = document.getElementById('status');

      // Handle file upload
      imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();

          reader.onload = (event) => {
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image">`;
            imagePreview.style.display = 'block';
            extractBtn.disabled = false;
            status.textContent = 'Image loaded. Ready to extract text.';
          };

          reader.readAsDataURL(file);
        }
      });

      // Drag and drop functionality
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--gray)';
        uploadArea.style.backgroundColor = 'transparent';
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--gray)';
        uploadArea.style.backgroundColor = 'transparent';

        if (e.dataTransfer.files.length) {
          imageUpload.files = e.dataTransfer.files;
          const event = new Event('change');
          imageUpload.dispatchEvent(event);
        }
      });

      // Extract text button
      extractBtn.addEventListener('click', async () => {
        const image = imagePreview.querySelector('img');
        if (!image) return;

        extractBtn.disabled = true;
        status.textContent = 'Extracting text... (this may take a moment)';

        try {
          const { data: { text } } = await Tesseract.recognize(
            image.src,
            'eng',
            { logger: m => console.log(m) }
          );

          outputText.textContent = text;
          copyBtn.disabled = false;
          status.textContent = 'Text extraction complete!';
        } catch (error) {
          outputText.textContent = 'Error extracting text. Please try another image.';
          status.textContent = 'Error occurred';
          console.error(error);
        } finally {
          extractBtn.disabled = false;
        }
      });

      // Copy text button
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.textContent)
          .then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = 'Copy Text';
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });
      });
    });