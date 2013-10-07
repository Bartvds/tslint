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
        return this.applyWithWalker(new BlockWalker(syntaxTree));
    };
    Rule.FAILURE_STRING = "block is empty";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;

var BlockWalker = (function (_super) {
    __extends(BlockWalker, _super);
    function BlockWalker() {
        _super.apply(this, arguments);
    }
    BlockWalker.prototype.visitBlock = function (node) {
        var hasCommentAfter = node.openBraceToken.trailingTrivia().hasComment();
        var hasCommentBefore = node.closeBraceToken.leadingTrivia().hasComment();

        if (node.statements.childCount() <= 0 && !hasCommentAfter && !hasCommentBefore) {
            var position = this.position() + node.leadingTriviaWidth();
            var width = node.width();
            this.addFailure(this.createFailure(position, width, Rule.FAILURE_STRING));
        }

        _super.prototype.visitBlock.call(this, node);
    };
    return BlockWalker;
})(Lint.RuleWalker);

