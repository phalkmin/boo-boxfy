bbD.panel = function () {
    var d = parseFloat(bbD.version),
        c = $('<div id="boobox-links" class="postbox"><div id="boobox-preferences"><h3 class="hndle"><span>boo-box </span></h3></div><div id="booPanelContent"></div></div>'),
        e = $("#bb-custom-editform"),
        b = $('<div id="booManual" style="display:none"><h4>Manual</h4><span id="bb-manual-content"></span></div>'),
        a = $('<div id="booAuto" style="display:none"><h4>Autolink</h4><ul id="boobox-links-content"></ul></div>');
    if (d >= 2.7) {
        $("#post-status-info").after(c)
    } else {
        $("#editorcontainer").after(c);
        c.addClass("wpunrounded");
        e.css("background-color", "#EAF3FA")
    }
    $("#booPanelContent", c).append(b).append(a).append(e);
    e.show()
};
