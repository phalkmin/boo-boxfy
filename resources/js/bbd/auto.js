bbD.auto = {
    lang: {
        logar: "você precisa se logar para usar",
        profile: "opções",
        nocontent: "nenhum conteudo para inserir links da boo-box",
        markall: "Marcar todos",
    },
    init: function () {
        $("#booAuto").show();
        this.tag.update();
        this.tag.init_watch()
    },
    helpers: {
        get_editor: function () {
            var b = null,
                a = null,
                c = null;
            if (document.getElementById("content_parent")) {
                if (document.getElementById("content_parent").style.display !== "none") {
                    b = document.getElementById("content_ifr").contentWindow
                } else {
                    c = $("#content:first").get(0)
                }
            } else {
                c = $("#content:first").get(0)
            }
            a = (b || c) ? (b) ? {
                element: b.document.body,
                property: "innerHTML",
                type: "RTE",
                win: b
            } : {
                element: c,
                property: "value",
                type: c.tagName.toLowerCase(),
                win: null
            } : {
                element: null,
                property: null,
                type: null,
                win: null
            };
            return a
        },
        getRoot: function () {
            var a = this.get_editor();
            return a.element
        },
        get_dom: function () {
            var a = null,
                e = null,
                c = null,
                b = this.get_editor();
            e = (b.type == "RTE") ? $(b.element.cloneNode(true)) : null;
            if (!e) {
                c = document.createElement("div");
                if (b.element !== null) {
                    a = b.element[b.property]
                }
                if (a !== undefined && a !== null && this._saveNewlines) {
                    a = a.replace(this.nlRegex, this.nlrep)
                }
                c.innerHTML = (a) ? a : "";
                e = $(c)
            }
            return e
        },
        get_html: function (b) {
            var c = this.get_dom(b);
            var a = c ? $.trim(c.html()) : "";
            return a
        },
        _close_tags: function (f, c) {
            var d, b = "",
                g = ["img", "br", "hr", "meta", "link", "input", "param", "area", "col"],
                e = ["embed"],
                a = [];
            a = c === "1" ? g.concat(e) : e;
            d = arguments.callee["r" + c] = arguments.callee["r" + c] || new RegExp("<(" + a.join("|") + ")([^>]*)>", "gi");
            b = f.replace(d, function (j, h, i) {
                while (" /".indexOf(i.slice(-1)) >= 0 && i.length > 0) {
                    i = i.substr(0, i.length - 1)
                }
                return $.grep(g, function (k) {
                    return k === h.toLowerCase()
                })[0] ? "<" + h + i + " />" : "<" + h + i + "></" + h + ">"
            });
            return b
        },
        trimNl: function (a) {
            return a.replace(/[\n\r]+/g, "")
        },
        set_html: function (c, g) {
            var b = c.length;
            if (c === null || typeof c === "undefined") {
                return
            }
            if (c && this.saveNewlines) {
                c = c.replace(this.nlRegex, "").replace(this.nlrepRegex, this.nl)
            }
            c = this._close_tags(c);
            var e = this.get_editor(),
                f = null,
                a = null;
            if (e.element) {
                if (e.type === "RTE") {
                    var d = bbD.auto.cursor.getBookmark();
                    a = e.element;
                    f = this.create_fragment(c, a.ownerDocument);
                    if (e.win) {
                        e.win.document.ignoreDOMevents = true
                    }
                    while (a.firstChild) {
                        a.removeChild(a.firstChild)
                    }
                    a.appendChild(f);
                    if (e.win) {
                        e.win.document.ignoreDOMevents = false
                    }
                    if (g) {
                        bbD.auto.cursor.moveToBookmark(d)
                    }
                }
            }
            bbD.auto.control._last_count1 = c.length
        },
        getParent: function (d, c, b) {
            var a;
            var d = this.get_editor();
            var b = this.getRoot();
            if (typeof(c) == "string") {
                a = c.toUpperCase();
                c = function (f) {
                    var e = false;
                    if (f.nodeType == 1 && a === "*") {
                        e = true;
                        return false
                    }
                    $.each(a.split(","), function (g) {
                        if (f.nodeType == 1 && (f.nodeName.toUpperCase() == g)) {
                            e = true;
                            return false
                        }
                    });
                    return e
                }
            }
            while (d) {
                if (d == b) {
                    return null
                }
                if (c(d)) {
                    return d
                }
                d = d.parentNode
            }
            return null
        },
        create_fragment: function (c, d) {
            this;
            d = d || document;
            var e = true,
                b = d.createDocumentFragment(),
                a = d.createElement("div"),
                f = null;
            a.innerHTML = "|" + c;
            while (a.childNodes.length) {
                f = a.childNodes[0];
                if (f.nodeType === 3 && e) {
                    f.nodeValue = f.nodeValue.substr(1);
                    if (f.nodeValue === "") {
                        a.removeChild(f);
                        continue
                    }
                }
                b.appendChild(f);
                e = false
            }
            return b
        }
    },
    cursor: {
        getBookmark: function () {
            var u = bbD.auto.helpers.get_editor();
            var b = this.getRng();
            var o, q, p, m, g, d, a, n = -16777215,
                v, k = u.element,
                i = 0,
                j = 0,
                l;
            var f = this._getViewPort(u.win);
            q = f.x;
            p = f.y;
            m = this.getNode();
            v = this.getSel();
            if (!v) {
                return null
            }
            if (m && m.nodeName == "IMG") {
                return {
                    scrollX: q,
                    scrollY: p
                }
            }
            function h(s, y, e) {
                var c = u.win.document.createTreeWalker(s, NodeFilter.SHOW_TEXT, null, false),
                    z, t = 0,
                    x = {};
                while ((z = c.nextNode()) != null) {
                    if (z == y) {
                        x.start = t
                    }
                    if (z == e) {
                        x.end = t;
                        return x
                    }
                    t += bbD.auto.helpers.trimNl(z.nodeValue || "").length
                }
                return null
            }
            if (v.anchorNode == v.focusNode && v.anchorOffset == v.focusOffset) {
                m = h(k, v.anchorNode, v.focusNode);
                if (!m) {
                    return {
                        scrollX: q,
                        scrollY: p
                    }
                }
                bbD.auto.helpers.trimNl(v.anchorNode.nodeValue || "").replace(/^\s+/, function (c) {
                    i = c.length
                });
                return {
                    start: Math.max(m.start + v.anchorOffset - i, 0),
                    end: Math.max(m.end + v.focusOffset - i, 0),
                    scrollX: q,
                    scrollY: p,
                    beg: v.anchorOffset - i == 0
                }
            } else {
                m = h(k, b.startContainer, b.endContainer);
                if (!m) {
                    return {
                        scrollX: q,
                        scrollY: p
                    }
                }
                return {
                    start: Math.max(m.start + b.startOffset - i, 0),
                    end: Math.max(m.end + b.endOffset - j, 0),
                    scrollX: q,
                    scrollY: p,
                    beg: b.startOffset - i == 0
                }
            }
        },
        moveToBookmark: function (i) {
            var j = bbD.auto.helpers.get_editor();
            var a = this.getRng();
            var k = this.getSel();
            var e = bbD.auto.helpers.getRoot();
            var h, c, f;

            function d(b, m, A) {
                var y = j.win.document.createTreeWalker(b, NodeFilter.SHOW_TEXT, null, false),
                    s, l = 0,
                    x = {},
                    q, z, u, t;
                while ((s = y.nextNode()) != null) {
                    u = t = 0;
                    f = s.nodeValue || "";
                    c = bbD.auto.helpers.trimNl(f).length;
                    l += c;
                    if (l >= m && !x.startNode) {
                        q = m - (l - c);
                        if (i.beg && q >= c) {
                            continue
                        }
                        x.startNode = s;
                        x.startOffset = q + t
                    }
                    if (l >= A) {
                        x.endNode = s;
                        x.endOffset = A - (l - c) + t;
                        return x
                    }
                }
                return null
            }
            if (!i) {
                return false
            }
            j.win.scrollTo(i.scrollX, i.scrollY);
            if (!k) {
                return false
            }
            if (i.rng) {
                k.removeAllRanges();
                k.addRange(i.rng)
            } else {
                if ((typeof(i.start) !== "undefined") && (typeof(i.end) !== "undefined")) {
                    try {
                        h = d(e, i.start, i.end);
                        if (h) {
                            a = j.win.document.createRange();
                            a.setStart(h.startNode, h.startOffset);
                            a.setEnd(h.endNode, h.endOffset);
                            k.removeAllRanges();
                            k.addRange(a)
                        }
                        j.win.focus()
                    } catch (g) {}
                }
            }
        },
        getRng: function () {
            var b = bbD.auto.helpers.get_editor();
            var c = this.getSel(),
                d;
            try {
                if (c) {
                    d = c.rangeCount > 0 ? c.getRangeAt(0) : (c.createRange ? c.createRange() : b.win.document.createRange())
                }
            } catch (a) {}
            if (!d) {
                d = b.win.document.createRange()
            }
            return d
        },
        getSel: function () {
            var b = bbD.auto.helpers.get_editor();
            var a = b.win;
            return a.getSelection()
        },
        getNode: function () {
            var a = bbD.auto.helpers.get_editor(),
                c = this.getRng(),
                b = this.getSel(),
                d;
            if (!c) {
                return bbD.auto.helpers.getRoot()
            }
            d = c.commonAncestorContainer;
            if (!c.collapsed) {
                if (c.startContainer == c.endContainer) {
                    if (c.startOffset - c.endOffset < 2) {
                        if (c.startContainer.hasChildNodes()) {
                            d = c.startContainer.childNodes[c.startOffset]
                        }
                    }
                }
            }
            return bbD.auto.helpers.getParent(d, function (e) {
                return e.nodeType == 1
            })
        },
        _getViewPort: function (c) {
            var e, a;
            e = c.document;
            a = this.boxModel ? e.documentElement : e.body;
            return {
                x: c.pageXOffset || a.scrollLeft,
                y: c.pageYOffset || a.scrollTop,
                w: c.innerWidth || a.clientWidth,
                h: c.innerHeight || a.clientHeight
            }
        },
        setScroll: function (c, a, b) {
            var d = a.selectionStart + b;
            if (c.element.createTextRange) {
                var a = c.element.createTextRange();
                a.move("character", d);
                a.select()
            } else {
                if (c.element.selectionStart) {
                    c.element.focus();
                    c.element.setSelectionRange(d, d)
                }
            }
            c.scrollTop = a.scrollTop
        }
    },
    control: {},
    tag: {
        init_watch: function () {
            bbD.auto.control._last_count1 = $.trim(bbD.auto.helpers.get_dom().html()).length;
            bbD.auto.control._last_count2 = $.trim(bbD.auto.helpers.get_dom().text()).length;
            bbD.auto.control._watch_callback = this.update;
            setInterval(function () {
                bbD.auto.tag._watch()
            }, 1000)
        },
        _watch: function () {
            var b = $.trim(bbD.auto.helpers.get_dom().html()).length,
                a = $.trim(bbD.auto.helpers.get_dom().text()).length,
                d = Math.abs(b - bbD.auto.control._last_count1),
                c = Math.abs(a - bbD.auto.control._last_count2);
            if (d > 0) {
                bbD.auto.control._last_count1 = b
            }
            if (c > 10) {
                bbD.auto.control._last_count2 = a;
                this.update()
            }
        },
        update: function (d) {
            this._enabled = false;
            var c = bbD.auto.helpers.get_dom(),
                b = $.trim(c.text()),
                a = {
                    method: "boobox.suggest",
                    callback: "none",
                    format: "json",
                    contents: b
                };
            this._enabled = true;
            bbD.auto.post("http://boo-box.com/auto", a, this._success)
        },
        _success: function (transport) {
            try {
                var response = eval(transport)
            } catch (er) {
                return
            }
            if (!response) {
                return
            }
            this._lastresponse = response;
            if (response.status == "ok") {
                setTimeout(function () {
                    bbD.auto.tag._setupLink("", response)
                }, Math.floor(Math.random() * 200))
            }
        },
        _setupLink: function (d, c) {
            $("#boobox-links-content").html("");
            for (var e = 0; e < c.item.length; e++) {
                var j = c.item[e].name;
                var g = $('<li><a href="">' + j + "</a></li>");
                g.click(function () {
                    bbD.auto.tag._toggleText($(this));
                    return false
                });
                var h = bbD.auto.helpers.get_dom();
                var f = $("a:contains(" + j + ")", h);
                if (typeof(f[0]) != "undefined") {
                    g.addClass("selected")
                } else {
                    if (typeof($("span[class=bbused]:contains(" + j + ")", h)[0]) == "undefined") {
                        this._toggleText(g)
                    }
                }
                if ($("#boobox-links-content li a")) {
                    $("#boobox-links-content").show()
                }
                $("#boobox-links-content").append(g)
            }
            if (c.item.length > 0) {
                if (typeof($("#markall")[0]) == "undefined") {
                    $("#boobox-links-content").before($('<a href="javascript:void(0);" class="button" id="markall">' + bbD.auto.lang.markall + "</a>").click(function () {
                        $("#boobox-links-content li").each(function () {
                            bbD.auto.tag._toggleText($(this), true)
                        });
                        return false
                    }))
                }
            }
        },
        _toggleText: function (h, a) {
            var j = h.text(),
                c = bbD.auto.helpers.get_dom(),
                e = $("a:contains(" + j + ")", c),
                g = $("span[class=bbused]:contains(" + j + ")", c),
                f = c.html();
            var i = bbD.format,
                d = bbD.bid;
            if (a) {
                h.removeClass("selected");
                e.after('<span class="bbused">' + j + "</span>");
                e.remove();
                f = c.html()
            }
            if (typeof(e[0]) != "undefined" && !a) {
                h.removeClass("selected");
                e.after('<span class="bbused">' + j + "</span>");
                e.remove();
                f = c.html()
            } else {
                var b = '<a href="http://sledge.boo-box.com/list/page/' + Base64.encode(j + "_##_" + i + "_##_boo-boxfy-auto_##_" + d) + '" class="bbli">' + j + '<img src="http://boo-box.com/bbli" alt="[bb]" class="bbic" /></a>';
                if (typeof(g[0]) != "undefined") {
                    g.after(b);
                    g.remove();
                    f = c.html()
                } else {
                    f = f.replace(j, b)
                }
                h.addClass("selected")
            }
            bbD.auto.helpers.set_html(f, true)
        }
    },
    post: function (a, b, c) {
        $.ajax({
            url: a + "?jsonp=?",
            dataType: "jsonp",
            jsonp: "jsonp_callback",
            data: b,
            success: c
        })
    },
    _saveNewlines: $.browser.msie,
    nl: ($.browser.msie ? "\r\n" : "\n"),
    nlrep: $('<div><br class="boobox-bogus" /></div>').html()
};
