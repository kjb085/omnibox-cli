/**
 * Temp admin
 */
const editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

chrome.storage.sync.get(['keywordHierarchy'], (result) => {
    editor.insert(JSON.stringify(result.keywordHierarchy, null, 4));

    editor.resize();
});

document.getElementById('save').addEventListener('click', () => {
    let keywordHierarchy = JSON.parse(editor.getValue());

    saveKeywordHierarchy(keywordHierarchy);
});
