let uploading = false;
const buttons = document.querySelector('#buttons')

function showPreview() {
    const fileInput = document.querySelector('#file-enviar');
    const previewContainer = document.querySelector('#preview-container');
    const previewContainerContent = document.querySelector('#preview-container .content');
    const uploadDiv = document.querySelector('#file-drag-label')
    
    const contentInfo = document.querySelector('#preview-container .content-info')
    document.querySelector('#site-title').style.display = 'none'
    document.querySelector('.api-response').style.display = 'block'
    previewContainerContent.innerHTML = '';
    
    const file = fileInput.files[0];
    
    function formatFileSize(bytes) {
        if (bytes >= 1024 * 1024) {
          // tamanho em MB
          return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        } else if (bytes >= 1024) {
          // tamanho em KB
          return (bytes / 1024).toFixed(2) + ' KB';
        } else {
          // tamanho em bytes
          return bytes + ' bytes';
        }
      }
    
    
    function info() {
        
        for (let item in file) {
            if (['name', 'lastModifiedDate', 'size', 'type'].includes(item)) {
              const title = document.createElement('h3');
              const p = document.createElement('p');
              title.innerText = item;
        
              if (item === 'size') {
                p.innerText = formatFileSize(file[item]);
              } else {
                p.innerText = file[item];
              }
        
              title.append(p);
              contentInfo.appendChild(title);
            }
          }
    }
    
    if (file.type.startsWith('image/') || file.type === 'image/gif') {
        const img = document.createElement('img');
        
        info()
        
        img.style.maxWidth = '100%';
        img.style.width = '180px';
        img.style.borderRadius = '30px';
        img.onload = function () {
            URL.revokeObjectURL(img.src); // libera a url criada para o preview
        };
        img.src = URL.createObjectURL(file); // cria uma url temporária para o vídeo
        uploadDiv.style.display = 'none';
        previewContainer.style.display = 'flex';
        previewContainerContent.appendChild(img);
        
        buttons.style.display = 'flex';
        console.log(file)
        
    } else if (file.type === 'video/mp4') {
        uploadDiv.style.display = 'none';
        const video = document.createElement('video');
        info()
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '400px';
        video.style.width = '500px';
        video.style.borderRadius = '10px';
        video.style.background = 'black';
        video.style.height = '300px';
        video.onload = function () {
            URL.revokeObjectURL(video.src); // libera a url criada para o preview
        };
        video.src = URL.createObjectURL(file); // cria uma url temporária para o vídeo
        previewContainer.style.display = 'flex';
        previewContainerContent.appendChild(video);
        buttons.style.display = 'flex';
    }
}

function sendImages() {

    buttons.style.display = 'none';
    
    const response = document.querySelector('.response-url input')
    
    if (uploading) {
        alert("Upload em andamento. Por favor, aguarde.");
        return;
    }
    
    const imageFiles = document.getElementById('file-enviar')
        .files;
    if (imageFiles.length === 0) {
        alert("Selecione um arquivo para fazer o upload.");
        return;
    }
    
    const formData = new FormData();
    
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        formData.append('image', file);
    }
    document.querySelector('.api-response h3').innerText = 'Waiting server response...'
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/');
    
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            updateProgressBar(progress);
        }
    };
    
    xhr.onload = function () {
        let json_response = ''
        if (xhr.status === 200) {
            document.querySelector('.response-url').style.display = 'block';
            console.log('Upload concluído com sucesso!');
            json_response = JSON.parse(xhr.response)
            response.style.display = 'block';
            response.setAttribute('value', json_response.fileUrl)
            updateProgressBar(100);
            document.querySelector('.api-response h3')
                .innerText = 'Server response: '+json_response.message
            uploading = false;
        } else {
            json_response = JSON.parse(xhr.response)
            console.error('Erro ao enviar o arquivo.');
            updateProgressBar(0);
            document.querySelector('.api-response h3')
                .innerText = json_response.message + ';('
            alert('Erro ao enviar o arquivo')
            uploading = false;
        }
    };
    
    xhr.onerror = function () {
        console.error('Erro de conexão ou problema durante o upload.');
        uploading = false;
    };
    
    uploading = true
    xhr.send(formData);
}

document.getElementById('copyButton').addEventListener('click', () => {
  document.getElementById('inputText').select();
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  alert('A url foi copiada para a área de transferência!');
});


function updateProgressBar(progress) {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = progress + '%';
    progressBar.innerText = progress.toFixed(2) + '%'
}