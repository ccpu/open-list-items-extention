var isAttached;
var links;
var orgbrd;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (!isAttached) {
        attach();
        isAttached = true;
    } else {
        detach();
        isAttached = false;
    }
});

function attach() {
    var trg;
    var allElms = $("body *");
    allElms.on("mouseover.myextension", function (e) {
        trg = $(e.target);
        if (trg.closest(".toKindleBtns").length)
            return;
        trg.addClass("myextensionsHighlights");
    });
    allElms.on("mouseout.myextension", function (e) {
        if (!trg)
            return;
        trg.removeClass("myextensionsHighlights");
        trg = null;
    });

    links = $("body").find("a");
    links.on("click.myextension", function (e) {
        e.preventDefault();
        var elm = $(this);
        allElms.removeClass("myextensionsHighlights");
        var link = elm.closest("a");
        var path = traverseUp(link[0]);
        var domLinks = $(path);
        var validLinks = [];
        var selectedRect = elm[0].getBoundingClientRect();

        domLinks.each(function () {
            var rect = this.getBoundingClientRect();
            if (this.href && !~validLinks.indexOf(this.href) && (rect.left === selectedRect.left || (rect.width === selectedRect.width))) {
                validLinks.push(this.href);
            }
        });

        chrome.runtime.sendMessage(validLinks);
        detach();
        isAttached = false;
    });

}
function traverseUp(el) {
    var elm = $(el);
    var eq = "";
    //if (elm.is(".isOriginalElement"))
    //    eq = ':eq(' + elm.index() + ')';
    var result = el.tagName.toLowerCase() + eq,
        pare = elm.parent()[0];

    if (pare.tagName !== undefined && pare.tagName !== 'BODY') {
        result = [traverseUp(pare), result].join('>');
    }

    return result;
};
function lookupElementByXPath(path) {
    var evaluator = new XPathEvaluator();
    var result = evaluator.evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}
function detach() {
    $("body *").off(".myextension").removeClass("myextensionsHighlights");
}