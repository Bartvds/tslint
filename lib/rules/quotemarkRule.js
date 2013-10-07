var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var QuoteMark;
(function (QuoteMark) {
    QuoteMark[QuoteMark["SINGLE_QUOTES"] = 0] = "SINGLE_QUOTES";
    QuoteMark[QuoteMark["DOUBLE_QUOTES"] = 1] = "DOUBLE_QUOTES";
})(QuoteMark || (QuoteMark = {}));

var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.isEnabled = function () {
        if (_super.prototype.isEnabled.call(this)) {
            var quoteMarkString = this.getOptions()[0];
            return (quoteMarkString === "single" || quoteMarkString === "double");
        }

        return false;
    };

    Rule.prototype.apply = function (syntaxTree) {
        var quoteMark;
        var quoteMarkString = this.getOptions()[0];
        var sourceUnit = syntaxTree.sourceUnit();

        if (quoteMarkString === "single") {
            quoteMark = QuoteMark.SINGLE_QUOTES;
        } else {
            quoteMark = QuoteMark.DOUBLE_QUOTES;
        }

        return this.applyWithWalker(new QuoteWalker(syntaxTree, quoteMark));
    };
    Rule.SINGLE_QUOTE_FAILURE = "\" should be '";
    Rule.DOUBLE_QUOTE_FAILURE = "' should be \"";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;

var QuoteWalker = (function (_super) {
    __extends(QuoteWalker, _super);
    function QuoteWalker(syntaxTree, quoteMark) {
        _super.call(this, syntaxTree);
        this.quoteMark = quoteMark;
    }
    QuoteWalker.prototype.visitToken = function (token) {
        this.handleToken(token);
        _super.prototype.visitToken.call(this, token);
    };

    QuoteWalker.prototype.handleToken = function (token) {
        var failure = null;
        if (token.kind() === TypeScript.SyntaxKind.StringLiteral) {
            var fullText = token.fullText();
            var width = token.width();
            var position = this.position() + token.leadingTriviaWidth();

            var textStart = token.leadingTriviaWidth();
            var textEnd = textStart + width - 1;
            var firstCharacter = fullText.charAt(textStart);
            var lastCharacter = fullText.charAt(textEnd);

            if (this.quoteMark === QuoteMark.SINGLE_QUOTES) {
                if (firstCharacter !== "'" || lastCharacter !== "'") {
                    failure = this.createFailure(position, width, Rule.SINGLE_QUOTE_FAILURE);
                }
            } else if (this.quoteMark === QuoteMark.DOUBLE_QUOTES) {
                if (firstCharacter !== "\"" || lastCharacter !== "\"") {
                    failure = this.createFailure(position, width, Rule.DOUBLE_QUOTE_FAILURE);
                }
            }
        }

        if (failure) {
            this.addFailure(failure);
        }
    };
    return QuoteWalker;
})(Lint.RuleWalker);

