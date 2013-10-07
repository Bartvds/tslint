var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new NoConsoleWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "access forbidden to console property";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;

var NoConsoleWalker = (function (_super) {
    __extends(NoConsoleWalker, _super);
    function NoConsoleWalker() {
        _super.apply(this, arguments);
    }
    NoConsoleWalker.prototype.visitInvocationExpression = function (node) {
        var options = this.getOptions();
        var expression = node.expression;

        if (expression.kind() === TypeScript.SyntaxKind.MemberAccessExpression && expression.childCount() >= 3) {
            var firstToken = expression.firstToken();
            var secondToken = expression.childAt(1);
            var thirdToken = expression.childAt(2);

            if (firstToken.text() === "console" && secondToken.kind() === TypeScript.SyntaxKind.DotToken && options.indexOf(thirdToken.fullText()) !== -1) {
                var position = this.position() + node.leadingTriviaWidth();
                this.addFailure(this.createFailure(position, expression.width(), Rule.FAILURE_STRING));
            }
        }

        _super.prototype.visitInvocationExpression.call(this, node);
    };
    return NoConsoleWalker;
})(Lint.RuleWalker);

