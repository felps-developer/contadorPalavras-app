// script.js

function countWords(text) {
    // Lógica para contar palavras
    // Este é um exemplo simples; você pode personalizar conforme necessário
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.length;
}

function processPdf(file, resultDiv, fileName) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const content = event.target.result;

        // Convertendo o conteúdo binário para texto usando TextDecoder
        const text = new TextDecoder('utf-8').decode(content);

        // Lógica para contar páginas e parágrafos
        let pageCount = 0;
        let paragraphCount = 0;

        // Lógica para contar palavras no conteúdo
        let wordCount = countWords(text);

        // Lógica para perguntar ao usuário o valor de cada palavra e parágrafo
        let wordValue = parseFloat(prompt('Qual é o valor de cada palavra?'));
        let paragraphValue = parseFloat(prompt('Qual é o valor de cada parágrafo?'));

        // Usando pdf.js para obter o número de páginas
        pdfjsLib.getDocument({ data: content }).promise.then(pdfDoc => {
            const numPages = pdfDoc.numPages;
            console.log('Número de páginas:', numPages);

            // Lógica para calcular o valor total
            let totalValue = wordValue * wordCount + paragraphValue * paragraphCount;
            resultDiv.innerHTML = `
                <p>Arquivo: ${fileName}</p>
                <p>Páginas: ${numPages}</p>
                <p>Parágrafos: ${paragraphCount}</p>
                <p>Palavras: ${wordCount}</p>
                <p>Valor Total: ${totalValue}</p>`;
            // Lógica para excluir o arquivo após o processamento
            URL.revokeObjectURL(file);
        }).catch(error => {
            console.error('Erro ao processar arquivo PDF:', error);
        });
    };

    reader.readAsArrayBuffer(file);
}

function processDocx(file, resultDiv, fileName) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const blob = new Blob([arrayBuffer]);
        const reader = new FileReader();
        reader.onload = function (event) {
            const content = event.target.result;

            // Lógica para contar páginas e parágrafos
            let pageCount = 0;
            let paragraphCount = content.split('\n\n').length;

            // Lógica para contar palavras no conteúdo
            let wordCount = countWords(content);

            // Lógica para perguntar ao usuário o valor de cada palavra e parágrafo
            let wordValue = parseFloat(prompt('Qual é o valor de cada palavra?'));
            let paragraphValue = parseFloat(prompt('Qual é o valor de cada parágrafo?'));

            // Lógica para calcular o valor total
            let totalValue = wordValue * wordCount + paragraphValue * paragraphCount;
            resultDiv.innerHTML = `
                <p>Arquivo: ${fileName}</p>
                <p>Páginas: ${pageCount}</p>
                <p>Parágrafos: ${paragraphCount}</p>
                <p>Palavras: ${wordCount}</p>
                <p>Valor Total: ${totalValue}</p>`;
            // Lógica para excluir o arquivo após o processamento
            URL.revokeObjectURL(file);
        };
        reader.readAsText(blob);
    };

    reader.readAsArrayBuffer(file);
}

function processFile() {
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    const file = fileInput.files[0];

    if (!file) {
        resultDiv.textContent = 'Por favor, selecione um arquivo.';
        return;
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
        resultDiv.textContent = 'Por favor, selecione um arquivo PDF ou DOCX.';
        return;
    }

    if (fileExtension === 'pdf') {
        processPdf(file, resultDiv, fileName);
    } else if (fileExtension === 'docx') {
        processDocx(file, resultDiv, fileName);
    }
}
