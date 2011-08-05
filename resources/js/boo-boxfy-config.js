jQuery(document).ready(function ()
{
    jQuery("#boo_mail_options").submit()
});

var $booaffid;

var bb_callOptions = function bb_callOptions(d, a)
{
    $booaffid = a;

    var b = document.createElement("script");
    b.src = "http://boo-box.com/profile/login?jsoncallback=bb_pushAffiliates&format=json&boomail=" + d;
    b.type = "text/javascript";

    var c = document.getElementsByTagName("head").item(0);
    c.appendChild(b);

    c = null
    b = null;
};

var bb_pushAffiliates = function bb_pushAffiliates(e)
{
    select = document.getElementById("boo_booaffid");
    select.innerHTML = "";
    var b = document.createElement("option");
    b.value = "0";
    b.innerHTML = "--- " + booboxfyL10n.selectone + " ---";
    select.appendChild(b);
    for (shop in e.shoplist)
    {
        for (var c = 0, a = e.shoplist[shop].bids.length; c < a; c++)
        {
            var d = document.createElement("option");
            d.value = e.shoplist[shop].bids[c][0] + "=" + e.shoplist[shop].bids[c][2];
            d.innerHTML = e.shoplist[shop].bname + " (" + e.shoplist[shop].bids[c][1] + ")";
            (e.shoplist[shop].bids[c][0] == $booaffid) ? d.selected = "selected" : "";
            select.appendChild(d)
        }
    }
};

var bb_callOptions_withbid = function bb_callOptions_withbid(d, a)
{
    $booaffid = a;
    var b = document.createElement("script");
    b.src = "http://boo-box.com/profile/login?jsoncallback=bb_innerAffiliate&format=json&boomail=" + d + "&getlastbid=1";
    b.type = "text/javascript";
    var c = document.getElementsByTagName("head").item(0);
    c.appendChild(b)
};

var bb_innerAffiliate = function bb_innerAffiliate(a)
{
    var b = document.getElementById("boo_booaffid");
    var g = document.getElementById("boo_boolastformat");
        g.innerHTML = '<input name="boo_boolastformat" type="hidden" value="' + a.lastformat + '" />'
    if (a.shop && a.lastbid)
    {
        b.innerHTML = a.shop._name + (a.shop._code ? ' (' + a.shop._code + ')' : '') + '<input name="boo_booaffid" type="hidden" value="' + a.lastbid + '=pt-BR" />'
    }
    else
    {
        b.innerHTML = "Please, config your affiliate program"
    }
};

var bb_mailform = function bb_mailform()
{
    $ = jQuery.noConflict();

    var a = $("#boo_mail_options"),
        d = $("#boo_boomail"),
        c = $("#boo_updateid"),
        b = $('<span id="bbmail_info"></span>');

    d.after(b);

    a.submit(function()
    {
        d.attr("disabled", "disabled");
        c.attr("disabled", "disabled");

        b.html("");

        var e = "http://boo-box.com/profile/login?jsoncallback=?&format=json&boomail=" + $("#boo_boomail").val();

        e += "&getlastbid=" + ($("#boo_advanced_options").length != 0 ? "1" : "0");

        $.getJSON(e, function (f)
        {
            d.removeAttr("disabled");
            c.removeAttr("disabled");

            if ( ! f.error)
            {
                if (typeof f.userid != "undefined")
                {
                    b.html(" Ok!");

                    $("#boo_booid").val(f.userid);
                    $("#boo_advanced_button, .button-primary").show();

                    $("#boo_advanced_options input[name=boo_booid]").val(f.userid);
                    $("#boo_advanced_options input[name=boo_boomail]").val(f.email);

										bb_callOptions_withbid(f.email, f.lastbid);
                }
                else
                {
                    b.html('<br />Usuário não existente. Verifique se seu e-mail é o mesmo cadastrado na boo-box.<br />Tente novamente ou <a href="http://boo-box.com/site/setup/signup" target="_blank">crie sua conta</a>.');

                    $("#boo_booid").val('');
                    $("#boo_advanced_options, #boo_advanced_button, .button-primary").hide();

                    document.getElementById("boo_booaffid").innerHTML = '';
                }
            }
        });

        return false
    })
};
