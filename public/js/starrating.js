(function (d, t, e, m) {

    // Async Rating-Widget initialization.
    window.RW_Async_Init = function () {

        RW.init({
            beforeRate: (rating, vote) => {
                // alert("Checking");
                if (!Cookies.get('userName')) {
                    alert("Please login before rating.");
                    return false;
                }
                return true;
            },
            huid: "381081",
            uid: "54fb0be2a925ffb881dbeca0d908b038",
            source: "website",
            options: {
                "size": "tiny",
                "style": "oxygen",
                "isDummy": false
            }
        });
        RW.render();

        RW.init('54fb0be2a925ffb881dbeca0d908b038', {
            beforeRate: (rating, vote) => {
                // alert("Checking");
                if (!Cookies.get('userName')) {
                    alert("Please login before rating.");
                    return false;
                }
                return true;
            }
        });
    };
    // Append Rating-Widget JavaScript library.
    var rw, s = d.getElementsByTagName(e)[0],
        id = "rw-js",
        l = d.location,
        ck = "Y" + t.getFullYear() +
        "M" + t.getMonth() + "D" + t.getDate(),
        p = l.protocol,
        f = ((l.search.indexOf("DBG=") > -1) ? "" : ".min"),
        a = ("https:" == p ? "secure." + m + "js/" : "js." + m);
    if (d.getElementById(id)) return;
    rw = d.createElement(e);
    rw.id = id;
    rw.async = true;
    rw.type = "text/javascript";
    rw.src = p + "//" + a + "external" + f + ".js?ck=" + ck;
    s.parentNode.insertBefore(rw, s);
}(document, new Date(), "script", "rating-widget.com/"));