(function () {
    tinymce.create("tinymce.plugins.BooBoxFy", {
        init: function (c, d) {
            cls = "mceBootag",
            isIE = $.browser.msie;
            c.onInit.add(function (e) {
                if (isIE) {
                    e.onNodeChange.add(function (i) {
                        return b.bookmark = (!i.selection.isCollapsed()) ? i.selection.getBookmark() : null
                    });
                    b.goToSelection = function f() {
                        return e.selection.moveToBookmark(b.bookmark)
                    }
                }
                b.set_html = function h(i) {
                    if (isIE) {
                        b.goToSelection()
                    }
                    var j = e.selection,
                        l = j.getNode(),
                        m = $(l),
                        k = (m.is("img")) ? m.parent() : m;
                    return (bbD.manual.checkBoobox(k)) ? k.replaceWith(i) : j.setContent(i)
                };
                b.control_html = function g() {
                    var i = e.selection,
                        k = i.getNode(),
                        l = $(k),
                        j = (l.is("img")) ? l.parent() : l;

                    return (bbD.manual.checkBoobox(j)) ? i.dom.getOuterHTML(j[0]) : i.getContent({format: "html"})
                }
            });
            c.addCommand("mceBootag", function () {
                bbD.manual._apply()
            });
            c.addButton("booboxfymce", {
                title: "monetize!",
                image: "http://static.boo-box.com/images/booboxfy-wp/booboxtag.png",
                cmd: cls
            });
            c.onNodeChange.add(function (f, e, h) {
                var g = f.selection.isCollapsed();
                e.get("booboxfymce").setDisabled(g);
                b.temp_html = (!g) ? b.control_html() : null;
                bbD.manual.nodeState(g)
            })
        },
        getInfo: function a() {
            return {
                longname: "boo-box Tagging Tool for boo-boxfy",
                author: "boo-box team",
                authorurl: "http://boo-box.com",
                infourl: "http://boo-box.com",
                version: "0.2"
            }
        }
    });
    tinymce.PluginManager.add("booboxfymce", tinymce.plugins.BooBoxFy);
    var b = tinymce.plugins.BooBoxFy
})();
