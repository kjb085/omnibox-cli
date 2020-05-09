/**
 * Temp admin
 */
const editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

// Update text editor
getFromStorage(['keywordObjects'], (result) => {
    editor.insert(JSON.stringify(result.keywordObjects, null, 4));

    editor.resize();
});

document.getElementById('save').addEventListener('click', () => {
    let keywordObjects = JSON.parse(editor.getValue());

    if (!isArray(keywordObjects)) {
        alert('Keyword objects must be an array of objects');
        return;
    }

    saveKeywordObjects(keywordObjects);
});
