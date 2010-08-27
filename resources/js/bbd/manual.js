bbD.manual = {
    init: function () {
        this.setUserData();
        this.events()
    },
    setUserData: function () {
        bbD.format = "box";
        if ($("#poststuff input[name=publish]")[0] || $("#poststuff input[name=save]")[0]) {
            $.getJSON("http://boo-box.com/profile/login?jsoncallback=?&format=json&boomail=" + bbD.email, function (a)
            {
                if (a.lastformat != 0 && a.lastformat != null) {
                    bbD.format = a.lastformat
                }
            })
        }
    },
    events: function () {
        var a = this,
            b = true;
        $toolbar = $("#editor-toolbar");
        if (!$("#edButtonPreview", $toolbar).hasClass("active")) {
            a.monetizeButton()
        }
        $("a[id^=edButton]", $toolbar).click(function () {
            a._checkMonetize($(this));
            a.panel.off()
        });
        $("#bb-manual-tags").keypress(function (d) {
            var c = $(":submit");
            if (d.keycode == 13 || d.which == 13) {
                c.attr("onsubmit", "disabled");
                a._apply();
                return false
            } else {
                c.removeAttr("onsubmit")
            }
        })
    },
    monetizeOff: function () {
        return (!$("#edButtonPreview", $toolbar).hasClass("active")) ? false : true
    },
    monetizeButton: function () {
        var c = $("#bboxxy_btn");
        if (!c.attr("src") || c.attr("src") == "") {
            var a = this;
            $btn = $('<div><img src="" alt="monetize" id="bboxxy_btn" /></div>');
            $btn.click(function () {
                var d = a.getHTML();
                a.contentType()
            });
            var b = parseFloat(bbD.version);
            if (b >= 2.7) {
                if ($("#original_publish")[0]) {
                    $("#original_publish").before($btn);
                    $("img", $btn).attr("src", cfg.urlstatic + "/images/booboxfy-wp/monetize27.gif")
                }
            } else {
                if ($("#poststuff input[name=save]")[0]) {
                    $("#poststuff input[name=save]").before($btn);
                    $("img", $btn).attr("src", cfg.urlstatic + "/images/booboxfy-wp/monetize.gif")
                }
                $("#bb-custom-editform").css("background-color", "#EAF3FA")
            }
        }
        c.show()
    },
    _checkMonetize: function (b) {
        var a = $("#bboxxy_btn");
        if (b.attr("id") == "edButtonHTML") {
            this.monetizeButton()
        } else {
            a.hide()
        }
    },
    getHTML: function () {
        html = (this.monetizeOff()) ? tinymce.plugins.BooBoxFy.temp_html : this.getTextAreaHTML();
        return $.trim(html)
    },
    setHTML: function (a) {
        (this.monetizeOff()) ? tinymce.plugins.BooBoxFy.set_html(a) : this.setTextAreaHTML(a)
    },
    getSelPos: function () {
        var e = this.getTextArea(),
            c, d, f = e.value;
        if (document.selection) {
            var b = document.selection.createRange();
            var a = b.duplicate();
            if (b.text.length > 0) {
                a.moveToElementText(e);
                a.setEndPoint("EndToEnd", b);
                c = a.text.length - b.text.length;
                d = c + b.text.length
            }
        } else {
            c = e.selectionStart;
            d = e.selectionEnd
        }
        return {
            start: c,
            end: d,
            atext: f,
            area: e
        }
    },
    getTextArea: function () {
        return $("#content:first")[0]
    },
    getTextAreaHTML: function () {
        window.booboxpos = pos = this.getSelPos();
        var a = (pos.start != pos.end) ? pos.atext.substring(pos.start, pos.end) : alert("selecione um trecho do html para continuar");
        return a
    },
    setTextAreaHTML: function (a) {
        var c = window.booboxpos,
            b = tnext = "";
        b = c.atext.substring(0, c.start);
        tnext = c.atext.substring(c.end, c.atext.length);
        finalText = [b, a, tnext].join("");
        return c.area.value = finalText
    },
    nodeState: function (a) {
        return a ? this.panel.off() : this.contentType()
    },
    checkBoobox: function (a) {
        return a.is("a.bbli") && /^http:\/\/([^.]*\.)?boo-box.com/.test(a.attr('href'));
    },
    contentType: function () {
        var c = this.getHTML(), b;
        if (c.match(/\</gi) && c.match(/\>/gi)) {
            var a = $(c), d = this.checkBoobox(a);
            if (d && !(/(boo-boxfy-auto)/i.test(bbD.helpers.getToolByUrl($(c).attr("href"))))) {
                this.bbexists(a)
            } else {
                if (a.is("img") && !a.is("img.bbic")) {
                    this.panel.init({
                        html: c,
                        tag: false,
                        type: "img"
                    })
                } else {
                    this.panel.off()
                }
            }
        } else {
            this.panel.init({
                html: c,
                tag: false,
                type: "txt"
            })
        }
    },
    bbexists: function (c) {
        c.find("img.bbic").remove();
        c.find("img.bbused").removeClass("bbused");
        var b = c.html(), a = unescape((bbD.helpers.getTagsByUrl(c.attr("href"))).replace(/[+]/g, " "));
        this.panel.init({
            html: b,
            tag: a,
            type: ($(b).is("img")) ? "img" : "txt"
        });
        return this.focus = true
    },
    _apply: function () {
        var a = this.tag.makeCode("html");
        this.setHTML(a);
        this.panel.off()
    },
    panel: {
        init: function (c) {
            var b;
            switch (c.type) {
            case "img":
                this.on("imagem");
                var a = $(c.html)[0];
                b = (!c.tag) ? a.alt || a.href || "" : c.tag;
                break;
            default:
                this.on("link");
                b = (!c.tag) ? c.html : c.tag;
                break
            }
            $("#bb-manual-text").val(c.html);
            $("#bb-manual-tags").val(b)
        },
        on: function (a) {
            $("#bb-manual-content").html('<label for="bb-custom-tags">Tags de ' + a + ':</label><input type="hidden" name="bb-manual-text" id="bb-manual-text" /><input type="text" name="bb-manual-tags" id="bb-manual-tags" /><a href="javascript:void(0);" id="boopreview" class="button">Visualizar</a><a href="javascript:void(0);" id="booapply" class="button">Aplicar</a><br /><div id="bb-tt-simulation" style="display:none"><ul id="bb-tt-offerslist"></ul></div>');
            $("#booManual").slideDown();
            this.events()
        },
        off: function () {
            $("#booManual").slideUp();
            $("#bb-manual-content").html("")
        },
        events: function () {
            $("#boopreview").click(function () {
                $("#bb-tt-offerslist").html("Carregando...");
                var a = $("#bb-manual-tags");
                (a.val != "") ? bbD.manual.tag.simulate(a.val()) : alert("Digite uma tag");
                return false
            });
            $("#booapply").click(function () {
                bbD.manual._apply()
            })
        }
    },
    tag: {
        makeCode: function (c) {
            $tags = $("#bb-manual-tags").val();
            var e = {
                type: "text",
                val: $("#bb-manual-text").val()
            };
            noImage = (!$(e.val).is("img"));
            var a = new Object();
            a.format = (bbD.format != "null" && bbD.format != null && bbD.format != "0") ? bbD.format : "bar";
            a.tags = escape($tags).replace(/(\%20){1,}/gi, "+");
            a.alt = a.tags.replace(/\+/gi, " ");
            a.hash = Base64.encode(a.tags + "_##_" + a.format + "_##_tagging-tool-wp_##_" + bbD.bid);
            a.imageindicator = '<img src="' + cfg.url + 'bbli" alt="[bb]" class="bbic" />';
            a.text = '<a href="' + cfg.urle + "/list/page/" + a.hash + '" class="bbli">' + e.val + ((noImage) ? a.imageindicator : "") + "</a>";
            var b = a.text;
            var d = cfg.urle + "/list/page/" + a.hash;
            switch (c) {
            case "html":
                return b;
                break;
            case "url":
                return d;
                break
            }
        },
        simulate: function (i) {
            var g = $("#boopreview");
            var e = "bb-tt-";
            var a = $("#" + e + "simulation");
            var d;
            var f = function (k) {
                if (!a.is(":visible")) {
                    return
                }
                var r = false;
                $loadingoffers.hide();
                $offersnotloaded.hide();
                $offeritems.remove();
                if (k.products != null) {
                    if (k.products.length > 0) {
                        var r = true;
                        var m = '<li class="' + e + 'offeritem"><a href="#" class="' + e + 'offerlink"><span class="' + e + 'offerimage"></span><span class="' + e + 'offerdescription"><span class="' + e + 'offertitle"></span><span class="' + e + 'offerprice"></span></span></a></li>';
                        var q = k.products.length;
                        var p = 6;
                        var p = q < p ? q : p;
                        for (var l = 0; l < p; l++) {
                            var o = k.products[l];
                            var j = $(m);
                            $("span[class$=offerimage]", j).css("background-image", "url('" + o.img + "')");
                            $("span[class$=offertitle]", j).html(o.name);
                            $("span[class$=offerprice]", j).html(o.price);
                            $("span[class$=offertitle]", j).show();
                            var n = $("a[class$=offerlink]", j);
                            n.attr("href", o.url);
                            n.attr("title", o.name);
                            n.attr("target", "_blank");
                            $offerslist.append(j)
                        }
                        $offeritems = $("." + e + "offeritem").show();
                        $offeritems.show()
                    }
                }
                if (!r) {
                    $offersnotloaded = $("<li></li>").hide().addClass(e + "offersnotloaded").html((k.fail != undefined) ? "offers not loaded" : "no offers found");
                    $offerslist.append($offersnotloaded);
                    $offersnotloaded.fadeIn()
                }
            };
            $offerslist = $("#" + e + "offerslist");
            $loadingoffers = $("." + e + "loadingoffers", a);
            $offersnotloaded = $("." + e + "offersnotloaded", a);
            $offeritems = $("." + e + "offeritem");
            $offeritems.remove();
            $offersnotloaded.hide();
            var h = bbD.bid;
            var c = Base64.encode(i + "_##_simulation_##_tagging-tool_##_" + h);
            var b = cfg.urle + "/list/json/" + c + "?sinc=true&callback=?";
            $.getJSON(b, function (j) {
                $offerslist.html("");
                f(j)
            });
            a.show()
        }
    }
};
