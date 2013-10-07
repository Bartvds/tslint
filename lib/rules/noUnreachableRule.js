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
        return this.applyWithWalker(new UnreachableWalker(syntaxTree));
    };
    Rule.FAILURE_STRING = "unreachable code";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;

var UnreachableWalker = (function (_super) {
    __extends(UnreachableWalker, _super);
    function UnreachableWalker(syntaxTree) {
        _super.call(this, syntaxTree);
        this.hasReturned = false;
    }
    UnreachableWalker.prototype.visitNode = function (node) {
        if (this.hasReturned) {
            this.hasReturned = false;
            var position = this.position() + node.leadingTriviaWidth();
            this.addFailure(this.createFailure(position, node.width(), Rule.FAILURE_STRING));
        }

        _super.prototype.visitNode.call(this, node);
    };

    UnreachableWalker.prototype.visitBlock = function (node) {
        this.hasReturned = false;
        _super.prototype.visitBlock.call(this, node);
        this.hasReturned = false;
    };

    UnreachableWalker.prototype.visitCaseSwitchClause = function (node) {
        this.hasReturned = false;
        _super.prototype.visitCaseSwitchClause.call(this, node);
        this.hasReturned = false;
    };

    UnreachableWalker.prototype.visitDefaultSwitchClause = function (node) {
        this.hasReturned = false;
        _super.prototype.visitDefaultSwitchClause.call(this, node);
        this.hasReturned = false;
    };

    UnreachableWalker.prototype.visitBreakStatement = function (node) {
        _super.prototype.visitBreakStatement.call(this, node);
        this.hasReturned = true;
    };

    UnreachableWalker.prototype.visitContinueStatement = function (node) {
        _super.prototype.visitContinueStatement.call(this, node);
        this.hasReturned = true;
    };

    UnreachableWalker.prototype.visitReturnStatement = function (node) {
        _super.prototype.visitReturnStatement.call(this, node);
        this.hasReturned = true;
    };

    UnreachableWalker.prototype.visitThrowStatement = function (node) {
        _super.prototype.visitThrowStatement.call(this, node);
        this.hasReturned = true;
    };
    return UnreachableWalker;
})(Lint.RuleWalker);

