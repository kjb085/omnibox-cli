/**
 * Temp admin
 */
var getTextInput = function () {
    return document.getElementById('editor');
};

var editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

chrome.storage.sync.get(['keywordHierarchy'], function (result) {
    // getTextInput().innerHTML = JSON.stringify(result.keywordHierarchy, null, 4);
    editor.insert(JSON.stringify(result.keywordHierarchy, null, 4));

    editor.resize();
});

document.getElementById('save').addEventListener('click', function () {
    // var keywordHierarchy = JSON.parse(getTextInput().value);
    var keywordHierarchy = JSON.parse(editor.getValue());

    chrome.storage.sync.set({ keywordHierarchy: keywordHierarchy }, function (result) {
        // getTextInput().innerHTML = JSON.stringify(result.keywordHierarchy, null, 4);
        alert('Saved');
    });
});
